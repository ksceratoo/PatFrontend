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

    // Check if we're in a serverless environment that can't run mbcheck
    const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

    if (isVercel) {
      // For Vercel, provide a fallback analysis
      const fallbackResult = await runFallbackAnalysis(code);
      return Response.json(fallbackResult);
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

// Fallback analysis for serverless environments where mbcheck can't run
async function runFallbackAnalysis(code: string) {
  const errors: any[] = [];
  const warnings: any[] = [];
  const typeInfo: string[] = [];

  // Basic syntax checks
  const lines = code.split("\n");

  // Check for basic Pat syntax
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Check for common syntax errors
    if (line.includes("interface") && !line.includes("{")) {
      errors.push({
        type: "Syntax Error",
        message: "Interface declaration missing opening brace '{'",
        line: lineNum,
        severity: "error",
      });
    }

    if (line.includes("def ") && !line.includes(":")) {
      errors.push({
        type: "Syntax Error",
        message: "Function definition missing return type annotation",
        line: lineNum,
        severity: "error",
      });
    }

    // Check for unmatched braces
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
      warnings.push({
        type: "Warning",
        message: "Possible unmatched opening brace",
        line: lineNum,
        severity: "warning",
      });
    }
  }

  // Check for basic structure
  if (!code.includes("interface")) {
    warnings.push({
      type: "Warning",
      message:
        "No interface definitions found - consider adding type specifications",
      line: 1,
      severity: "warning",
    });
  }

  if (!code.includes("def ")) {
    warnings.push({
      type: "Warning",
      message: "No function definitions found",
      line: 1,
      severity: "warning",
    });
  }

  // Provide basic type information
  if (code.includes("interface")) {
    typeInfo.push("Basic interface syntax validation completed");
  }

  if (code.includes("def ")) {
    typeInfo.push("Function definitions detected");
  }

  if (code.includes("spawn")) {
    typeInfo.push("Concurrent process spawning detected");
  }

  if (code.includes("guard")) {
    typeInfo.push("Message guard patterns detected");
  }

  const success = errors.length === 0;

  return {
    success,
    errors,
    warnings,
    typeInfo,
    summary: success
      ? "Basic Pat syntax analysis completed - full type checking requires local development environment"
      : `Found ${errors.length} syntax issues - please review and fix`,
    error:
      "Running in serverless environment - full mbcheck analysis not available. Please test locally for complete type checking.",
  };
}

// Run real mbcheck on Pat code
async function runMbcheck(code: string) {
  const tempFileName = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}.pat`;
  const mbcheckDir = path.join(process.cwd(), "patCom", "paterl", "mbcheck");
  const tempFilePath = path.join(mbcheckDir, tempFileName);
  const mbcheckPath = path.join(mbcheckDir, "mbcheck");

  // Check if we're in a serverless environment
  const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

  try {
    // Preflight: ensure mbcheck exists and is executable
    try {
      await access(mbcheckPath, fs.constants.X_OK);
    } catch (accessError) {
      console.error("mbcheck access error:", accessError);
      return {
        success: false,
        errors: [],
        warnings: [],
        typeInfo: [],
        summary: "Pat type checker is not available on the server",
        error:
          `Missing or non-executable mbcheck at: ${mbcheckPath}.\n` +
          `Environment: ${isVercel ? "Vercel serverless" : "Local development"}\n` +
          `Please build it (see patCom/paterl/mbcheck/README.md) or adjust the server path.`,
      };
    }

    // Write Pat code to temporary file
    await writeFile(tempFilePath, code, "utf8");

    // Run mbcheck with verbose output
    // Use absolute path and handle serverless environment limitations
    const command = isVercel
      ? `"${mbcheckPath}" "${tempFilePath}" -v`
      : `cd "${mbcheckDir}" && ./"${path.basename(mbcheckPath)}" "${tempFileName}" -v`;

    console.log("Executing mbcheck command:", command);

    const { stdout, stderr } = await execAsync(command, {
      timeout: isVercel ? 5000 : 10000, // Shorter timeout for serverless
      maxBuffer: 1024 * 1024, // 1MB buffer
      env: {
        ...process.env,
        PATH: `${process.env.PATH}:/usr/local/bin:/usr/bin:/bin`,
      },
    });

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

    console.error("mbcheck execution error:", error);

    // Handle different types of errors
    if (error.code === "ENOENT") {
      return {
        success: false,
        errors: [],
        warnings: [],
        typeInfo: [],
        summary: "Pat type checker executable not found",
        error: `mbcheck executable not found at: ${mbcheckPath}. This may be due to deployment environment limitations.`,
      };
    } else if (error.code === "EACCES") {
      return {
        success: false,
        errors: [],
        warnings: [],
        typeInfo: [],
        summary: "Pat type checker permission denied",
        error: `Permission denied for mbcheck executable. Please check file permissions.`,
      };
    } else if (error.code === 123) {
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
    } else if (error.code === "ETIMEDOUT") {
      return {
        success: false,
        errors: [
          {
            type: "Timeout Error",
            message: `Type checking timed out after ${isVercel ? "5" : "10"} seconds`,
            line: 1,
            severity: "error",
          },
        ],
        warnings: [],
        typeInfo: [],
        summary: "Type checking timeout",
        error: isVercel
          ? "Vercel serverless function timeout. Consider using a dedicated server."
          : "Local execution timeout.",
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
        error: `Environment: ${isVercel ? "Vercel serverless" : "Local development"}\nFull error: ${error.stack || error.message}`,
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
