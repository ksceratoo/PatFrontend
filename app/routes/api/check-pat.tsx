import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, unlink, access } from "fs/promises";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

// POST /api/check-pat
export async function action({ request }: any) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return Response.json(
        {
          success: false,
          error: "Invalid Pat code provided",
        },
        { status: 400 }
      );
    }

    // Use real mbcheck for Pat type checking
    const typeCheckResult = await runMbcheck(code);

    return Response.json(typeCheckResult);
  } catch (error: any) {
    console.error("API error:", error);
    return Response.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Run real mbcheck on Pat code
async function runMbcheck(code: string) {
  const tempFileName = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}.pat`;
  const mbcheckDir = path.join(process.cwd(), "mbcheck");
  const tempFilePath = path.join(mbcheckDir, tempFileName);

  // Try pre-built binary first, then fallback to build directory
  let mbcheckPath = path.join(process.cwd(), "mbcheck-linux");
  if (!require("fs").existsSync(mbcheckPath)) {
    mbcheckPath = path.join(mbcheckDir, "_build", "default", "bin", "main.exe");
  }

  try {
    // Preflight: ensure mbcheck exists and is executable
    try {
      await access(mbcheckPath, fs.constants.X_OK);
    } catch {
      return {
        success: false,
        errors: [],
        warnings: [],
        typeInfo: [],
        summary: "Pat type checker is not available on the server",
        error:
          `Missing or non-executable mbcheck at: ${mbcheckPath}.\n` +
          `Please build it (see mbcheck/README.md) or adjust the server path.`,
      };
    }

    // Write Pat code to temporary file
    await writeFile(tempFilePath, code, "utf8");

    // Run mbcheck with verbose output
    const { stdout, stderr } = await execAsync(
      `"${mbcheckPath}" "${tempFilePath}" -v`,
      {
        timeout: 10000, // 10 second timeout
      }
    );

    // Parse mbcheck output
    const result = parseMbcheckOutput(stdout, stderr);

    // Clean up temporary file
    await unlink(tempFilePath);

    return result;
  } catch (error: any) {
    // Clean up temporary file on error
    try {
      await unlink(tempFilePath);
    } catch {}

    // Handle mbcheck errors
    if (error.code === 123) {
      // mbcheck type checking failed
      return parseMbcheckError(error.stderr || error.stdout || error.message);
    } else if (error.code === 124) {
      // mbcheck command line error
      return {
        success: false,
        errors: [
          {
            type: "Syntax Error",
            message: "Invalid Pat syntax - could not parse the code",
            line: 1,
            severity: "error",
          },
        ],
        warnings: [],
        typeInfo: [],
        summary: "Pat syntax error - please check your code structure",
      };
    } else {
      // Other errors (timeout, file system, etc.)
      return {
        success: false,
        errors: [
          {
            type: "System Error",
            message: `Type checking failed: ${error.message}`,
            line: 1,
            severity: "error",
          },
        ],
        warnings: [],
        typeInfo: [],
        summary: "Type checking system error",
      };
    }
  }
}

// Parse successful mbcheck output
function parseMbcheckOutput(stdout: string, stderr: string) {
  const lines = stdout.split("\n");
  const typeInfo: string[] = [];
  const warnings: any[] = [];

  // Look for final type result
  const typeMatch = stdout.match(/Type:\s*(.+)$/m);
  if (typeMatch) {
    typeInfo.push(` Type checking passed - Program type: ${typeMatch[1]}`);
  }

  // Look for constraint solving info
  if (stdout.includes("=== Resolved Program: ===")) {
    typeInfo.push(" All mailbox constraints successfully resolved");
  }

  // Look for interface information
  const interfaceMatches = stdout.match(/interface\s+\w+/g);
  if (interfaceMatches && interfaceMatches.length > 0) {
    typeInfo.push(` ${interfaceMatches.length} interface(s) verified`);
  }

  // Look for guard patterns
  const guardMatches = stdout.match(/guard\s+\w+\s*:\s*[^\{]+/g);
  if (guardMatches && guardMatches.length > 0) {
    typeInfo.push(` ${guardMatches.length} guard pattern(s) type-checked`);
  }

  return {
    success: true,
    errors: [],
    warnings,
    typeInfo,
    summary: "Pat type checking passed, all mailbox communications are safe!",
    rawOutput: stdout, // Include raw output for debugging
  };
}

// Parse mbcheck error output
function parseMbcheckError(errorOutput: string) {
  const errors: any[] = [];
  const lines = errorOutput.split("\n");

  // Common mbcheck error patterns
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Parse line number from error messages
    const lineMatch = line.match(/line (\d+)/);
    const lineNum = lineMatch ? parseInt(lineMatch[1]) : 1;

    if (line.includes("Parse error") || line.includes("syntax error")) {
      errors.push({
        type: "Syntax Error",
        message: line.trim(),
        line: lineNum,
        severity: "error",
      });
    } else if (line.includes("Type error") || line.includes("type mismatch")) {
      errors.push({
        type: "Type Error",
        message: line.trim(),
        line: lineNum,
        severity: "error",
      });
    } else if (line.includes("Constraint") || line.includes("constraint")) {
      errors.push({
        type: "Constraint Error",
        message: line.trim(),
        line: lineNum,
        severity: "error",
      });
    } else if (line.includes("Mailbox") || line.includes("mailbox")) {
      errors.push({
        type: "Mailbox Error",
        message: line.trim(),
        line: lineNum,
        severity: "error",
      });
    } else if (line.trim() && line.includes("Error")) {
      errors.push({
        type: "Pat Error",
        message: line.trim(),
        line: lineNum,
        severity: "error",
      });
    }
  }

  // If no specific errors found, create a general error
  if (errors.length === 0) {
    errors.push({
      type: "Type Checking Failed",
      message: errorOutput.trim() || "Pat type checking failed",
      line: 1,
      severity: "error",
    });
  }

  return {
    success: false,
    errors,
    warnings: [],
    typeInfo: [],
    summary: `❌ Found ${errors.length} type error(s) - Pat type checking failed`,
    rawOutput: errorOutput,
  };
}
