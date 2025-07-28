import { useState } from "react";
import DocumentationNav from "~/components/DocumentationNav";

const Documentation = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const categories = [
    {
      label: "Overview",
      value: "overview",
    },
    {
      label: "Syntax",
      value: "syntax",
    },
    {
      label: "Types",
      value: "types",
    },
    {
      label: "Functions",
      value: "functions",
    },
    {
      label: "Modules",
      value: "modules",
    },
    {
      label: "Examples",
      value: "examples",
    },
    {
      label: "References",
      value: "references",
    },
  ];

  const documentationContent = {
    overview: {
      title: "Overview",
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-lg text-gray-800 leading-relaxed">
              Pat is a modern programming language designed for educational
              purposes, combining functional programming paradigms with
              intuitive syntax.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Key Features
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Functional programming paradigm</li>
              <li>Strong type system</li>
              <li>Pattern matching</li>
              <li>Immutable data structures</li>
              <li>Interactive development environment</li>
            </ul>
          </div>
        </div>
      ),
    },
    syntax: {
      title: "Syntax",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Basic Syntax
            </h3>
            <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
              <pre>{`% Variable declaration
X = 42.

% Function definition
factorial(0) -> 1;
factorial(N) when N > 0 -> N * factorial(N-1).

% Pattern matching
process_list([]) -> empty;
process_list([H|T]) -> {head, H, tail, T}.`}</pre>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Comments</h4>
            <p className="text-gray-700 mb-2">Use % for single-line comments</p>
            <div className="bg-gray-100 rounded p-2 font-mono text-sm">
              % This is a comment
            </div>
          </div>
        </div>
      ),
    },
    types: {
      title: "Types",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Primitive Types
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-600 mb-2">Number</h4>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  42, 3.14, -7
                </code>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-600 mb-2">Atom</h4>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  hello, world, 'atom with spaces'
                </code>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-600 mb-2">String</h4>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  "Hello, World!"
                </code>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-600 mb-2">Boolean</h4>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  true, false
                </code>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    functions: {
      title: "Functions",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Function Definition
            </h3>
            <p className="text-gray-700 mb-4">
              Functions in Pat are defined using pattern matching and guards.
            </p>
            <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
              <pre>{`% Simple function
add(X, Y) -> X + Y.

% Function with guards
max(X, Y) when X > Y -> X;
max(X, Y) -> Y.

% Recursive function
length([]) -> 0;
length([_|T]) -> 1 + length(T).`}</pre>
            </div>
          </div>
        </div>
      ),
    },
    modules: {
      title: "Modules",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Module System
            </h3>
            <p className="text-gray-700 mb-4">
              Modules help organize code and provide namespacing.
            </p>
            <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
              <pre>{`-module(math_utils).
-export([add/2, multiply/2, factorial/1]).

add(X, Y) -> X + Y.

multiply(X, Y) -> X * Y.

factorial(0) -> 1;
factorial(N) when N > 0 -> N * factorial(N-1).`}</pre>
            </div>
          </div>
        </div>
      ),
    },
    examples: {
      title: "Examples",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Common Examples
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  List Processing
                </h4>
                <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
                  <pre>{`% Reverse a list
reverse(List) -> reverse(List, []).
reverse([], Acc) -> Acc;
reverse([H|T], Acc) -> reverse(T, [H|Acc]).

% Map function over list
map(_, []) -> [];
map(F, [H|T]) -> [F(H) | map(F, T)].`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    references: {
      title: "References",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Additional Resources
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Official Pat Language Guide
                  </a>
                  <p className="text-gray-600 text-sm">
                    Comprehensive guide to Pat programming
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Pattern Matching Tutorial
                  </a>
                  <p className="text-gray-600 text-sm">
                    Learn advanced pattern matching techniques
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Community Examples
                  </a>
                  <p className="text-gray-600 text-sm">
                    Real-world Pat code examples from the community
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  };

  const currentContent =
    documentationContent[activeTab as keyof typeof documentationContent];

  return (
    <>
      <div className="flex flex-row bg-gray-50 min-h-screen">
        <DocumentationNav
          categories={categories}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className="flex-1 p-6 mr-5 mt-2">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 min-h-full">
            <div className="p-8">
              <div className="border-b border-gray-200 pb-6 mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {currentContent?.title ||
                    activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h1>
                <div className="w-16 h-1 bg-blue-600 rounded"></div>
              </div>

              <div className="prose prose-lg max-w-none">
                {currentContent?.content || (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📚</div>
                    <p className="text-gray-500 text-lg">
                      Content coming soon...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Documentation;
