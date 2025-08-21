import { Link } from "react-router";
import { motion } from "framer-motion";

const Behavioural = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const actorSystems = [
    {
      name: "Erlang",
      description:
        "The pioneering actor language built for telecom fault-tolerance",
      link: "https://www.erlang.org/",
    },
    {
      name: "Elixir",
      description:
        "Modern actor language with Ruby-inspired syntax on the Erlang VM",
      link: "https://elixir-lang.org/",
    },
    {
      name: "Akka",
      description:
        "Powerful actor toolkit for building distributed applications on the JVM",
      link: "https://akka.io/",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </motion.div>

        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-lg p-8 border
           border-gray-200 hover:shadow-lg transition-all duration-300"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl font-light text-gray-900 mb-8"
            variants={itemVariants}
          >
            Behavioural Types
          </motion.h1>

          <motion.div className="space-y-6 text-gray-700 leading-relaxed">
            <motion.p variants={itemVariants} className="text-lg">
              In modern software systems—especially distributed, concurrent, or
              actor-based ones—components often interact by sending messages to
              each other. But how do we make sure these interactions follow the
              correct protocol?
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-400"
            >
              <p className="text-gray-600 italic">
                What if one part of the system sends a message the other isn't
                ready to receive? Or if two components are waiting for each
                other forever?
              </p>
            </motion.div>

            <motion.p variants={itemVariants}>
              <span className="font-semibold text-gray-900">
                This is where Behavioural Types come in.
              </span>
              Behavioural types are an extension of traditional programming
              language type systems. While standard types (like{" "}
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">int</code>
              ,
              <code className="bg-gray-100 px-2 py-1 rounded text-sm mx-1">
                string
              </code>
              , or
              <code className="bg-gray-100 px-2 py-1 rounded text-sm ml-1">
                List&lt;T&gt;
              </code>
              ) describe the shape of data, behavioural types describe the
              structure of communication—what messages are expected, in what
              order, and by whom
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="bg-blue-50 p-6 rounded-lg"
            >
              <h3 className="font-semibold text-gray-900 mb-3">
                Think of them as:
              </h3>
              <p className="text-gray-700">
                Type-safe communication protocols that are checked at compile
                time, ensuring components "talk" to each other in the correct
                sequence and protocol.
              </p>
            </motion.div>

            <motion.p variants={itemVariants}>
              Originally developed in the context of process calculi (like the
              π-calculus), behavioural types—particularly{" "}
              <span className="font-medium text-gray-900">session types</span>
              —have become powerful tools for ensuring correct-by-construction
              communication.
            </motion.p>

            <motion.div variants={itemVariants}>
              <h3 className="font-semibold text-gray-900 mb-4">
                They help reduce bugs like:
              </h3>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">•</span>
                  Sending unexpected messages
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">•</span>
                  Receiving messages out of order
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">•</span>
                  Deadlocks and livelocks
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">•</span>
                  Broken protocols due to refactoring
                </li>
              </ul>
            </motion.div>

            {/* Enhanced Actor Model Section */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-xl border border-green-200"
            >
              <h3 className="font-semibold text-gray-900 mb-4 text-xl">
                The Actor Pragramming Model & Message-Passing Systems
              </h3>

              <div className="space-y-4">
                <p className="text-gray-700">
                  The{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Actor_model"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 hover:text-green-900 font-medium underline decoration-2 underline-offset-2"
                  >
                    Actor Model(Wikipedia)
                  </a>{" "}
                  represents a fundamental paradigm for concurrent computation
                  where independent "actors" communicate exclusively through
                  asynchronous message passing. Each actor maintains its own
                  <span className="font-bold"> private state </span>
                  and processes messages from its mailbox sequentially,
                  eliminating traditional concurrency issues like race
                  conditions and shared memory conflicts.
                </p>

                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Core Actor Principles:
                  </h4>
                  <div className="grid md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">🔒</span>
                      <span>Private state isolation</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">📬</span>
                      <span>Asynchronous messaging</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">⚡</span>
                      <span>Dynamic actor creation</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700">
                  Behavioural types can be adapted to achieve the more flexible,
                  unordered message-passing style found in actor languages. One
                  such adaptation is
                  <span className="font-medium text-green-800 ml-1">
                    Mailbox Types
                  </span>
                  , which allow us to describe the expected contents of an
                  actor's mailbox and ensure that all incoming and outgoing
                  messages are handled correctly.
                </p>
              </div>
            </motion.div>

            {/* Actor Systems Showcase */}
            <motion.div
              variants={itemVariants}
              className="bg-gray-50 p-6 rounded-lg border border-gray-200"
            >
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                Actor Systems in Practice
              </h3>

              <p className="text-gray-700 mb-6">
                The actor model has been successfully implemented across various
                languages and frameworks, each bringing unique strengths to
                distributed system development:
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {actorSystems.map((system, index) => (
                  <motion.div
                    key={system.name}
                    className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-300"
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      <a
                        href={system.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 transition-colors"
                      >
                        {system.name}
                      </a>
                    </h4>
                    <p className="text-gray-600 text-sm mb-3">
                      {system.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Learn more:</strong> Explore the{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Category:Actor_model_(computer_science)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 underline"
                  >
                    full category of actor-based systems
                  </a>{" "}
                  on Wikipedia, or dive into{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Comparison_of_actor_model_implementations"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 underline"
                  >
                    comparative analysis
                  </a>{" "}
                  of different implementations.
                </p>
              </div>
            </motion.div>

            {/* The Challenge Section */}
            <motion.div
              variants={itemVariants}
              className="bg-amber-50 p-6 rounded-lg border border-amber-200"
            >
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                The Challenge with Traditional Actor Systems
              </h3>
              <p className="text-gray-700">
                While actor systems excel at building fault-tolerant, scalable
                applications, they often lack compile-time guarantees about
                message protocols. Traditional type systems struggle to capture
                the dynamic, asynchronous nature of actor communication, leading
                to runtime errors that could be prevented with better static
                analysis.
              </p>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg font-medium text-gray-900 pt-4"
            >
              By applying behavioural types to actor systems, we bridge the gap
              between formal verification and real-world software, making it
              possible to write communication-safe systems without needing to
              run the code first.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Behavioural;
