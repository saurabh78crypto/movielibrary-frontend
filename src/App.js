import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import HomeScreen from './components/HomeScreen';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
  
function App() {
  const { isLoggedIn } = useAuth();
  return (
    <>
      <Navbar /> 
      <Routes>
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='*' element={<Navigate replace to="/signin" />} />
        <Route path='/' element={!isLoggedIn? <Navigate replace to='/signin'/> : <HomeScreen />} />
      </Routes>
    </>
  );
}

export default App;
