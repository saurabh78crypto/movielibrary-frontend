import * as yup from 'yup';

export const signUpSchema = yup.object({
    username: yup.string()
       .required('Username is required')
       .min(3, 'Username must be at least 3 characters long'), 
    email: yup.string()
       .email('Invalid email address')
       .required('Email is required')
       .max(255, 'Email must be less than 256 characters'), 
    password: yup.string()
       .min(8, 'Password must be at least 8 characters long')
       .required('Password is required')
       .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one digit'), // Enforce password complexity
    cpassword: yup.string()
       .oneOf([yup.ref('password'), null], 'Passwords must match') 
});


export const signInSchema = yup.object({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().required('Password is required'),
  });