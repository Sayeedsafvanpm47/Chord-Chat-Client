import React from 'react'
import ('../assets/css/card.css')

const Card = ({content,title}) => {
  return (
  

<div style={{backgroundColor:'inherit'}} class="card">
  <div class="card-content">
    <p class="card-title">{title}
    </p><p class="card-para">{content}</p>
  </div>
</div>


  )
}

export default Card