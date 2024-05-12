import React from "react";
import '../assets/css/addbutton.css'

const AddButton = ({text,width,height}) => {
  return (
          <button style={{width:width?width:'',height:height?height:''}} className="btnaddbtn"> {text}
          </button>
        
  );
};

export default AddButton;
