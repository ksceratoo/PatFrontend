import { useState } from "react";
import ErlangEditor from "../../components/Editors/ErlangEditor";
import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Erlang Sandbox - Pat" },
    { name: "description", content: "Test and run Erlang code online" },
  ];
}

export default function ErlangSandbox() {
  const [code, setCode] = useState(`-module(hello).
-export([main/0]).

main() ->
    io:format("Hello, Erlang World!~n").`);

  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const executeCode = async () => {
    if (!code.trim()) {
      setError("Please enter some Erlang code");
      return;
    }

    setIsLoading(true);
    setError("");
    setOutput("");

    try {
      const response = await fetch("/api/execute-erlang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();

      if (result.success) {
        setOutput(result.output || "Code executed successfully (no output)");
        if (result.error) {
          setError(`Warnings: ${result.error}`);
        }
      } else {
        setError(result.error || "Execution failed");
      }
    } catch (err) {
      setError(
        `Network error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setCode("");
    setOutput("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Erlang Code Sandbox
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Code Editor */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Code Editor
              </h2>
              <div className="space-x-2">
                <button
                  onClick={clearAll}
                  className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Clear
                </button>
                <button
                  onClick={executeCode}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Running..." : "Run Code"}
                </button>
              </div>
            </div>

            <ErlangEditor
              value={code}
              onChange={setCode}
              readOnly={isLoading}
              height="400px"
              title="Erlang Code Editor"
            />

            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>Tips:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Your module must export a <code>main/0</code> function
                </li>
                <li>
                  Use <code>io:format("Hello~n")</code> to print output
                </li>
                <li>Remember to end statements with periods (.)</li>
              </ul>
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Output</h2>

            {/* Success Output */}
            {output && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-green-700 mb-2">
                  Output:
                </h3>
                <pre className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-800 overflow-auto max-h-48">
                  {output}
                </pre>
              </div>
            )}

            {/* Error Output */}
            {error && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-red-700 mb-2">
                  Error:
                </h3>
                <pre className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-800 overflow-auto max-h-48">
                  {error}
                </pre>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center h-32">
                <div className="text-blue-600">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Executing code...
                </div>
              </div>
            )}

            {/* Default State */}
            {!output && !error && !isLoading && (
              <div className="text-gray-500 text-center h-32 flex items-center justify-center">
                Click "Run Code" to see the output here
              </div>
            )}
          </div>
        </div>

        {/* Examples Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Example Code
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() =>
                setCode(`-module(hello).
-export([main/0]).

main() ->
    io:format("Hello, Erlang World!~n").`)
              }
              className="text-left p-4 bg-gray-50 rounded border hover:bg-gray-100"
            >
              <h3 className="font-medium text-gray-900">Hello World</h3>
              <p className="text-sm text-gray-600">Basic output example</p>
            </button>

            <button
              onClick={() =>
                setCode(`-module(math_demo).
-export([main/0]).

main() ->
    X = 10,
    Y = 20,
    Sum = X + Y,
    io:format("~p + ~p = ~p~n", [X, Y, Sum]).`)
              }
              className="text-left p-4 bg-gray-50 rounded border hover:bg-gray-100"
            >
              <h3 className="font-medium text-gray-900">Simple Math</h3>
              <p className="text-sm text-gray-600">Variables and arithmetic</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
