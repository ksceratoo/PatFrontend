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

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto">
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
                time, ensuring components "talk" to each other properly.
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

            <motion.div
              variants={itemVariants}
              className="bg-green-50 p-6 rounded-lg border border-green-200"
            >
              <h3 className="font-semibold text-gray-900 mb-3">
                In Actor Systems
              </h3>
              <p className="text-gray-700">
                Behavioural types can be adapted to model the more flexible,
                unordered message-passing style found in languages like Erlang.
                One such adaptation is
                <span className="font-medium text-green-800 ml-1">
                  Mailbox Types
                </span>
                , which allow us to describe the expected contents of an actor's
                mailbox and ensure that all incoming and outgoing messages are
                handled correctly.
              </p>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg font-medium text-gray-900 pt-4"
            >
              By applying behavioural types, we bridge the gap between formal
              verification and real-world software, making it possible to write
              communication-safe systems without needing to run the code first.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Behavioural;
