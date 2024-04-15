import React,{useState} from "react";
import ReactDOM from "react-dom";
import * as Components from "./Components";
import "./styles.css";
import TextAnimate from "../../components/TextAnimate";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import {useFormik} from 'formik'
import * as Yup from 'yup'


function LoginForm() {
  const [signIn, toggle] = React.useState(true);
  const navigate = useNavigate()
  const [loading,setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const validateSchema = Yup.object().shape({
    email : Yup.string().email("Please enter a valid email").required('This field is required'),
    password:Yup.string().min(8, "Pasword must be 8 or more characters"),
    confirmPassword: Yup.string().when("password", (password, field) => {
      if (password) {
        return field.required("The passwords do not match").oneOf([Yup.ref("password")], "The passwords do not match");
      }
    })
   
  })
  const formik = useFormik({
    initialValues : {
      email : '',
      password:''
    },
    validationSchema: validateSchema,
    onSubmit: ((values,{resetForm})=>{
      console.log(values)
      setLoading(true)
      setTimeout(() => {
        setLoading(false);
        resetForm();
      }, 1000 * 2);
    })
  })

  // {{.matches(/(?=.*[a-z])(?=.*[A-Z])\w+/, "Password ahould contain at least one uppercase and lowercase character")}
  // .matches(/\d/, "Password should contain at least one number")
  // .matches(/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/, "Password should contain at least one special character")}
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const signUpHandler = async (e)=>{
   try {
    e.preventDefault()
    const response = await axios.post('/api/users/signup',formData)
    console.log(response.data)
    navigate('/otp')
   } catch (error) {
    console.log(error)
   }
    }
    const signInHandler = async (e) => {
      try {
        e.preventDefault(); // Prevent default form submission behavior
       
  
        
        console.log('Prevented');
        
        // Make POST request to sign in endpoint
        const response = await axios.post('http://localhost:3001/api/users/signin',formData);
       
    
        console.log(response.data, 'response'); // Log response data
       
        navigate('/home'); // Navigate to the home page after successful sign-in
      } catch (error) {
        
       error.response.data.errors && error.response.data.errors.forEach(errorMessage => {
          toast.error(errorMessage.errors);
        });
        console.error('Sign-in failed:', error.response.data.errors);
        // Handle error and provide feedback to the user
      }
    };
  

  return (
    <>
      
 <div style={{display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh'}}>
               <ToastContainer />
             <Components.Container>
      <Components.SignUpContainer signingIn={signIn}>
        <Components.Form>
          <Components.Title>Create Account</Components.Title>
          <Components.Input type="text" placeholder="First Name" />
          <Components.Input type="text" placeholder="Last Name" />
          <Components.Input type="email" placeholder="Email" />
          <Components.Input type="password" placeholder="Password" />
          <Components.Input type="password" placeholder="Confirm Password" />
          <Components.Select type="text" placeholder="What's your talent">
          <Components.Option type="text" value=''>What's your major talent?</Components.Option>
          <Components.Option type="text" value='Guitar'>Guitar</Components.Option>
          <Components.Option type="text" value='Piano'>Piano</Components.Option>
          <Components.Option type="text" value='Piano'>Drums</Components.Option>
          <Components.Option type="text" value='Piano'>Vocals</Components.Option>
          <Components.Option type="text" value='Piano'>Violin</Components.Option>
          <Components.Option type="text" value='Piano'>Percussion</Components.Option>
          <Components.Option type="text" value='Piano'>Classical</Components.Option>
          </Components.Select>
          <Components.Button onClick={signUpHandler}>Sign Up</Components.Button>
        </Components.Form>
      </Components.SignUpContainer>
      <Components.SignInContainer signingIn={signIn}>
        <Components.Form>
          <Components.Title>Sign in</Components.Title>
          <Components.Input  onChange={formik.handleChange} value={formik.values.email} name="email" type="email" placeholder="Email" />
          <p>{formik.errors.email ? formik.errors.email : ""}</p>
          <Components.Input  onChange={formik.handleChange} value={formik.values.password} name="password" type="password" placeholder="Password" />
          <Components.Anchor href="#">Forgot your password?</Components.Anchor>
     
          <Components.Button  onClick={signInHandler}>{loading? 'Loading...' : 'Sign In'}</Components.Button>
        </Components.Form>
      </Components.SignInContainer>
      <Components.OverlayContainer signingIn={signIn}>
        <Components.Overlay signingIn={signIn}>
          <Components.LeftOverlayPanel signingIn={signIn}>
            <Components.Title>Welcome Back!</Components.Title>
            <Components.Paragraph>
          <TextAnimate textProp={'To catch up with all the latest tunes, login with your personal info'}> </TextAnimate> 
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(true)}>
              Sign In
            </Components.GhostButton>
          </Components.LeftOverlayPanel>
          <Components.RightOverlayPanel signingIn={signIn}>
            <Components.Title>Hey there Musician!</Components.Title>
            <Components.Paragraph>
                    <TextAnimate textProp={'Enter your personal details and start jamming with us'}></TextAnimate>
              
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

export default LoginForm
