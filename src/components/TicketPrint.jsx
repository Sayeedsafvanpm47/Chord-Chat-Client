import { Box, Typography } from "@mui/material";
import { Container } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import ButtonHover from './ButtonHover'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Logo from "./Logo";
import {showToastSuccess} from '../services/toastServices'
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const TicketPrint = () => {
  const { ticketDetails } = useSelector((state) => state.ticket);
  const navigate = useNavigate()
  const handleDownloadPDF = () => {
    const input = document.getElementById('pdf-content');
    const button = document.getElementById('button');
    button.style.display = 'none'   
     setTimeout(() => {
    html2canvas(input,{useCORS:true})
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); // Set dimensions to A4
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save("download.pdf");
      });
      showToastSuccess('Ticket downloaded')
      navigate('/tickets')
      
      
  }, 1000);

  };
  return (
    <>
    <ToastContainer/>
    <div   style={{ backgroundColor: "rgba(255, 255, 255, 0.5)", height: "100%", width: "100%",backgroundImage:'url("https://res.cloudinary.com/dkxyzzuss/image/upload/v1715707936/chord-chat/bxckq1lcioxn9tzvdb1n.png")',  backgroundPosition: 'center',
    backgroundRepeat: 'repeat',backgroundSize:'90px'}}>
      <Container >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
           
        
          }}
        >
          <Box id='pdf-content' sx={{backgroundColor: "rgba(255, 255, 255, 0.75)",marginTop:'1%',borderRadius:'30px',backgroundImage:'url("https://res.cloudinary.com/dkxyzzuss/image/upload/v1715707936/chord-chat/bxckq1lcioxn9tzvdb1n.png")',backgroundSize:'70px',backgroundRepeat:'repeat'}}>
            <Box style={{ marginLeft: "19%" }}>
              <Logo height={"300px"} width={"300px"} ticket={true} />
            </Box>
            <Typography
              style={{ marginLeft: "18%" }}
              variant="h1"
              color={"black"}
            >
              {" "}
              {ticketDetails.title}
            </Typography>
            <Typography
              style={{ marginLeft: "14%" }}
              variant="h4"
              color={"black"}
            >
              {" "}
              quantity : {ticketDetails.quantity} nos.
              price : {ticketDetails.amount}
            </Typography>
            <div style={{ position: 'relative' }}>
    <img style={{ height: '400px', width: '500px',marginTop:'5%' }} src={ticketDetails?.image} alt="First"></img>
    <img src='https://res.cloudinary.com/dkxyzzuss/image/upload/v1715707415/chord-chat/brla6povntxdbvoehi0m.png' style={{ position: 'absolute', top: 0, left: 0, height: '400px', width: '500px',backgroundColor:'rgba(242, 242, 242, 0.7)' }} alt="Second"></img>
</div>
<Box id='button' onClick={handleDownloadPDF} sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
<ButtonHover text={'Print'}/>
</Box>

          </Box>
         
        </Box>
      </Container>
    </div>
    </>

  );
};

export default TicketPrint;
