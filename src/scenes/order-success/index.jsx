import React, { useState, useEffect } from "react";
import { useSocket } from "../../utils/SocketContext";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { showToastSuccess } from "../../services/toastServices";
const Success = () => {
  const [notification, setNotification] = useState("");
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");

//   useEffect(() => {
//     const socketInstance = io("ws://localhost:3008");
//     setSocket(socketInstance);

//     return () => {
//       socketInstance.disconnect(); // Clean up on unmount
//     };
//   }, []);

//   useEffect(() => {
//     if (socket) {
//       socket.emit("show-order", "");
//     }
//   }, [socket]);
//   useEffect(() => {
//     if (socket) {
//       socket.on("order", (data) => {
//         showToastSuccess("order placed");
//         setNotification(data); // Update notification state with received data
//       });
//     }
//   }, [socket]);
  // useEffect(() => {

  //          console.log(socket)
  //           if (socket.current) {
  //            socket.current.emit('check-notification',true)
  //            socket.current.on('order-placed-success', (data) => {
  //                     setNotification('order placed success');
  //                     showToastSuccess('order placed successfully')
  //                     console.log(data, 'data from socketio');
  //               console.log(data,'data recieved')
  //                   });
  //           }

  // },[socket])

  return (
    <div>
      Success,{notification}
      {message}
    </div>
  );
};

export default Success;
