import React, {useState} from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { signInSchema } from '../validationSchema/index';


const SignIn = () => {
  const { setCurrentUser, setIsLoggedIn } = useAuth();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const {register, handleSubmit, formState: {errors}, reset} = useForm({
    resolver: yupResolver(signInSchema)
  })
  
  const onSubmit = async (data) => {
    try {
      const response = await axios.post('https://movielibrary-backend-jw44.onrender.com/api/auth/login', data);
      const {token} = response.data;

      localStorage.setItem('token', token);

      setCurrentUser(response.data.user);
      setSuccessMessage("You're logged in Successfully!");
      setShowSuccessMessage(true);

      setTimeout(() => {
        setIsLoggedIn(true);
        navigate('/');
      }, 1000);

    } catch (error) {
      if(error.response && error.response.status === 422){
        setSuccessMessage(error.response.data.message || 'User not Registered!');
        setShowSuccessMessage(true);

        setTimeout(() => {
          setShowSuccessMessage(false);
        },3000);
        reset();
      } else if(error.response && error.response.status === 401){
        setSuccessMessage(error.response.data.message || 'Invalid Credentials, Please try again.');
        setShowSuccessMessage(true);

        setTimeout(() => {
          setShowSuccessMessage(false);
        },3000);
        reset();
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="authFormContainer">
      <h2 className='welcome-msg'>Welcome Back!</h2>
      {showSuccessMessage && (
        <div className={`success-message ${successMessage.includes('logged')? 'green' : 'red'}`}>
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="authForm">
        <label htmlFor="email" className='authFormLabel'>Email:</label>
        <input
          {...register('email')}
          id="email"
          name="email"
          type="email"
          required
          autoComplete='username'
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <label htmlFor="password" className='authFormLabel'>Password:</label>
        <input
          {...register('password')}
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <button type="submit" className='authFormButton'>Sign In</button>

        <p className="registerText">Not registered <Link to="/signup" className="registerLink">Register Now</Link></p>
      </form>
    </div>
  );
};

export default SignIn;
