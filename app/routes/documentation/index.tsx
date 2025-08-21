import { useState } from "react";
import DocumentationNav from "~/components/Navs/DocumentationNav";
import CodeBlock from "~/components/CodeBlockComponent/CodeBlock";

const Documentation = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const categories = [
    {
      label: "Overview",
      value: "overview",
    },
    {
      label: "Core Concepts",
      value: "concepts",
    },
    {
      label: "Type System",
      value: "type-system",
    },
    {
      label: "Research",
      value: "research",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Pat: A Research Language for Communication-Safe Actor Systems
              </h2>
              <p className="text-lg text-gray-800 leading-relaxed">
                Pat represents the first practical implementation of{" "}
                <strong>mailbox types</strong>—a behavioral type system for
                detecting communication errors in actor-based concurrent systems
                at compile-time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  The Actor Communication Problem
                </h3>
                <p className="text-gray-700 mb-4">
                  Actor systems lack compile-time guarantees for communication
                  protocols:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
                  <li>
                    <strong>Protocol violations</strong> - Messages sent in
                    wrong order
                  </li>
                  <li>
                    <strong>Unexpected messages</strong> - Actors receive
                    unhandled message types
                  </li>
                  <li>
                    <strong>Communication deadlocks</strong> - Actors waiting
                    indefinitely for replies
                  </li>
                  <li>
                    <strong>Resource leaks</strong> - Mailboxes not properly
                    freed
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Pat's Theoretical Foundation
                </h3>
                <p className="text-gray-700 mb-4">
                  Mailbox types solve actor communication through these methods:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
                  <li>
                    <strong>Commutative regular expressions</strong> - Model
                    unordered message arrival
                  </li>
                  <li>
                    <strong>Quasi-linear typing</strong> - Handle many-to-one
                    communication safely
                  </li>
                  <li>
                    <strong>Behavioral type checking</strong> - Verify
                    communication protocols statically
                  </li>
                  <li>
                    <strong>Interface composition</strong> - Modular reasoning
                    about actor systems
                  </li>
                  <li>
                    <strong>Resource management</strong> - Linear types for
                    mailbox lifecycle
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Research Context & Motivation
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pat builds upon the mailbox calculus by de'Liguoro and Padovani
                (2018) and extends the theoretical foundations of session types
                to handle the asynchronous, unordered nature of actor
                communication. Unlike channel-based session types that enforce
                strict message ordering, mailbox types embrace the inherent
                flexibility of actor systems while providing strong safety
                guarantees.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The language demonstrates that behavioral type systems can be
                adapted from process calculi to practical actor programming
                languages, offering a path toward communication-safe concurrent
                programming without sacrificing the expressiveness that makes
                actor systems attractive for distributed computing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Key Innovation: From Protocols to Contents
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Traditional session types describe{" "}
                <em>communication protocols</em>—the order in which messages
                must be sent and received. Pat's mailbox types describe
                <em>mailbox contents</em>—what messages an actor's mailbox can
                contain at any given time. This shift enables natural expression
                of actor communication patterns while maintaining type safety
                through commutative regular expressions that handle message
                reordering automatically.
              </p>
            </div>
          </div>
        );

      case "concepts":
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Core Language Concepts
              </h2>
              <p className="text-lg text-gray-800 leading-relaxed">
                Pat introduces several novel concepts that enable compile-time
                verification of actor communication while preserving the
                flexibility of asynchronous message passing.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Mailbox Types
                </h3>
                <p className="text-gray-700 mb-4">
                  Describe mailbox <em>contents</em> using commutative regular
                  expressions:
                </p>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <code className="font-mono text-gray-800">*Request</code>
                    <p className="text-gray-600 mt-1">
                      Zero or more Request messages (server pattern)
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <code className="font-mono text-gray-800">Put.*Get</code>
                    <p className="text-gray-600 mt-1">
                      One Put followed by zero or more Gets (cache pattern)
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <code className="font-mono text-gray-800">
                      Request + Response
                    </code>
                    <p className="text-gray-600 mt-1">
                      Either Request or Response (choice pattern)
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-4">
                  <strong>Key insight:</strong> Commutativity handles unordered
                  message arrival naturally, unlike traditional session types
                  that require strict ordering.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Quasi-Linear Typing
                </h3>
                <p className="text-gray-700 mb-4">
                  Solves the aliasing problem in actor systems:
                </p>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <code className="font-mono text-gray-800">Mailbox!</code>
                    <p className="text-gray-600 mt-1">
                      Send capability - can be freely aliased
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <code className="font-mono text-gray-800">Mailbox?</code>
                    <p className="text-gray-600 mt-1">
                      Receive capability - linear, unique owner
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-4">
                  <strong>Innovation:</strong> Enables many-to-one communication
                  while maintaining linearity for receive operations, solving a
                  fundamental challenge in typed actor systems.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Interface Types
                </h3>
                <p className="text-gray-700 mb-4">
                  Define actor communication protocols:
                </p>
                <CodeBlock language="pat" className="text-xs mb-3 max-h-40">
                  {`interface Server { 
  Request(Client!, Data) 
}
interface Client { 
  Response(Result) 
}`}
                </CodeBlock>
                <p className="text-gray-600 text-sm">
                  Interfaces specify message types and their payloads, enabling
                  modular reasoning about actor interactions and safe service
                  composition.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Guard Expressions
                </h3>
                <p className="text-gray-700 mb-4">
                  Pattern-based selective receive with type verification:
                </p>
                <CodeBlock language="pat" className="text-xs mb-3 max-h-40">
                  {`guard mailbox: Pattern {
  receive Msg(data) from mailbox ->
    process(data)
  free -> cleanup()
}`}
                </CodeBlock>
                <p className="text-gray-600 text-sm">
                  Combines pattern matching with mailbox type assertions,
                  ensuring actors only receive expected messages.
                </p>
              </div>
            </div>
          </div>
        );

      case "type-system":
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                The Pat Type System
              </h2>
              <p className="text-lg text-gray-800 leading-relaxed">
                Pat: the first simple programming language design incorporating
                mailbox types, with a sophisticated algorithmic type system.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Type System Architecture
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Behavioral Layer
                    </h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Mailbox types</li>
                      <li>• Communication protocols</li>
                      <li>• Message ordering constraints</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Linear Layer
                    </h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Resource management</li>
                      <li>• Mailbox lifecycle</li>
                      <li>• Quasi-linear capabilities</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Interface Layer
                    </h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Message type definitions</li>
                      <li>• Service contracts</li>
                      <li>• Modular composition</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Commutative Regular Expressions
                </h3>
                <p className="text-gray-700 mb-4">
                  The theoretical foundation for mailbox types:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Standard Operations
                    </h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>
                        <code>A.B</code> - Sequential composition
                      </li>
                      <li>
                        <code>A + B</code> - Choice (either A or B)
                      </li>
                      <li>
                        <code>A*</code> - Zero or more As
                      </li>
                      <li>
                        <code>A+</code> - One or more As
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Commutative Extensions
                    </h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>
                        <code>A ∥ B</code> - Parallel composition
                      </li>
                      <li>
                        <code>A & B</code> - Intersection
                      </li>
                      <li>Automatic reordering for unordered messages</li>
                      <li>Equivalence modulo commutativity</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "research":
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Research Contributions & Impact
              </h2>
              <p className="text-lg text-gray-800 leading-relaxed">
                Pat represents an advancement in the theory and practice of
                behavioral types for concurrent programming, with implications
                for both programming language design and distributed systems.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Theoretical Contributions
                </h3>
                <ul className="text-gray-700 space-y-3">
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">•</span>
                    <div>
                      <strong>First practical mailbox type system</strong>
                      <p className="text-sm text-gray-600">
                        Translation from theory to working implementation
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">•</span>
                    <div>
                      <strong>
                        Commutative regular expressions for concurrency
                      </strong>
                      <p className="text-sm text-gray-600">
                        Novel application to unordered message systems
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">•</span>
                    <div>
                      <strong>Quasi-linear typing for actors</strong>
                      <p className="text-sm text-gray-600">
                        Solving aliasing in many-to-one communication
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">•</span>
                    <div>
                      <strong>Backwards bidirectional type checking</strong>
                      <p className="text-sm text-gray-600">
                        Efficient inference for behavioral types
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Practical Impact
                </h3>
                <ul className="text-gray-700 space-y-3">
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">•</span>
                    <div>
                      <strong>Compile-time actor verification</strong>
                      <p className="text-sm text-gray-600">
                        Eliminates entire classes of concurrency bugs
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">•</span>
                    <div>
                      <strong>Natural concurrent programming</strong>
                      <p className="text-sm text-gray-600">
                        Expressive patterns without safety compromises
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">•</span>
                    <div>
                      <strong>Modular service composition</strong>
                      <p className="text-sm text-gray-600">
                        Safe integration of actor-based services
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">•</span>
                    <div>
                      <strong>Path to mainstream adoption</strong>
                      <p className="text-sm text-gray-600">
                        Integration potential with existing actor languages
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Future Directions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Language Extensions
                  </h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Higher-order mailbox types</li>
                    <li>• Dependent behavioral types</li>
                    <li>• Gradual mailbox typing</li>
                    <li>• Integration with effect systems</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    System Applications
                  </h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Distributed consensus protocols</li>
                    <li>• Microservice orchestration</li>
                    <li>• IoT device coordination</li>
                    <li>• Blockchain smart contracts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className=" bg-gray-50 flex">
      <DocumentationNav
        categories={categories}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Documentation;
