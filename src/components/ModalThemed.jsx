import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/material/styles"; // Import useTheme hook

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1001; /* Ensure the modal overlay appears above other content */
  background: ${({ theme }) => theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.3)" : "rgba(211, 211, 211, 0.3)"}; // Dynamically set background based on theme mode
`;

const ModalContainer = styled(motion.div)`

  background-color: ${({ theme }) => theme.palette.mode === "dark" ? "#333" : "#fff"}; 
  position: absolute;
  top: 50%;
  left: 50%;
  color: ${({ theme }) => theme.palette.mode === "dark" ? "fff" : "#000"}; 
  transform: translate(-50%, -50%);
  border-radius: 12px;
  z-index: 1001; 
  overflow-y: auto;
  padding: 1rem;
  ::-webkit-scrollbar {
    display: none;
  };
  scrollbar-width: none;
`;

const CloseButton = styled.svg`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 18px;
  right: 18px; 
  cursor: pointer;
`;

const modalVariant = {
  initial: { opacity: 0 },
  isOpen: { opacity: 1 },
  exit: { opacity: 0 }
};
const containerVariant = {
          initial: { top: "-50%", transition: { type: "spring", duration: 0.5 } },
          isOpen: { top: "50%", transition: { type: "spring", duration: 0.5 } },
          exit: { top: "-50%", transition: { type: "spring", duration: 0.5 } }
        };
        
// Rest of the component remains the same

const ModalThemed = ({ handleClose, children, isOpen,height,width }) => {
  const theme = useTheme(); // Access the theme
  
  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={"initial"}
          animate={"isOpen"}
          exit={"exit"}
          variants={modalVariant}
       
          theme={theme} // Pass the theme to the styled component
        >
          <ModalContainer style={{height:height?height:'60%',width:width?width:'40%'}} variants={containerVariant} theme={theme}>
       
          <CloseButton
              onClick={handleClose}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20.39 20.39"
            >
              <title>close</title>
              <line
                x1="19.39"
                y1="19.39"
                x2="1"
                y2="1"
                fill="none"
                stroke="#5c3aff"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="2"
              />
              <line
                x1="1"
                y1="19.39"
                x2="19.39"
                y2="1"
                fill="none"
                stroke="#5c3aff"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="2"
              />
            </CloseButton>
          
            {children}
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default ModalThemed;


