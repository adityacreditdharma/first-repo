import { useNavigate, Link } from 'react-router-dom';
import bgImage from './images/image.jpg'; // adjust the path as needed
import { useState } from 'react';

export default function Home(){
  const [isLoading, setIsloading] = useState(false);
  const handleLogin = () => {
    setIsloading(true);
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google`;
  };
  return (
   <div style={{
    backgroundImage: `url(${bgImage})`,  backgroundSize: 'cover',
  }} className="flex justify-center  items-center min-h-screen ">
  <div className="w-full max-w-lg h-96 p-6 pt-24 bg-black rounded-2xl shadow-2xl shadow-slate-300/80 bg-opacity-40">
    <h5 className="text-center mb-4 text-4xl font-bold tracking-tight text-white">
      SQL Playground
    </h5>
    <p className="text-center mb-6 text-lg text-gray-200">
      Please log in with your official Google account
    </p>
    <div className="flex justify-center">
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="inline-flex items-center shadow-xl shadow-slate-200/20 px-5 py-2.5 text-sm font-medium text-white bg-purple-700 rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all"
      >
        {isLoading ? 'Logging in..' :
        ( <div className='flex items-center'> Login
        <svg
          className="rtl:rotate-180 w-4 h-4 ml-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg> </div>)
        }
      </button>
    </div>
  </div>
</div>
  );
};