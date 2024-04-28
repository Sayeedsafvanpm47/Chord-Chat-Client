import React, { useRef, useState } from "react";
import "../assets/css/dragndrop.css";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import ReactPlayer from "react-player";

const DragNDrop = ({ title, sendImageToParent, typeofpost }) => {
  const [selected, setSelected] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const onInputChange = (e) => {
    const file = e.target.files[0];
    setSelected("File Selected");
    sendImageToParent(file);
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
  };
  const playerRef = useRef();
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <div style={{ display: isSmallScreen ? 'grid':"flex", alignItems: "center" }}>
      <form encType="multipart/form-data" className="file-upload-form">
        <label htmlFor="file" className="file-upload-label">
          <div className="file-upload-design">
            <p style={{ fontWeight: "bold",color:'black' }}>{title}</p>
            {/* <svg viewBox="0 0 640 512" height="1em">
              <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"></path>
            </svg>
            <p>Drag and Drop</p> */}
            <p style={{color:'black'}}>{selected}</p>
            <span className="browse-button">Browse file</span>
          </div>
          {typeofpost == "video" ? (
            <input
              id="file"
              name="image"
              type="file"
              accept="video/*"
              onChange={onInputChange}
            />
          ) : (
            <input
              id="file"
              name="image"
              type="file"
              accept="image/*"
              onChange={onInputChange}
            />
          )}
        </label>
      </form>
   
      {typeofpost && imagePreview && (
        <div>
          {/* Content to display when typeofpost is truthy */}
          <Typography variant="h5">Video Preview</Typography>

          <Box sx={{marginLeft:'20px',borderRadius:'30px',overflow:'hidden'}}>

            <ReactPlayer
              volume={0}
              ref={playerRef}
              url={imagePreview}
              playing={true}
              height="15rem"
              width="100%"
              loop={true}
       
            />
          </Box>
        </div>
      )}

      {!typeofpost && imagePreview && (
        <div style={{ marginLeft: "10%" }}>
          <Typography variant="h5">Image Preview</Typography>
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: "250px" }}
          />
        </div>
      )}
    
    </div>
  );
};

export default DragNDrop;
