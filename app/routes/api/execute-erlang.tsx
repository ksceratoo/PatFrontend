import { exec } from "child_process";
import { promisify } from "util";
import { access } from "fs/promises";
import fs from "fs";

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
      // Resolve Docker path and test availability
      const candidatePaths = [
        process.env.DOCKER_PATH,
        "/usr/local/bin/docker",
        "/usr/bin/docker",
        "/bin/docker",
      ].filter(Boolean) as string[];

      let dockerPath = "";
      for (const p of candidatePaths) {
        try {
          await access(p, fs.constants.X_OK);
          dockerPath = p;
          break;
        } catch {}
      }
      // If not found by access, try which
      if (!dockerPath) {
        try {
          const { stdout } = await execAsync(`which docker`, { timeout: 3000 });
          dockerPath = stdout.trim();
        } catch {}
      }
      if (!dockerPath) {
        return Response.json({
          success: false,
          error:
            "Docker is not available on this server. Please install and start Docker Desktop (or daemon), then retry.",
        });
      }
      // Test docker
      try {
        await execAsync(`${dockerPath} version`, { timeout: 5000 });
      } catch (dockerTestError: any) {
        return Response.json({
          success: false,
          error: `Docker not accessible: ${dockerTestError.message}. Ensure Docker is running and the user has permissions.`,
        });
      }

      // use Docker to execute the Erlang code without volume mounting (to avoid permissions issues)
      const moduleMatch = code.match(/-module\(([^)]+)\)/);
      const moduleName = moduleMatch ? moduleMatch[1] : "temp_module";

      // Escape the code for shell injection and encode as base64 to avoid complex escaping
      const encodedCode = Buffer.from(code).toString("base64");

      const dockerCommand = `${dockerPath} run --rm erlang:27-alpine sh -c "echo '${encodedCode}' | base64 -d > ${moduleName}.erl && erlc ${moduleName}.erl && erl -noshell -eval '${moduleName}:main().' -s init stop"`;

      const { stdout, stderr } = await execAsync(dockerCommand, {
        timeout: 10000, // 10 seconds timeout
        maxBuffer: 1024 * 1024, // 1MB output limit
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

      // Check if this is an Erlang compilation error first
      if (execError.stderr) {
        const stderr = execError.stderr;

        // Check for Erlang compilation errors
        if (
          stderr.includes(".erl:") &&
          (stderr.includes("syntax error") || stderr.includes("error"))
        ) {
          // Extract and format Erlang compilation errors
          const erlangErrors = stderr
            .split("\n")
            .filter(
              (line: string) =>
                line.includes(".erl:") ||
                line.includes("error") ||
                line.includes("warning")
            )
            .map((line: string) => line.trim())
            .filter((line: string) => line.length > 0)
            .join("\n");

          return Response.json({
            success: false,
            error: `Erlang Compilation Error:\n${erlangErrors}`,
            output: execError.stdout || null,
          });
        }

        // Check for Erlang runtime errors
        if (
          stderr.includes("undefined function") ||
          stderr.includes("function_clause") ||
          stderr.includes("badarg") ||
          stderr.includes("undef") ||
          stderr.includes("** exception") ||
          stderr.includes("** Error:")
        ) {
          return Response.json({
            success: false,
            error: `Erlang Runtime Error:\n${stderr}`,
            output: execError.stdout || null,
          });
        }
      }

      // Check for general Erlang execution failures (not Docker issues)
      const combinedOutput =
        (execError.stderr || "") + "\n" + (execError.stdout || "");

      // If the command failed and it's not a real Docker infrastructure issue,
      // it's likely an Erlang issue
      if (
        execError.code !== 0 &&
        !errorMessage.includes("command not found") &&
        !errorMessage.includes("Cannot connect to the Docker daemon") &&
        !errorMessage.includes("authentication required") &&
        !errorMessage.includes("login") &&
        !errorMessage.includes("permission denied") &&
        !errorMessage.includes("docker daemon")
      ) {
        let erlangError = combinedOutput.trim();

        // If we don't have specific error output, provide helpful guidance
        if (!erlangError || erlangError.length < 10) {
          // Extract module name from code for helpful error message
          const moduleMatch = code.match(/-module\(([^)]+)\)/);
          const moduleNameForError = moduleMatch
            ? moduleMatch[1]
            : "temp_module";

          erlangError = `Code execution failed. Make sure your module exports a main/0 function.

Example:
-module(${moduleNameForError}).
-export([main/0]).

main() ->
    io:format("Hello World~n").`;
        }

        return Response.json({
          success: false,
          error: `Erlang Error:\n${erlangError}`,
          output: null,
        });
      }

      // Handle Docker-specific errors
      if (
        errorMessage.includes("authentication required") ||
        errorMessage.includes("login")
      ) {
        errorMessage =
          "Docker authentication required. Please run 'docker login' in your terminal, or the Docker image may need to be pulled first.";
      } else if (
        errorMessage.includes("command not found") ||
        errorMessage.includes("docker") ||
        errorMessage.includes("Cannot connect to the Docker daemon")
      ) {
        errorMessage = `Docker is not installed or not running. Please install Docker and ensure it's running (try 'docker version').`;
      } else {
        // For other errors, show both stdout and stderr if available
        const debugInfo = [];
        if (execError.stdout) debugInfo.push(`Output: ${execError.stdout}`);
        if (execError.stderr) debugInfo.push(`Error: ${execError.stderr}`);
        if (debugInfo.length > 0) {
          errorMessage = debugInfo.join("\n");
        } else {
          errorMessage = `Execution failed: ${errorMessage}`;
        }
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
