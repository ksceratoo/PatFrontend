import { useState, useEffect } from "react";
import CodeBlock from "../../components/CodeBlockComponent/CodeBlock";
import PatEditor from "../../components/Editors/PatEditor";

export function meta() {
  return [
    { title: "Communication Errors - Pat Language Platform" },
    {
      name: "description",
      content:
        "Interactive demonstration of communication errors that Pat prevents at compile-time",
    },
  ];
}

// Base Id Server implementation in Pat (correct version)
const baseIdServerPat = `interface IdServer { Get(IdClient!) }
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
}`;

// Error examples
const errorExamples = {
  messageType: {
    title: "1. Message Tag Errors",
    subtitle: "(wrong tag, wrong payload)",
    description:
      "What happens when you send the wrong message type or payload?",
    patError: `interface IdServer { Get(IdClient!) }
 interface IdClient { Id(Int) }
 
 def id_client(serverMb: IdServer!): Int {
     let clientMb = new [IdClient] in
     # ERROR: Wrong message tag - should be Get()
     serverMb ! GetId(clientMb);  # ❌ GetId instead of Get
     guard clientMb: Id {
         receive Id(id) from clientMb ->
             free(clientMb);
             id
     }
 }`,
    patError2: `interface IdServer { Get(IdClient!) }
 interface IdClient { Id(Int) }
 
 def id_client(serverMb: IdServer!): Int {
     let clientMb = new [IdClient] in
     # ERROR: Wrong payload type - should be IdClient!
     serverMb ! Get("wrong_type");  # ❌ String instead of IdClient!
     guard clientMb: Id {
         receive Id(id) from clientMb ->
             free(clientMb);
             id
     }
 }`,
    // Full runnable variants
    fullPatError: `interface IdServer { Get(IdClient!) }
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
     # ERROR: Wrong message tag - should be Get()
     serverMb ! GetId(clientMb);  # ❌ GetId instead of Get
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
    fullPatError2: `interface IdServer { Get(IdClient!) }
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
     # ERROR: Wrong payload type - should be IdClient!
     serverMb ! Get("wrong_type");  # ❌ String instead of IdClient!
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
    error1Label: "Wrong Tag",
    error2Label: "Wrong Payload Type",
    erlangProblem: `%% In Erlang - this compiles but crashes at runtime!
 id_client(ServerPid) ->
     ServerPid ! {get_id, self()},  %% Wrong tag - should be {get, self()}
     receive
         {id, Id} -> Id
     after 5000 -> 
         error(timeout)  %% Runtime crash!
     end.`,
    explanation:
      "Pat catches message type mismatches at compile time, while Erlang discovers them at runtime (or never).",
  },

  behavioural: {
    title: "2. Behavioural Type Errors",
    subtitle: "(repeated initialisation, forgotten reply)",
    description: "What happens when you violate the communication protocol?",
    patError: `interface IdServer { Get(IdClient!) }
 interface IdClient { Id(Int) }
 
 def id_server(self: IdServer?, next: Int): Unit {
     guard self: *Get {
         free -> ()
         receive Get(client) from self ->
             # ERROR: Forgotten reply - client expects Id(next)
             id_server(self, next + 1)  # ❌ No client ! Id(next)
     }
 }`,
    patError2: `interface IdServer { Get(IdClient!) }
 interface IdClient { Id(Int) }
 
 def id_client(serverMb: IdServer!): Int {
     let clientMb = new [IdClient] in
     serverMb ! Get(clientMb);
     serverMb ! Get(clientMb);  # ❌ Repeated request
     guard clientMb: Id {
         receive Id(id) from clientMb ->
             free(clientMb);
             id
     }
 }`,
    fullPatError: `interface IdServer { Get(IdClient!) }
 interface IdClient { Id(Int) }
 
 def id_server(self: IdServer?, next: Int): Unit {
     guard self: *Get {
         free -> ()
         receive Get(client) from self ->
             # ERROR: Forgotten reply - client expects Id(next)
             id_server(self, next + 1)  # ❌ No client ! Id(next)
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
    fullPatError2: `interface IdServer { Get(IdClient!) }
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
     serverMb ! Get(clientMb);  # ❌ Repeated request
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
    error1Label: "Forgotten Reply (Server)",
    error2Label: "Repeated Request (Client)",
    erlangProblem: `%% In Erlang - silent protocol violations!
 id_server(Next) ->
     receive
         {get, ClientPid} ->
             %% Forgot to reply! Client will timeout
             id_server(Next + 1)  %% ❌ No ClientPid ! {id, Next}
     end.`,
    explanation:
      "Pat's behavioral types ensure complete protocol coverage, preventing forgotten replies and protocol violations.",
  },

  guardViolation: {
    title: "3. Guard Pattern Violations",
    subtitle: "(incomplete receive patterns, wrong guards)",
    description:
      "What happens when your receive patterns don't match your interface?",
    patError: `interface IdServer { Get(IdClient!) }
 interface IdClient { Id(Int) }
 
 def id_client(serverMb: IdServer!): Int {
     let clientMb = new [IdClient] in
     serverMb ! Get(clientMb);
     # ERROR: Wrong guard pattern - expecting Id but guarding for Response
     guard clientMb: Response {  # ❌ Response not defined in IdClient
         receive Response(msg) from clientMb ->
             free(clientMb);
             0
     }
 }`,
    patError2: `interface IdServer { Get(IdClient!) }
 interface IdClient { Id(Int) }
 
 def id_client(serverMb: IdServer!): Int {
     let clientMb = new [IdClient] in
     serverMb ! Get(clientMb);
     # ERROR: No guard at all - violates mailbox safety
     receive Id(id) from clientMb ->  # ❌ Missing guard assertion
         free(clientMb);
         id
 }`,
    fullPatError: `interface IdServer { Get(IdClient!) }
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
     # ERROR: Wrong guard pattern - expecting Id but guarding for Response
     guard clientMb: Response {  # ❌ Response not defined in IdClient
         receive Response(msg) from clientMb ->
             free(clientMb);
             0
     }
 }
 
 def main(): Unit {
     let idServerMb = new [IdServer] in
     spawn {id_server(idServerMb, 0)};
     print(intToString(id_client(idServerMb)))
 }`,
    fullPatError2: `interface IdServer { Get(IdClient!) }
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
     # ERROR: No guard at all - violates mailbox safety
     receive Id(id) from clientMb ->  # ❌ Missing guard assertion
         free(clientMb);
         id
 }
 
 def main(): Unit {
     let idServerMb = new [IdServer] in
     spawn {id_server(idServerMb, 0)};
     print(intToString(id_client(idServerMb)))
 }`,
    error1Label: "Wrong Guard Pattern",
    error2Label: "Missing Guard",
    erlangProblem: `%% In Erlang - pattern matching can miss cases silently
 id_client(ServerPid) ->
     ServerPid ! {get, self()},
     receive
         {response, Data} -> Data  %% Wrong pattern - expecting {id, Id}
     after 5000 -> 
         error(timeout)  %% May timeout due to pattern mismatch
     end.`,
    explanation:
      "Pat's guard system ensures receive patterns exactly match interface specifications, preventing pattern matching errors.",
  },

  lifetimeViolation: {
    title: "4. Mailbox Lifetime Violations",
    subtitle: "(use after free, double free, resource leaks)",
    description: "What happens when you mismanage mailbox lifecycles?",
    patError: `interface IdServer { Get(IdClient!) }
 interface IdClient { Id(Int) }
 
 def id_client(serverMb: IdServer!): Int {
     let clientMb = new [IdClient] in
     serverMb ! Get(clientMb);
     guard clientMb: Id {
         receive Id(id) from clientMb ->
             free(clientMb);
             # ERROR: Use after free
             clientMb ! Id(999);  # ❌ Using freed mailbox
             id
     }
 }`,
    patError2: `interface IdServer { Get(IdClient!) }
 interface IdClient { Id(Int) }
 
 def id_client(serverMb: IdServer!): Int {
     let clientMb = new [IdClient] in
     serverMb ! Get(clientMb);
     guard clientMb: Id {
         receive Id(id) from clientMb ->
             free(clientMb);
             free(clientMb);  # ❌ Double free
             id
     }
 }`,
    fullPatError: `interface IdServer { Get(IdClient!) }
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
             # ERROR: Use after free
             clientMb ! Id(999);  # ❌ Using freed mailbox
             id
     }
 }
 
 def main(): Unit {
     let idServerMb = new [IdServer] in
     spawn {id_server(idServerMb, 0)};
     print(intToString(id_client(idServerMb)))
 }`,
    fullPatError2: `interface IdServer { Get(IdClient!) }
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
             free(clientMb);  # ❌ Double free
             id
     }
 }
 
 def main(): Unit {
     let idServerMb = new [IdServer] in
     spawn {id_server(idServerMb, 0)};
     print(intToString(id_client(idServerMb)))
 }`,
    error1Label: "Use After Free",
    error2Label: "Double Free",
    erlangProblem: `%% In Erlang - no automatic resource management
 id_client(ServerPid) ->
     ServerPid ! {get, self()},
     receive
         {id, Id} -> 
             %% No explicit cleanup - potential resource leaks
             %% Dead processes accumulate over time
             Id
     end.
     
 %% Worse: can send to dead processes with no error!
 send_to_dead_process(DeadPid) ->
     DeadPid ! {hello},  %% Message silently lost!
     ok.`,
    explanation:
      "Pat's quasi-linear type system tracks mailbox ownership and lifetime, preventing use-after-free and resource leaks.",
  },
};

export default function CommunicationErrorsPage() {
  const [selectedError, setSelectedError] = useState<string>("messageType");
  const [currentCode, setCurrentCode] = useState<string>(baseIdServerPat);
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentErrorVariant, setCurrentErrorVariant] = useState<number | null>(
    null
  );

  // When switching error type, auto-load the first error (variant #1)
  useEffect(() => {
    const err = errorExamples[
      selectedError as keyof typeof errorExamples
    ] as any;
    if (err) {
      const code = (err.fullPatError || err.patError) as string | undefined;
      if (code) {
        setCurrentCode(code);
        setCurrentErrorVariant(1);
      }
    }
  }, [selectedError]);

  const analyzeCode = async () => {
    if (!currentCode.trim()) {
      setAnalysisResult("Please enter some Pat code to analyze");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult("");

    try {
      const response = await fetch("/api/check-pat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: currentCode }),
      });

      const result = await response.json();

      if (result.success) {
        const output = `Pat Type Checking: PASSED
 
${result.summary}
 
Type Information:
${result.typeInfo.map((info: string) => `• ${info}`).join("\n")}`;

        setAnalysisResult(output);
      } else {
        // If the server does not have mbcheck available, provide guidance
        const notAvailable =
          typeof result.summary === "string" &&
          result.summary.toLowerCase().includes("not available");
        const errorOutput = `Pat Type Checking: FAILED

${result.summary}
 
Errors found:
${result.errors.map((e: any) => `• Line ${e.line}: [${e.type}] ${e.message}`).join("\n")}
${
  notAvailable
    ? `

🔧 How to enable Pat type checking on the server:
1) Build mbcheck:
   - See patCom/paterl/mbcheck/README.md
   - Or visit https://github.com/SimonJF/mbcheck
2) Ensure the built binary is at: patCom/paterl/mbcheck/mbcheck and is executable (chmod +x)
3) Restart the server and retry.
`
    : ""
}
 `;

        setAnalysisResult(errorOutput);
      }
    } catch (err) {
      setAnalysisResult(
        `Analysis error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadErrorExample = (errorType: string, errorVariant: number = 1) => {
    const error = errorExamples[errorType as keyof typeof errorExamples] as any;
    if (error) {
      const codeKey = errorVariant === 2 ? "fullPatError2" : "fullPatError";
      // Fallback to short snippet if full not present
      const fallbackKey = errorVariant === 2 ? "patError2" : "patError";
      setCurrentCode((error[codeKey] || error[fallbackKey]) as string);
      setCurrentErrorVariant(errorVariant);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-2">
            Communication Errors Demo
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Explore how Pat prevents common communication errors at
            compile-time, based on the classic <strong>Id Server</strong>{" "}
            example.
          </p>
        </div>

        <div className="mb-6 -mx-4 px-4">
          <div className="bg-white border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Error Types</h2>
            </div>
            <div className="overflow-x-auto">
              <div className="flex gap-3 p-3 min-w-max">
                {Object.entries(errorExamples).map(([key, error]) => {
                  const selected = selectedError === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedError(key)}
                      className={`shrink-0 text-left px-3 py-3 rounded-lg border transition w-72 ${
                        selected
                          ? "bg-gray-100 border-gray-300 text-gray-900"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                      title={error.title}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium truncate">
                          {error.title}
                        </span>
                        {selected && (
                          <span className="h-2 w-2 rounded-full bg-gray-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                        {error.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Error Details */}
        {selectedError && (
          <div className="mb-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                {
                  errorExamples[selectedError as keyof typeof errorExamples]
                    .title
                }
              </h3>
              <p className="text-gray-600 mb-4">
                {
                  errorExamples[selectedError as keyof typeof errorExamples]
                    .description
                }
              </p>

              {/* Erlang Comparison */}
              <div className="mb-6">
                <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  🔍 How This Error can be in Erlang:
                </h4>
                <CodeBlock
                  language="erlang"
                  title="Erlang - Runtime Problem"
                  height="220px"
                >
                  {
                    errorExamples[selectedError as keyof typeof errorExamples]
                      .erlangProblem
                  }
                </CodeBlock>
                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Explanation:</strong>{" "}
                    {
                      errorExamples[selectedError as keyof typeof errorExamples]
                        .explanation
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => {
              setCurrentCode(baseIdServerPat);
              setCurrentErrorVariant(null);
            }}
            className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 transition"
          >
            Show Correct Code
          </button>
          <button
            onClick={() => loadErrorExample(selectedError, 1)}
            className="px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition"
          >
            {errorExamples[
              selectedError as keyof typeof errorExamples
            ].hasOwnProperty("error1Label")
              ? (
                  errorExamples[
                    selectedError as keyof typeof errorExamples
                  ] as any
                ).error1Label
              : "Error #1"}
          </button>
          {(errorExamples[selectedError as keyof typeof errorExamples] as any)
            .fullPatError2 && (
            <button
              onClick={() => loadErrorExample(selectedError, 2)}
              className="px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition"
            >
              {(
                errorExamples[
                  selectedError as keyof typeof errorExamples
                ] as any
              ).error2Label || "Error #2"}
            </button>
          )}
        </div>

        {/* Interactive Code Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-3">
              {(() => {
                const err = errorExamples[
                  selectedError as keyof typeof errorExamples
                ] as any;
                const currentErrorName =
                  currentErrorVariant === 1
                    ? err?.error1Label || "Error #1"
                    : currentErrorVariant === 2
                      ? err?.error2Label || "Error #2"
                      : "Correct Code";
                return (
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                    🔧 {currentErrorName}
                  </h3>
                );
              })()}
              <button
                onClick={analyzeCode}
                disabled={isAnalyzing}
                className={`px-3 py-2 text-sm rounded-md font-medium transition-colors ${
                  isAnalyzing
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isAnalyzing ? "Analyzing..." : " Analyze Code"}
              </button>
            </div>
            <div className="rounded-md overflow-hidden">
              <PatEditor
                value={currentCode}
                onChange={setCurrentCode}
                height="620px"
                title={(() => {
                  const err = errorExamples[
                    selectedError as keyof typeof errorExamples
                  ] as any;
                  if (currentErrorVariant === 1)
                    return err?.error1Label || "Error #1";
                  if (currentErrorVariant === 2)
                    return err?.error2Label || "Error #2";
                  return "Correct Code";
                })()}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Try modifying the code above to see how Pat catches errors!
            </p>
          </div>

          {/* Analysis Results */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
              Results
            </h3>
            {analysisResult ? (
              <div className="rounded-lg border border-gray-200 p-4 font-mono text-base whitespace-pre-wrap overflow-auto max-h-[520px]">
                {analysisResult}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">🎯</div>
                <p>
                  Click "Analyze Code" to see Pat's type checking in action!
                </p>
                <p className="text-sm mt-2">
                  Pat will catch communication errors before they can cause
                  runtime problems.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
