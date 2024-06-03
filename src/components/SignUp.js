import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { signUpSchema } from '../validationSchema/index';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import { Spinner } from 'react-bootstrap';


const SignUp = () => {
  const { setCurrentUser } = useAuth();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {register, handleSubmit, formState: {errors}, reset} = useForm({
    resolver: yupResolver(signUpSchema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post('https://movielibrary-backend-jw44.onrender.com/api/auth/reguser', data);
        setCurrentUser(response.data.user);
        setSuccessMessage(`Hurray, ${response.data.user.username} registered successfully` );
        setShowSuccessMessage(true);

        setTimeout(() => {
          navigate('/signin');
        }, 3000);

    } catch (error) {
      if(error.response && error.response.status === 409){
        setSuccessMessage(error.response.data.message || 'User Already Registered.');
        setShowSuccessMessage(true);
      
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
        
        reset();
      } else{
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="authFormContainer">
      {isLoading? (
        <Spinner />
      ) : (
        <>
          <h2 className='welcome-msg'>Register Now</h2>
          {showSuccessMessage && (
            <div className={`success-message ${successMessage.includes('registered')? 'green' : 'red'}`}>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="authForm">
          <label htmlFor="username" className='authFormLabel'>Username:</label>
            <input
              {...register('username')}
              id="username"
              name="username"
              type="text"
              autoComplete='username'
              required
            />
             {errors.username && <p className="error">{errors.username.message}</p>}
        
            <label htmlFor="email" className='authFormLabel'>Email:</label>
            <input
            {...register('email')}
              id="email"
              name="email"
              type="email"
              required
            />
             {errors.email && <p className="error">{errors.email.message}</p>}
        
            <label htmlFor="password" className='authFormLabel'>Password:</label>
            <input
            {...register('password')}
              id="password"
              name="password"
              type="password"
              autoComplete='new-password'
              required
            />
             {errors.password && <p className="error">{errors.password.message}</p>}
        
            <label htmlFor="cpassword" className='authFormLabel'>Confirm Password:</label>
            <input
            {...register('cpassword')}
              id="cpassword"
              name="cpassword"
              type="password"
              autoComplete='new-password'
              required
            />
             {errors.cpassword && <p className="error">{errors.cpassword.message}</p>}
        
            <button type="submit" className='authFormButton'>Register</button>
        
            <p className="registerText">Already registered! <Link to="/signin" className="registerLink">Sign In Now</Link></p>
          </form>
        </>
      )}
    </div>
  );
};

export default SignUp;
