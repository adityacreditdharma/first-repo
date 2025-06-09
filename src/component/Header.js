import logo from './images/logo.png';
import axios from 'axios';
import { useState } from 'react';

const Header = ({user}) => {
    const [isLoading, setIsloading] = useState(false);

    const handleLogout = async() => {
    setIsloading(true);
    try{
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/logout`, { withCredentials: true });
      localStorage.removeItem('jwt'); // 🧹 Remove JWT
      window.location.href = '/login'
    }
    catch(err){
      console.log(err.message);
    }
    finally{
      setIsloading(false);
    }
  }
    return (<header
  className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-md border  border-zinc-900 bg-zinc-700 py-3 shadow-2xl shadow-zinc-600 backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg"
>
  <div className="px-4">
    <div className="flex items-center justify-between">
      <div className="flex shrink-0">
        <a aria-current="page" className="flex items-center" href="/">
          <div style={{
            backgroundImage: `url(${logo})`,  backgroundSize: 'cover',
          }} className='w-8 h-8 shadow-md'>
          </div>
        </a>
      </div>
      <div className="flex items-center justify-center gap-5">
        <div
          aria-current="page"
          className="inline-block rounded-lg px-2 py-1 text-sm font-extrabold text-gray-200 transition-all duration-200 hover:bg-black/60 hover:text-gray-100"
        >
          SQL Playground
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <div
          className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-200 transition-all duration-200 hover:bg-black/60 hover:text-gray-100"
        >
          Welcome {user?.name}
        </div>
        <div style={{backgroundImage: `url(${user?.picture})`,backgroundSize: 'contain', backgroundRepeat: 'no-repeat',backgroundPosition: 'center',}} className='w-8 h-8 rounded-full'>
        </div>
        <button  
          disabled={isLoading}
          className="disabled:cursor-not-allowed inline-flex  items-center justify-center rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-red-500  focus:ring-4 focus:ring-red-300  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          onClick={handleLogout} 
        >
            {isLoading ? "Logging out.." : "Logout"}
        </button>
      </div>
    </div>
  </div>
</header>);
};

export default Header;