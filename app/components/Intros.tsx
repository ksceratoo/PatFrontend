import { Link } from "react-router";
import { motion } from "framer-motion";

const Intros = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const cardVariantsRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="container mx-auto px-6 py-20">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Behavioural Types Section */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-lg p-8 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex flex-col"
          variants={cardVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <motion.div
              className="w-2 h-2 bg-gray-600 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <h2 className="text-2xl font-light text-gray-900">
              Behavioural Types
            </h2>
          </div>
          <div className="flex-grow">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Behavioural Types are an extension of traditional type systems
              that describe not just the shape of data, but the structure of
              interactions between components.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              These types ensure that communication protocols are followed
              correctly, preventing deadlocks and ensuring safe concurrent
              execution in distributed systems.
            </p>
          </div>
          <motion.button
            className="text-gray-700 hover:text-gray-900 px-6 py-3 rounded-md border border-gray-300 hover:border-gray-400 transition-all duration-200 text-sm font-medium mt-auto hover:shadow-md"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/about/behavioural" className="text-inherit ">
              Learn more
            </Link>
          </motion.button>
        </motion.div>

        {/* Calculus Section */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-lg p-8 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex flex-col"
          variants={cardVariantsRight}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <motion.div
              className="w-2 h-2 bg-gray-600 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <h2 className="text-2xl font-light text-gray-900">Calculus</h2>
          </div>
          <div className="flex-grow">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              The Mailbox Calculus is a theoretical model designed to formally
              describe how actors communicate using mailboxes.{" "}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              In traditional actor systems (like Erlang), each actor has a
              mailbox—a queue where it receives messages from other actors.
              Unlike strict channel-based systems, these mailboxes accept
              unordered messages from multiple senders, and actors selectively
              choose what to read.
            </p>
          </div>
          <motion.button
            className="text-gray-700 hover:text-gray-900 px-6 py-3 rounded-md border border-gray-300 hover:border-gray-400 transition-all duration-200 text-sm font-medium mt-auto hover:shadow-md"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/about/calculus" className="text-inherit">
              Learn more
            </Link>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Intros;
