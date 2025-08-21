// Simplified Pat type checker API for production deployment
// This version works without requiring mbcheck binary

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

    // Use simplified type checking
    const typeCheckResult = await runSimplifiedTypeChecker(code);

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

// Simplified type checker that doesn't require mbcheck binary
async function runSimplifiedTypeChecker(code: string) {
  try {
    // Basic syntax validation for Pat code
    const syntaxCheck = validatePatSyntax(code);

    if (!syntaxCheck.valid) {
      return {
        success: false,
        errors: syntaxCheck.errors,
        warnings: [],
        typeInfo: [],
        summary: "❌ Syntax errors found - please check your Pat code",
      };
    }

    // Basic semantic checks
    const semanticCheck = validatePatSemantics(code);

    return {
      success: semanticCheck.success,
      errors: semanticCheck.errors,
      warnings: semanticCheck.warnings,
      typeInfo: semanticCheck.typeInfo,
      summary: semanticCheck.success
        ? "✅ Basic validation passed - This is a simplified checker. For full type checking with mailbox safety guarantees, please use a local setup with mbcheck."
        : "❌ Semantic errors found - please check your Pat code",
      isSimplified: true,
    };
  } catch (error: any) {
    return {
      success: false,
      errors: [
        {
          type: "System Error",
          message: `Type checker error: ${error.message}`,
          line: 1,
          severity: "error",
        },
      ],
      warnings: [],
      typeInfo: [],
      summary: "Type checking system error",
      isSimplified: true,
    };
  }
}

// Basic Pat syntax validation
function validatePatSyntax(code: string) {
  const errors: any[] = [];
  const lines = code.split("\n");
  let braceStack: string[] = [];
  let inInterface = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNum = i + 1;

    // Skip empty lines and comments
    if (!line || line.startsWith("//")) continue;

    // Track brace matching
    for (const char of line) {
      if (char === "{") {
        braceStack.push("{");
      } else if (char === "}") {
        if (braceStack.length === 0) {
          errors.push({
            type: "Syntax Error",
            message: "Unmatched closing brace",
            line: lineNum,
            severity: "error",
          });
        } else {
          braceStack.pop();
        }
      }
    }

    // Check interface declarations
    if (line.startsWith("interface")) {
      if (!line.includes("{")) {
        errors.push({
          type: "Syntax Error",
          message:
            "Interface declaration must be followed by opening brace on same line",
          line: lineNum,
          severity: "error",
        });
      }
      inInterface = true;
    }

    // Check guard statements
    if (line.includes("guard") && !line.includes(":")) {
      errors.push({
        type: "Syntax Error",
        message: "Guard statement missing type annotation (:)",
        line: lineNum,
        severity: "error",
      });
    }

    // Check receive statements
    if (line.includes("receive") && !line.includes("->")) {
      errors.push({
        type: "Syntax Error",
        message: "Receive statement missing arrow (->)",
        line: lineNum,
        severity: "error",
      });
    }

    // Check function definitions
    if (line.startsWith("def ") && !line.includes("(")) {
      errors.push({
        type: "Syntax Error",
        message: "Function definition missing parameter list",
        line: lineNum,
        severity: "error",
      });
    }

    // Check let bindings
    if (line.includes("let ") && !line.includes("=") && !line.includes("in")) {
      errors.push({
        type: "Syntax Error",
        message: "Let binding missing assignment (=) or continuation (in)",
        line: lineNum,
        severity: "error",
      });
    }
  }

  // Check for unmatched braces at end
  if (braceStack.length > 0) {
    errors.push({
      type: "Syntax Error",
      message: `${braceStack.length} unmatched opening brace(s)`,
      line: lines.length,
      severity: "error",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Basic Pat semantic validation
function validatePatSemantics(code: string) {
  const errors: any[] = [];
  const warnings: any[] = [];
  const typeInfo: string[] = [];

  // Extract interfaces
  const interfaces = extractInterfaces(code);
  if (interfaces.length > 0) {
    typeInfo.push(
      `✓ Found ${interfaces.length} interface(s): ${interfaces.join(", ")}`
    );
  }

  // Extract functions/definitions
  const definitions = extractDefinitions(code);
  if (definitions.length > 0) {
    typeInfo.push(
      `✓ Found ${definitions.length} definition(s): ${definitions.join(", ")}`
    );
  }

  // Check for mailbox operations
  const hasSpawn = code.includes("spawn");
  const hasNew = code.includes("new[");
  const hasSend = code.includes("!");
  const hasGuard = code.includes("guard");
  const hasReceive = code.includes("receive");
  const hasFree = code.includes("free");

  if (hasSpawn) typeInfo.push("✓ Concurrent spawning detected");
  if (hasNew) typeInfo.push("✓ Mailbox creation detected");
  if (hasSend) typeInfo.push("✓ Message sending detected");
  if (hasGuard) typeInfo.push("✓ Guard patterns detected");
  if (hasReceive) typeInfo.push("✓ Message receiving detected");
  if (hasFree) typeInfo.push("✓ Resource freeing detected");

  // Basic validation warnings
  if (hasNew && !hasGuard && !hasReceive) {
    warnings.push({
      type: "Potential Issue",
      message:
        "Mailbox created but no guard patterns or receive statements found - messages may not be consumed",
      line: 1,
      severity: "warning",
    });
  }

  if (hasSend && !hasNew) {
    warnings.push({
      type: "Potential Issue",
      message:
        "Messages sent but no mailbox creation found - verify target mailboxes exist",
      line: 1,
      severity: "warning",
    });
  }

  if (hasSpawn && !hasSend && !hasNew) {
    warnings.push({
      type: "Potential Issue",
      message:
        "Process spawned but no communication detected - consider adding mailbox operations",
      line: 1,
      severity: "warning",
    });
  }

  // Check for potential resource leaks
  const newCount = (code.match(/new\[/g) || []).length;
  const freeCount = (code.match(/free\(/g) || []).length;

  if (newCount > freeCount && newCount > 0) {
    warnings.push({
      type: "Resource Management",
      message: `${newCount} mailbox(es) created but only ${freeCount} freed - potential resource leak`,
      line: 1,
      severity: "warning",
    });
  }

  return {
    success: errors.length === 0,
    errors,
    warnings,
    typeInfo,
  };
}

// Extract interface names from code
function extractInterfaces(code: string): string[] {
  const interfaceRegex = /interface\s+(\w+)/g;
  const interfaces: string[] = [];
  let match;

  while ((match = interfaceRegex.exec(code)) !== null) {
    interfaces.push(match[1]);
  }

  return interfaces;
}

// Extract definition names from code
function extractDefinitions(code: string): string[] {
  const defRegex = /def\s+(\w+)/g;
  const definitions: string[] = [];
  let match;

  while ((match = defRegex.exec(code)) !== null) {
    definitions.push(match[1]);
  }

  return definitions;
}
