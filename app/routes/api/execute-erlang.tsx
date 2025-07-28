import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// POST /api/execute-erlang
export async function action({ request }: any) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return Response.json(
        {
          success: false,
          error: "Invalid code provided",
        },
        { status: 400 }
      );
    }

    try {
      // Test Docker connection first
      const dockerPath = "/usr/local/bin/docker";
      try {
        await execAsync(`${dockerPath} version`, {
          timeout: 5000,
          env: {
            ...process.env,
            PATH: `/usr/local/bin:${process.env.PATH || ""}`,
          },
        });
      } catch (dockerTestError: any) {
        console.log("Docker test failed:", dockerTestError.message);
        throw new Error(`Docker not accessible: ${dockerTestError.message}`);
      }

      // use Docker to execute the Erlang code without volume mounting (avoiding permissions issues)
      const moduleMatch = code.match(/-module\(([^)]+)\)/);
      const moduleName = moduleMatch ? moduleMatch[1] : "temp_module";

      // Escape the code for shell injection and encode as base64 to avoid complex escaping
      const encodedCode = Buffer.from(code).toString("base64");

      const dockerCommand = `${dockerPath} run --rm erlang:27-alpine sh -c "echo '${encodedCode}' | base64 -d > ${moduleName}.erl && erlc ${moduleName}.erl && erl -noshell -eval '${moduleName}:main().' -s init stop"`;

      const { stdout, stderr } = await execAsync(dockerCommand, {
        timeout: 10000, // 10 seconds timeout
        maxBuffer: 1024 * 1024, // 1MB output limit
        env: {
          ...process.env,
          PATH: `/usr/local/bin:${process.env.PATH || ""}`,
        },
      });

      return Response.json({
        success: true,
        output: stdout,
        error: stderr || null,
      });
    } catch (execError: any) {
      let errorMessage = execError.message || "Execution failed";

      // Debug: Log the actual error for troubleshooting
      console.log("Docker execution error:", {
        message: execError.message,
        code: execError.code,
        stderr: execError.stderr,
        stdout: execError.stdout,
      });

      // Handle Docker authentication errors specifically
      if (
        errorMessage.includes("authentication required") ||
        errorMessage.includes("login")
      ) {
        errorMessage =
          "Docker authentication required. Please run 'docker login' in your terminal, or the Docker image may need to be pulled first.";
      } else if (
        errorMessage.includes("command not found") ||
        errorMessage.includes("docker")
      ) {
        errorMessage = `Docker is not installed or not running. Please install Docker Desktop and ensure it's running. 
          DEBUG: ${execError.message}`;
      } else {
        // Show the actual error message for debugging
        errorMessage = `Execution failed: ${errorMessage}`;
      }

      return Response.json({
        success: false,
        error: errorMessage,
        output: execError.stdout || null,
      });
    }
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        error: error.message || "Server error",
      },
      { status: 500 }
    );
  }
}
