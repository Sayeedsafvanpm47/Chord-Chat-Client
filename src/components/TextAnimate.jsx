import { motion } from "framer-motion";

function TextAnimate({ textProp }) {
  const text = textProp.split(" ")

  return (
    <div>
      {text.map((el, i) => (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 3,
            delay: i / 20,
            repeat: Infinity
          }}
          key={i}
        
        >
          {el}{" "}
        </motion.span>
      ))}
    </div>
  );
}

export default TextAnimate;
