import InnovationCard from "~/components/PageElements/InnovationCard";
import Nav from "~/components/Navs/Nav";
import { motion } from "framer-motion";

const About = () => {
  const innovations = [
    {
      title: "Mailbox Types",
      description:
        "A behavioral type system that validates the state of actor mailboxes at compile time, preventing deadlocks and protocol violations.",
    },

    {
      title: "Correct by Construction",
      description:
        "Designed to eliminate entire classes of concurrency errors at compile time, leading to more reliable distributed systems.",
    },
  ];

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

  const cardVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const cardVariantsRight = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <>
      <motion.div
        className="w-full flex px-6 py-16 mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.h1
            className="text-5xl font-bold text-gray-900"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Philosophy of Pat
          </motion.h1>
          <motion.p
            className="text-lg font-semibold text-gray-700 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Born from academic research to solve the hardest problems in
            concurrent programming.
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        className="w-full flex gap-5 px-30 py-6 mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="max-w-xl mx-auto bg-white/80 backdrop-blur-sm border-2 border-gray-300 rounded-lg p-6 
          hover:shadow-lg transition-all duration-300 hover:cursor-pointer"
          variants={cardVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          onClick={() => {
            window.location.href = "/about/behavioural";
          }}
        >
          <motion.h1
            className="text-3xl font-bold text-gray-900 flex items-center mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <img
              src="/icons8-question-50.png"
              alt="question_mark"
              className="w-5 h-5 mr-2 mb-2"
            />
            The Challenge
          </motion.h1>

          <motion.p
            className="text-gray-700 mt-5 text-md font-medium leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Actor languages like Erlang and Elixir are powerful for building
            distributed systems, but they remain vulnerable to subtle
            concurrency bugs: receiving unexpected messages, deadlocks, and
            protocol violations. These errors are incredibly difficult to debug
            in production.
          </motion.p>
        </motion.div>

        <motion.div
          className="max-w-xl mx-auto bg-white/80 backdrop-blur-sm border-2 
          border-gray-300 rounded-lg p-6 hover:shadow-lg transition-all duration-300
          hover:cursor-pointer "
          variants={cardVariantsRight}
          whileHover={{ y: -5, scale: 1.02 }}
          onClick={() => {
            window.location.href = "/about/behavioural";
          }}
        >
          <motion.h1
            className="text-3xl font-bold text-gray-900 flex items-center mb-4 "
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <img
              src="/icons8-solution-50.png"
              alt="solution_mark"
              className="w-5 h-5 mr-2 mb-2"
            />
            The Solution
          </motion.h1>
          <motion.p
            className="text-gray-700 mt-5 text-md font-medium leading-relaxed "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            onClick={() => {
              window.location.href = "/documentation";
            }}
          >
            Pat introduces Mailbox Types, a behavioral type system. Instead of
            just checking message order, it validates the entire state of a
            mailbox at compile time, ensuring actors are always prepared for the
            messages they can receive.
          </motion.p>
        </motion.div>
      </motion.div>

      <div className="container mx-auto px-6 py-20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Core Innovations
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            The key technologies that make Pat a breakthrough in concurrent
            programming
          </p>
        </motion.div>

        <motion.div
          className="w-full flex flex-wrap gap-8 px-6 py-6 justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {innovations.map((innovation, index) => (
            <motion.div
              key={innovation.title}
              variants={itemVariants}
              custom={index}
              transition={{ delay: index * 0.1 + 1.2 }}
            >
              <InnovationCard
                title={innovation.title}
                description={innovation.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default About;
