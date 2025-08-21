import { Link } from "react-router";
import { motion } from "framer-motion";

const Calculus = () => {
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
          className="bg-white/80 backdrop-blur-sm rounded-lg p-8 border border-gray-200 hover:shadow-lg transition-all duration-300"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl font-light text-gray-900 mb-8"
            variants={itemVariants}
          >
            Mailbox Calculus
          </motion.h1>

          <motion.div className="space-y-6 text-gray-700 leading-relaxed">
            <motion.div
              variants={itemVariants}
              className="bg-blue-50 p-6 rounded-lg border border-blue-200"
            >
              <h3 className="font-semibold text-gray-900 mb-3">
                What Is Mailbox Calculus?
              </h3>
              <p className="text-gray-700">
                Mailbox Calculus is a formal model designed to capture the
                semantics of message-passing in actor-based systems, especially
                those like Erlang and Akka, where each actor has a single
                mailbox for incoming messages.
              </p>
            </motion.div>

            <motion.p variants={itemVariants} className="text-lg">
              In traditional process calculi like the π-calculus or CCS,
              communication is modeled over channels with strict
              synchronization. However, real-world actor systems use
              asynchronous communication with unordered mailboxes.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400"
            >
              <p className="text-orange-700 font-medium">
                This mismatch limits the direct application of classical models
                to real actor systems.
              </p>
            </motion.div>

            <motion.p variants={itemVariants}>
              <span className="font-semibold text-gray-900">
                Mailbox Calculus
              </span>
              , introduced by
              <span className="font-medium text-blue-700 mx-1">
                de'Liguoro and Padovani in 2018
              </span>
              , was developed to accurately reflect the concurrency behavior of
              actor systems using mailboxes as the core abstraction.
            </motion.p>

            <motion.div variants={itemVariants}>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                🔧 How Does It Work?
              </h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="mb-4">In Mailbox Calculus:</p>
                <ul className="space-y-3 ml-6">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 font-bold">•</span>
                    Each actor (process) has a{" "}
                    <code className="bg-white px-2 py-1 mx-1 rounded text-sm border">
                      mailbox
                    </code>
                    —a place where it receives messages.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 font-bold">•</span>
                    Sending a message is a non-blocking operation (
                    <code className="bg-white px-2 py-1 mx-1 rounded text-sm border">
                      send m to a
                    </code>
                    ).
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 font-bold">•</span>
                    Receiving a message is selective and pattern-based: the
                    actor can match on specific messages in its mailbox,
                    possibly ignoring others.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 font-bold">•</span>
                    The mailbox itself is modeled using a commutative regular
                    expression, meaning that the order of messages does not
                    matter, only their presence and expected count.
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-purple-50 p-6 rounded-lg border border-purple-200"
            >
              <h4 className="font-semibold text-gray-900 mb-3">
                Example Mailbox Type:
              </h4>
              <div className="bg-white p-4 rounded border font-mono text-center text-lg">
                <code className="text-purple-700">A · B + C</code>
              </div>
              <p className="text-gray-700 mt-3 text-sm">
                This means the actor expects one message of type A and one of
                type B, or alternatively a message of type C.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="font-semibold text-gray-900 mb-4">
                This system allows us to type-check:
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">
                    Message Handling
                  </h4>
                  <p className="text-green-700 text-sm">
                    All expected messages are handled
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">
                    Error Prevention
                  </h4>
                  <p className="text-green-700 text-sm">
                    No unexpected messages cause crashes
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">
                    Protocol Safety
                  </h4>
                  <p className="text-green-700 text-sm">
                    Protocols are respected at compile time
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-yellow-50 p-6 rounded-lg border border-yellow-200"
            >
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                Why Is It Important?
              </h3>
              <p className="text-gray-700 mb-4">
                Mailbox Calculus laid the theoretical foundation for practical
                tools like the
                <span className="font-medium text-blue-700 mx-1">
                  Pat language
                </span>{" "}
                and
                <span className="font-medium text-green-700 mx-1">
                  Mailboxer
                </span>
                , which bring these ideas into real-world Erlang systems.
              </p>

              <h4 className="font-medium text-gray-900 mb-3">
                By using types to track mailbox contents, developers can
                prevent:
              </h4>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">⚠️</span>A message being
                  sent but never handled
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">⚠️</span>
                  An actor waiting forever for a message that's never sent
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">⚠️</span>
                  Protocols being silently violated after refactoring
                </li>
              </ul>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg font-medium text-gray-900 pt-4 border-t border-gray-200"
            >
              In essence, Mailbox Calculus models the unordered, asynchronous
              nature of actor mailboxes while enabling formal reasoning about
              communication correctness—a critical step toward building robust,
              concurrent applications.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Calculus;
