import { motion } from "framer-motion";
import { Link } from "react-router";

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      y: -2,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <>
      <div className="w-full flex justify-center items-center py-6 px-12">
        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Experimental Language Badge */}
          <motion.div
            className="flex items-center space-x-2"
            variants={itemVariants}
          >
            <span className="text-gray-600 text-md font-medium tracking-wide">
              EXPERIMENTAL LANGUAGE
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="text-5xl lg:text-6xl font-light leading-tight"
            variants={itemVariants}
          >
            <span className="text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
              Pat: Mailbox Typing Integrated
            </span>
          </motion.h1>

          {/* Description */}
          <motion.div variants={itemVariants}>
            <p className="text-lg text-gray-700 leading-relaxed">
              The first language in the world with a mailbox typing system,
              developed by the{" "}
              <a
                href="https://epsrc-stardust.github.io/"
                className="text-gray-900 font-medium underline hover:text-gray-700"
                target="_blank"
              >
                STARDUST team from{" "}
                <span className="text-gray-900 font-medium">
                  University of Glasgow.
                </span>
              </a>
            </p>
          </motion.div>

          {/* Call-to-Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 "
            variants={itemVariants}
          >
            <motion.button
              className="bg-gray-900 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              <span>Install Pat</span>
            </motion.button>
            <motion.button
              className="text-gray-700 hover:text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-all duration-200 border border-gray-300 hover:border-gray-400 flex items-center justify-center space-x-2 hover:shadow-md"
              variants={buttonVariants}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/pat-sandbox">
                <span>Pat Sandbox</span>
              </Link>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Hero;
