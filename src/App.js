
import './App.css';
import { useEffect } from 'react';
import Home from './component/Home';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Login from './component/Login';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      // Optional: decode token to check expiry
      navigate('/');
    } else {
      const url = new URL(window.location.href);
      const token = url.searchParams.get("token");
      if (token) {
        localStorage.setItem("jwt", token);
        navigate("/");
      }
      else navigate('/login'); // Or stay on login
    }
  }, []);

  return (
    <div className="app  h-[100vh]">
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="*" element={<Home/>} />
        </Routes>
    </div>
  );
}

export default App;
