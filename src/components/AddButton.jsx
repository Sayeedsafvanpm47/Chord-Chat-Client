import React from "react";
import '../assets/css/addbutton.css'

const AddButton = ({text}) => {
  return (
          <button className="btnaddbtn"> {text}
          </button>
        
  );
};

export default AddButton;
