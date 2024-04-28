import React from 'react'
import '../assets/css/inputcomponent.css'

const InputComponent = ({inputplaceholder,button,handleInput,handleClick}) => {
  
  const handleInputData = async (e)=>{
    handleInput(e.target.value)
    console.log(e.target.value,'value')
  }
  const handleClickData = async ()=>{
    handleClick(); 
  }
  return (
          <div className="input-group">
          <input onChange={handleInputData}  placeholder={inputplaceholder} type="text" id="input-field"></input>
          <button onClick={handleClickData} className="submit-button"><span>{button}</span></button>
</div>
  )
}

export default InputComponent