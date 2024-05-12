import React from 'react'
import '../assets/css/vinyl.css'
import { Typography } from '@mui/material'

const Vinyl = () => {
  return (
    <div>
          <div className="container">
    <div className="plate">
        <div className="black">
            <div className="border">
                <div className="white">
                    <div className="center">
                    <Typography variant='h6' sx={{ color: 'white', fontWeight: 'bold', zIndex: '1001' }}>Send</Typography>                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className="player">
        <div className="rect"></div>
        <div className="circ"></div>
    </div>
</div>
    </div>
  )
}

export default Vinyl