import { motion } from "framer-motion";

interface InnovationCardProps {
  title: string;
  description: string;
}

const InnovationCard = ({ title, description }: InnovationCardProps) => {
  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-lg p-8 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 max-w-md"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="mb-6">
        <motion.div
          className="w-2 h-2 bg-gray-600 rounded-full mb-4"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.h2
          className="text-2xl font-light text-gray-900 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {title}
        </motion.h2>
      </div>
      <motion.p
        className="text-gray-600 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
};

export default InnovationCard;
