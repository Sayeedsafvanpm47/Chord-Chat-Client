import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Container } from "@mui/material";
import * as Components from "./Components";
import "./styles.css";
import TextAnimate from "../../components/TextAnimate";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextAnimate2 from "../../components/TextAnimate2";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../../app/slices/authSlice";
import Modal from "../../components/Modal";
import { showToastError, showToastSuccess } from "../../services/toastServices";
import axiosProtect from "../../app/axios/axiosAuth";

function LoginForm() {
  const [signIn, toggle] = React.useState(true);
  const schema = signIn
    ? Yup.object().shape({
        email: Yup.string()
          .email("Invalid email format")
          .required("Email is required"),
        password: Yup.string()
          .min(3, "Password must be at least 3 characters")
          .required("Password is required"),
          
      })
    : Yup.object().shape({
        email: Yup.string()
          .email("Invalid email format")
          .required("Email is required"),
        password: Yup.string()
          .min(3, "Password must be at least 3 characters")
          .required("Password is required"),
        firstname: Yup.string().required("Please enter your firstname"),
        lastname: Yup.string().required("Please enter your lastname"),
        username: Yup.string().required("Please enter your username"),
        talent:Yup.string(),
        confirmPass: Yup.string().required(
          "Please re-enter your password here"
        ),
       
      });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [otpLoad,setOtpLoad] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const onSubmitLogin = async (data) => {
    console.log(data);
    try {
      setLoading(true);

      console.log("clicked login");

      // Make POST request to sign in endpoint
      const response = await axios.post(
        "https://chordchat.dev/api/users/signin",
        data, { withCredentials: true } 
      );
     

      console.log(response.data, "response"); 
      dispatch(setCredentials({ ...response.data }));
      setLoading(false);
      navigate("/home"); 
    } catch (error) {
      setLoading(false);

     
  if (error.response && error.response.data.errors) {
    error.response.data.errors.forEach((errorMessage) => {
      showToastError(errorMessage.errors);
    });
    console.error("Sign-in failed:", error.response.data.errors);
  } else {
    console.error("Sign-in failed:", error.message);
  }
  
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async ()=>{
   try {
    const email = document.getElementById('emailsignin').value 
    const enteredOtp = document.getElementById('forgotOtp').value 
    const newPassword = document.getElementById('forgotpwd').value 
    const confirmPassword = document.getElementById('forgotcpwd').value 
    const data = {enteredOtp,newPassword,confirmPassword,email}
   const res = await axios.post('https://chordchat.dev/api/users/forgotPassword',data)
   if(!newPassword.length < 3) showToastError('Please enter a password with more than 3 charecters')
   if(newPassword !== confirmPassword) showToastError('The passwords does not match')
   console.log(res)
   if(res.data.message)
   {
    showToastSuccess(res.data.message)
    setShowModal(false)
   }else
   {
    res.data.errors && res.data.errors.forEach((error)=>{
      showToastError(error)
    })
   }
    
   } catch (error) {
   
   showToastError(error)
   }
  }

  const requestOtpForForgotPassword = async()=>{
  
    const email = document.getElementById('emailsignin').value 
    if(!email){ return showToastError('Please provide an email to reset your password!')} 
    setForgotModal(true); 
    setShowModal(true); 
   const res = await axios.post('https://chordchat.dev/api/users/generate-otp',{email})
   console.log(res,'res')

  
  }

  const onSubmitSignup = async (data) => {
    
    try {
      const otpInput = document.getElementById('enteredOtp')
      if(!otpInput) return showToastError('Please request for the otp and proceed with verification!')
      const enteredOtp = otpInput.value
      setLoading(true);
     
  

data = {...data,enteredOtp}
      console.log("clicked signup");
      const response = await axios.post(
        "https://chordchat.dev/api/users/signup",
        data,{ withCredentials: true } 
      );

      console.log(response.data, "response"); 
      dispatch(setCredentials({ ...response.data }));
      setLoading(false);
      navigate("/home"); 
    } catch (error) {
      setLoading(false);
      error.response.data.errors &&
        error.response.data.errors.forEach((errorMessage) => {
          console.log(errorMessage, "insideconsole");
          showToastError(errorMessage);
        });

      console.error("Sign-up failed:", error.response.data.errors);

    } finally {
      setLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState(0);
  const [otpEntered, setOtpEntered] = useState(false);
  const [forgotModal,setForgotModal] = useState(false)
  const handleClick =  async (e) => {
    e.preventDefault();
   try {
    setForgotModal(false);
    const emailInput = document.getElementById('email')
    const email = emailInput.value

    if(email == '') return showToastError('Please enter an email')
    setOtpLoad(true);
   const res = await axios.post('https://chordchat.dev/api/users/generate-otp',{email})
    console.log("clicked",res);
    setOtpLoad(false);
    setShowModal(!showModal);
    console.log(showModal);
    
   } catch (error) {
    setOtpLoad(false);
    console.log(error)
   }
  };
  const handleOtp = (e) => {
    setOtp(e.target.value);
    setOtpEntered(true);
  };
  return (
    <>
      <Modal isOpen={showModal} handleClose={() => setShowModal(false)}>
       {forgotModal ? (<Container sx={{ marginTop: "12%" }}>
        <Components.ParagraphModal>
           Lets fix your password shall we! Enter the otp recieved in your mail and enter the new passwords down below!
          </Components.ParagraphModal>
          <Components.Input
            type="text"
            id='forgotOtp'
            placeholder="Enter Otp"
          />
           <Components.Input
            type="password"
            id='forgotpwd'
            name="newpassword"
            placeholder="Enter new password"
            
          />
           
           <Components.Input
            type="password"
            id='forgotcpwd'
            name="confirmpassword"
            placeholder="Confirm new password"
            
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "2%",
            }}
          >
            <Components.Button onClick={updatePassword}>
              Go..
            </Components.Button>
          </div>
       </Container>) : (<Container sx={{ marginTop: "12%" }}>
          <Components.ParagraphModal>
            Heyy, dont forget to type in the otp before stepping in further..
            Cheers!
          </Components.ParagraphModal>
          <Components.Input
            onChange={handleOtp}
            type="text"
            placeholder="Enter Otp"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "2%",
            }}
          >
            <Components.Button onClick={() => setShowModal(false)}>
              Go..
            </Components.Button>
          </div>

          <p style={{ color: "gray", fontWeight: "100", marginTop: "10%" }}>
            Disclaimer:- Please verify that you are entering the correct otp.
            After the verification process you will be taken to your account
            where you can enjoy free access. Please don't share your
            credentials.
          </p>
        </Container>)}
      </Modal>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <ToastContainer />
        <Components.Container>
          {signIn ? (
            <Components.SignInContainer signingIn={signIn}>
              <Components.Form onSubmit={handleSubmit(onSubmitLogin)}>
                <Components.Title>Sign in</Components.Title>
                <Components.Input
                  name="email"
                  type="email"
                  id="emailsignin"
                  {...register("email")}
                  placeholder="email"
                  className={errors.email ? "error-placeholder" : ""}
                />
                {errors.email && (
                  <span style={{ color: "red" }}>
                    <TextAnimate2
                      textProp={errors.email.message}
                    ></TextAnimate2>
                  </span>
                )}
                <Components.Input
                  name="password"
                  type="password"
                  {...register("password")}
                  placeholder="password"
                  className={errors.password ? "error-placeholder" : ""}
                />
                {errors.password && (
                  <span style={{ color: "red" }}>
                    <TextAnimate2
                      textProp={errors.password.message}
                    ></TextAnimate2>
                  </span>
                )}
                <Components.Anchor onClick={requestOtpForForgotPassword}>
                  Forgot your password?
                </Components.Anchor>

                <Components.Button name="signin" type="submit">
                  {loading ? "Loading..." : "Sign In"}
                </Components.Button>
              </Components.Form>
            </Components.SignInContainer>
          ) : (
            <Components.SignUpContainer signingIn={signIn}>
              <Components.Form onSubmit={handleSubmit(onSubmitSignup)}>
                <Components.Title>Create Account</Components.Title>
                <Components.Input
                  name="firstname"
                  type="text"
                  {...register("firstname")}
                  placeholder="Firstname"
                  className={errors.firstname ? "error-placeholder" : ""}
                />
                {errors.firstname && (
                  <span style={{ color: "red" }}>
                    <TextAnimate2
                      textProp={errors.firstname.message}
                    ></TextAnimate2>
                  </span>
                )}
                <Components.Input
                  name="lastname"
                  type="text"
                  {...register("lastname")}
                  placeholder="Lastname"
                  className={errors.lastname ? "error-placeholder" : ""}
                />
                {errors.lastname && (
                  <span style={{ color: "red" }}>
                    <TextAnimate2
                      textProp={errors.lastname.message}
                    ></TextAnimate2>
                  </span>
                )}
                <Components.Input
                  name="username"
                  type="text"
                  {...register("username")}
                  placeholder="Username"
                  className={errors.lastname ? "error-placeholder" : ""}
                />
                {errors.username && (
                  <span style={{ color: "red" }}>
                    <TextAnimate2
                      textProp={errors.username.message}
                    ></TextAnimate2>
                  </span>
                )}
                <Components.Input
                  name="email"
                  type="email"
                  id="email"
                  {...register("email")}
                  placeholder="Email"
                  className={errors.email ? "error-placeholder" : ""}
                />
                {errors.email && (
                  <span style={{ color: "red" }}>
                    <TextAnimate2
                      textProp={errors.email.message}
                    ></TextAnimate2>
                  </span>
                )}
                <Components.Input
                  name="password"
                  type="password"
                  {...register("password")}
                  placeholder="Password"
                  className={errors.password ? "error-placeholder" : ""}
                />
                {errors.password && (
                  <span style={{ color: "red" }}>
                    <TextAnimate2
                      textProp={errors.password.message}
                    ></TextAnimate2>
                  </span>
                )}
                <Components.Input
                  name="confirmpassword"
                  type="password"
                  {...register("confirmPass")}
                  placeholder="Confirm Password"
                  className={errors.confirmPass ? "error-placeholder" : ""}
                />
                {errors.confirmPass && (
                  <span style={{ color: "red" }}>
                    <TextAnimate2
                      textProp={errors.confirmPass.message}
                    ></TextAnimate2>
                  </span>
                )}
                <Components.Select
                  name="talent"
                  type="text"
                  placeholder="What's your talent"
                 {...register('talent')}
                >
                  <Components.Option type="text" value="Not specified">
                    What's your major talent?
                  </Components.Option>
                  <Components.Option type="text" value="Guitar">
                    Guitar
                  </Components.Option>
                  <Components.Option type="text" value="Piano">
                    Piano
                  </Components.Option>
                  <Components.Option type="text" value="Drums">
                    Drums
                  </Components.Option>
                  <Components.Option type="text" value="Vocals">
                    Vocals
                  </Components.Option>
                  <Components.Option type="text" value="Violin">
                    Violin
                  </Components.Option>
                  <Components.Option type="text" value="Percussion">
                    Percussion
                  </Components.Option>
                  <Components.Option type="text" value="Classical">
                    Classical
                  </Components.Option>
                </Components.Select>
                {otpEntered && (
                  <Components.Input
                    name="enteredOtp"
                    onChange={handleOtp}
                    value={otp}
                    type="text"
                    placeholder="Otp"
                  id='enteredOtp'
                  />
                )}
                <Components.OtpButton type="button" onClick={handleClick}>
                {otpLoad ? "Requesting Otp..." : "Request Otp"}
                </Components.OtpButton>
                <Components.Button name="signup" type="submit">
                  {loading ? "Loading..." : "Sign Up"}
                </Components.Button>
              </Components.Form>
            </Components.SignUpContainer>
          )}

          <Components.OverlayContainer signingIn={signIn}>
            <Components.Overlay signingIn={signIn}>
              <Components.LeftOverlayPanel signingIn={signIn}>
                <Components.Title>Welcome Back!</Components.Title>
                <Components.Paragraph>
                  <TextAnimate
                    textProp={
                      "To catch up with all the latest tunes, login with your personal info"
                    }
                  >
                    {" "}
                  </TextAnimate>
                </Components.Paragraph>
                <Components.GhostButton onClick={() => toggle(true)}>
                  Sign In
                </Components.GhostButton>
              </Components.LeftOverlayPanel>
              <Components.RightOverlayPanel signingIn={signIn}>
                <Components.Title>Hey there Musician!</Components.Title>
                <Components.Paragraph>
                  <TextAnimate
                    textProp={
                      "Enter your personal details and start jamming with us"
                    }
                  ></TextAnimate>
                </Components.Paragraph>
                <Components.GhostButton onClick={() => toggle(false)}>
                  Sign Up
                </Components.GhostButton>
              </Components.RightOverlayPanel>
            </Components.Overlay>
          </Components.OverlayContainer>
        </Components.Container>
      </div>
    </>
  );
}

export default LoginForm;
