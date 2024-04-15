import { motion } from "framer-motion";

function TextAnimate2({ textProp }) {
  const text = textProp.split(" ");

  return (
    <div>
      {text.map((el, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { duration: 0.5 },
            x: [0, -10, 10, -10, 10, -10, 0], // Apply shake effect on x-axis
            rotate: [0, -5, 5, -5, 5, -5, 0] // Rotate the text slightly
          }}
          transition={{
            duration: 0.5,
          
          }}
          style={{ display: "inline-block", marginRight: "5px" }}
        >
          {el}
        </motion.span>
      ))}
    </div>
  );
}

export default TextAnimate2;
