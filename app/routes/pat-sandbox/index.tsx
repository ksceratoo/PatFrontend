import { useState, useEffect } from "react";
import CodeBlock from "~/components/CodeBlockComponent/CodeBlock";
// Route types temporarily removed for simplicity
import PatEditor from "~/components/Editors/PatEditor";

export function meta() {
  return [
    { title: "Pat Sandbox - Interactive Communication Safety Demo" },
    {
      name: "description",
      content: "Explore Pat's mailbox types and communication safety features",
    },
  ];
}

// Pre-loaded examples with Pat vs Erlang comparison
const patErlangExamples = {
  helloWorld: {
    title: "Hello World",
    description: "Basic client-server communication with type safety",
    concepts: ["Interfaces", "Message Passing", "Guards"],
    patCode: `interface Greeter { Hello(Client!) }
interface Client { Reply(String) }

def greeter(self: Greeter?): Unit {
  guard self: *Hello {
    free -> ()
    receive Hello(client) from self ->
      client ! Reply("Hello, World!");
      greeter(self)
  }
}

def client(server: Greeter!): String {
  let clientMb = new [Client] in
  server ! Hello(clientMb);
  guard clientMb: Reply {
    receive Reply(msg) from clientMb ->
      free(clientMb);
      msg
  }
}

def main(): Unit {
  let serverMb = new [Greeter] in
  spawn {greeter(serverMb)};
  print(client(serverMb))
}`,
    erlangCode: `%% Erlang version - Same functionality but unsafe
-module(hello_world).
-export([greeter/0, client/1, main/0]).

greeter() ->
    receive
        {hello, ClientPid} ->
            ClientPid ! {reply, "Hello, World!"},
            greeter()
        %% ❌ PROBLEM: No exhaustive pattern matching
        %% Unexpected messages silently ignored
    end.

client(ServerPid) ->
    self() ! {reply, "Wrong message"}, %% ❌ PROBLEM: Race condition
    ServerPid ! {hello, self()},
    receive
        {reply, Msg} ->
            Msg
        %% ❌ PROBLEM: May receive wrong message
        %% No guarantee of message origin
    after 5000 ->
        error(timeout) %% ❌ PROBLEM: Potential deadlock
    end.

main() ->
    ServerPid = spawn(?MODULE, greeter, []),
    Result = client(ServerPid),
    io:format("~s~n", [Result]).`,
    explanation:
      "Demonstrates different approaches to type safety in concurrent communication",
    comparison: {
      patFeatures: [
        "Static interface definitions with compile-time verification",
        "Exhaustive pattern matching enforced by guard constructs",
        "Structured mailbox types prevent protocol deviations",
        "Capability-based send/receive operations",
      ],
      erlangCharacteristics: [
        "Dynamic message typing with runtime pattern matching",
        "Flexible receive clauses with catch-all patterns",
        "Process-based isolation with selective receive",
        "Built-in timeout mechanisms for fault tolerance",
      ],
    },
  },

  idServer: {
    title: "Id Server",
    description: "Stateful server with modular interface composition",
    concepts: ["State Management", "Server Patterns", "Resource Lifecycle"],
    patCode: `interface IdServer { Get(IdClient!) }
interface IdClient { Id(Int) }

def id_server(self: IdServer?, next: Int): Unit {
    guard self: *Get {
        free -> ()
        receive Get(client) from self ->
            client ! Id(next);
            id_server(self, next + 1)
    }
}

def id_client(serverMb: IdServer!): Int {
    let clientMb = new [IdClient] in
    serverMb ! Get(clientMb);
    guard clientMb: Id {
        receive Id(id) from clientMb ->
            free(clientMb);
            id
    }
}

def main(): Unit {
    let idServerMb = new [IdServer] in
    spawn {id_server(idServerMb, 0)};
    print(intToString(id_client(idServerMb)))
}`,
    erlangCode: `%% Erlang version - Common communication errors
-module(id_server).
-export([id_server/1, id_client/1, main/0]).

id_server(Next) ->
    receive
        {get, ClientPid} ->
            ClientPid ! {id, Next},
            id_server(Next + 1);
        {init, N} ->  %% ❌ PROBLEM: Unexpected reinitialization
            id_server(N);
        _ ->  %% ❌ PROBLEM: Silently ignore unknown messages
            id_server(Next)
    end.

id_client(ServerPid) ->
    ServerPid ! {get, self()},
    ServerPid ! {gte, self()}, %% ❌ PROBLEM: Typo in message tag
    receive
        {id, Id} -> Id;
        {reply, Id} -> Id  %% ❌ PROBLEM: Wrong message format
    after 1000 ->
        undefined  %% ❌ PROBLEM: Silent failure
    end.

main() ->
    ServerPid = spawn(?MODULE, id_server, [0]),
    ServerPid ! {init, 5},     %% ❌ PROBLEM: Multiple initialization
    ServerPid ! {init, 10},    %% ❌ PROBLEM: Conflicting state
    Id = id_client(ServerPid),
    io:format("ID: ~p~n", [Id]).`,
    explanation:
      "Compares static vs dynamic approaches to state management in actor systems",
    comparison: {
      patFeatures: [
        "Interface-based state management with formal protocols",
        "Lexically scoped mailbox references with ownership tracking",
        "Compositional type system for state transitions",
        "Structured guard expressions for message handling",
      ],
      erlangCharacteristics: [
        "Process state maintained through recursive function calls",
        "Pattern matching with wildcard clauses for flexibility",
        "Global process registry enables dynamic discovery",
        "Runtime message validation with error recovery",
      ],
    },
  },
};

export default function PatSandbox() {
  const [selectedExample, setSelectedExample] =
    useState<keyof typeof patErlangExamples>("helloWorld");
  const [code, setCode] = useState(patErlangExamples.helloWorld.patCode);
  const [showComparison, setShowComparison] = useState(false);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showExplanation, setShowExplanation] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "analysis" | "comparison"
  >("overview");
  const [codeModified, setCodeModified] = useState(false);

  // Update code when example changes, but only if code hasn't been modified
  useEffect(() => {
    if (!codeModified) {
      setCode(patErlangExamples[selectedExample].patCode);
    }
    setOutput("");
    setError("");
  }, [selectedExample, codeModified]);

  const executeCode = async () => {
    if (!code.trim()) {
      setError("Please enter some Pat code");
      return;
    }

    setIsLoading(true);
    setError("");
    setOutput("");

    try {
      // Call real Pat type checker API
      const response = await fetch("/api/check-pat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();

      if (result.success) {
        // Format successful type checking result
        let output = `Pat Type Checking: PASSED

${result.summary}

Type Information:
${result.typeInfo.map((info: string) => `• ${info}`).join("\n")}`;

        if (result.warnings && result.warnings.length > 0) {
          output += `\n\n⚠️ Warnings:
${result.warnings.map((w: any) => `• Line ${w.line}: ${w.message}`).join("\n")}`;
        }

        // If checker not available (edge case: success unlikely), append guidance just in case
        if (
          typeof result.summary === "string" &&
          result.summary.toLowerCase().includes("not available")
        ) {
          output +=
            `\n\nHow to enable Pat type checking on the server:\n` +
            `1) Build mbcheck (see patCom/paterl/mbcheck/README.md or https://github.com/SimonJF/mbcheck)\n` +
            `2) Place executable at patCom/paterl/mbcheck/mbcheck (chmod +x)\n` +
            `3) Restart the server and retry.`;
        }

        setOutput(output);
      } else {
        // Format error result
        let errorOutput = `Pat Type Checking: FAILED

${result.summary}

 Errors found:
${result.errors.map((e: any) => `• Line ${e.line}: [${e.type}] ${e.message}`).join("\n")}`;

        if (result.warnings && result.warnings.length > 0) {
          errorOutput += `\n\n⚠️ Warnings:
${result.warnings.map((w: any) => `• Line ${w.line}: ${w.message}`).join("\n")}`;
        }

        errorOutput += `\n\n Fix these errors to enable Pat's safety guarantees!`;

        // Guidance when checker not available
        if (
          typeof result.summary === "string" &&
          result.summary.toLowerCase().includes("not available")
        ) {
          errorOutput +=
            `\n\n🔧 How to enable Pat type checking on the server:\n` +
            `1) Build mbcheck (see patCom/paterl/mbcheck/README.md or https://github.com/SimonJF/mbcheck)\n` +
            `2) Ensure executable at patCom/paterl/mbcheck/mbcheck (chmod +x)\n` +
            `3) Restart the server and retry.`;
        }

        setOutput(errorOutput);
      }
    } catch (err) {
      setError(
        `Type checking error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadExample = (exampleKey: keyof typeof patErlangExamples) => {
    setSelectedExample(exampleKey);
    setCodeModified(false); // Reset modification flag when loading new example
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setCodeModified(true); // Mark code as modified when user changes it
  };

  const currentExample = patErlangExamples[selectedExample];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
            Pat Interactive Sandbox
          </h1>
          <p className="mt-2 text-gray-600 max-w-4xl">
            Explore communication safety through curated Pat examples. Compare
            with Erlang or edit and analyse Pat programs using the real type
            checker.
          </p>
        </header>
        {/* Horizontal examples bar */}
        <div className="mb-6 -mx-4 px-4">
          <div className="bg-white border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Examples</h2>
            </div>
            <div className="overflow-x-auto">
              <div className="flex gap-3 p-3 min-w-max">
                {Object.entries(patErlangExamples).map(([key, example]) => {
                  const selected =
                    selectedExample === (key as keyof typeof patErlangExamples);
                  return (
                    <button
                      key={key}
                      onClick={() =>
                        loadExample(key as keyof typeof patErlangExamples)
                      }
                      className={`shrink-0 text-left px-4 py-3 rounded-lg border transition w-64 ${
                        selected
                          ? "bg-gray-100 border-gray-300 text-gray-900"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                      title={example.title}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium truncate">
                          {example.title}
                        </span>
                        {selected && (
                          <span className="h-2 w-2 rounded-full bg-gray-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                        {example.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main: Content */}
        <section>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200 bg-white">
              <nav className="flex gap-6 px-4" aria-label="Tabs">
                {[
                  { id: "overview", name: "Overview" },
                  { id: "analysis", name: "Analysis" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-3 -mb-px border-b-2 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-4 md:p-6">
              {/* Overview */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {showExplanation && (
                    <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-base md:text-lg font-semibold text-gray-900">
                            {currentExample.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">
                            {currentExample.explanation}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {currentExample.concepts.map((c, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 text-xs rounded border border-gray-200 text-gray-700"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => setShowExplanation(false)}
                          className="text-gray-600 hover:text-gray-900"
                          aria-label="Hide explanation"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Toolbar */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">
                      {showComparison ? "Language Comparison" : "Pat Editor"}
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowComparison(!showComparison)}
                        className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 transition"
                      >
                        {showComparison
                          ? "Hide Erlang Code"
                          : "Show Erlang Code"}
                      </button>
                      {!showExplanation && (
                        <button
                          onClick={() => setShowExplanation(true)}
                          className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 transition"
                        >
                          Show Info
                        </button>
                      )}
                    </div>
                  </div>

                  {showComparison ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="rounded border border-gray-200 p-3 bg-white">
                          <div className="text-sm font-medium text-gray-900">
                            Pat Language
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            Static verification with mailbox types
                          </p>
                        </div>
                        <PatEditor
                          value={currentExample.patCode}
                          onChange={() => {}}
                          height="520px"
                          title=""
                          readOnly={true}
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="rounded border border-gray-200 p-3 bg-white">
                          <div className="text-sm font-medium text-gray-900">
                            Erlang Language
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            Dynamic typing with flexible patterns
                          </p>
                        </div>
                        <CodeBlock language="erlang" title="" height="520px">
                          {currentExample.erlangCode}
                        </CodeBlock>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded border border-gray-200 p-3 bg-white flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">
                          {currentExample.title} — Interactive Editor
                        </div>
                        <button
                          onClick={executeCode}
                          className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 disabled:opacity-50 transition"
                          disabled={isLoading}
                        >
                          {isLoading ? "Analyzing..." : "Analyze Code"}
                        </button>
                      </div>
                      <PatEditor
                        value={code}
                        onChange={handleCodeChange}
                        height="620px"
                        title=""
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Analysis */}
              {activeTab === "analysis" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">
                      Safety Analysis
                    </h4>
                    <button
                      onClick={executeCode}
                      className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 disabled:opacity-50 transition"
                      disabled={isLoading}
                    >
                      {isLoading ? "Analyzing..." : "Run Analysis"}
                    </button>
                  </div>

                  {output && (
                    <div
                      className={`rounded-lg border p-4 ${
                        output.includes("FAILED")
                          ? "border-red-200 bg-red-50"
                          : "border-green-200 bg-green-50"
                      }`}
                    >
                      <pre
                        className={`text-sm whitespace-pre-wrap font-mono ${
                          output.includes("FAILED")
                            ? "text-red-800"
                            : "text-green-800"
                        }`}
                      >
                        {output}
                      </pre>
                    </div>
                  )}

                  {error && (
                    <div className="rounded-lg border border-red-200 p-4 bg-red-50">
                      <pre className="text-sm text-red-800 whitespace-pre-wrap font-mono">
                        {error}
                      </pre>
                    </div>
                  )}

                  {isLoading && (
                    <div className="rounded-lg border border-gray-200 p-6 text-center text-gray-600 bg-gray-50">
                      Analyzing Pat code...
                    </div>
                  )}

                  {!output && !error && !isLoading && (
                    <div className="rounded-lg border border-gray-200 p-6 text-center text-gray-500 bg-gray-50">
                      Ready for analysis. Click "Run Analysis" to verify
                      communication safety.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
