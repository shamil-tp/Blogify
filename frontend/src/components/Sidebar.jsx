import { useState, useEffect } from 'react';
import {
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CNavItem,
  CNavTitle,
} from '@coreui/react';

import CIcon from '@coreui/icons-react';
import { cilHome, cilPencil, cilAccountLogout, cilNotes,cilPlus } from '@coreui/icons';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export const Sidebar = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme'));
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await api.post('/api/blog/create-draft');
      const newId = res.data.blog._id;
      navigate(`/create/${newId}`);
    } catch (error) {
      console.error("Error creating draft:", error);
    }
  };

  useEffect(() => {
    const checkTheme = () => setTheme(localStorage.getItem('theme'));
    window.addEventListener('storage', checkTheme);
    return () => window.removeEventListener('storage', checkTheme);
  }, []);

  return (
    <>
      <style>{`
        .dark .nav-link { color: #9ca3af !important; }
        .dark .nav-link:hover { color: #d1d5db !important; }
        .dark .nav-icon { color: #9ca3af !important; }
        .dark .sidebar-brand { color: #9ca3af !important; }
        .dark .brand-text { color: #9ca3af !important; }
      `}</style>

      {/* --- DESKTOP SIDEBAR --- */}
      <div className="hidden md:block">
        <CSidebar 
          className="border-end h-screen dark:bg-black dark:text-gray-400" 
          unfoldable 
          colorScheme={theme === 'dark' ? 'dark' : 'light'} 
          size='sm'
        >
          <CSidebarHeader className="border-bottom d-flex justify-content-center align-items-center dark:bg-black dark:border-gray-700">
            <CSidebarBrand className="sidebar-brand d-flex align-items-center gap-2 dark:text-gray-400">
              <CIcon icon={cilNotes} height={28} />
              <span className="brand-text">ogDoc</span>
            </CSidebarBrand>
          </CSidebarHeader>
          
          <CSidebarNav className="dark:bg-black">
            <CNavTitle className="dark:text-gray-400">MENU</CNavTitle>
            
            <CNavItem>
              <NavLink to="/home" className="nav-link dark:text-gray-400">
                <CIcon customClassName="nav-icon dark:text-gray-400" icon={cilHome} /> Home
              </NavLink>
            </CNavItem>

            <CNavItem>
              <button 
                onClick={handleCreate} 
                className="nav-link dark:text-gray-400 w-full text-start bg-transparent border-0 flex items-center gap-2"
              >
                <CIcon customClassName="nav-icon dark:text-gray-400" icon={cilPencil} /> Compose
              </button>
            </CNavItem>

            <CNavItem className="mt-auto">
              <NavLink onClick={handleLogout} className="nav-link text-danger">
                <CIcon customClassName="nav-icon text-danger" icon={cilAccountLogout} /> Logout
              </NavLink>
            </CNavItem>
          </CSidebarNav>
        </CSidebar>
      </div>

      {/* --- MOBILE BOTTOM BAR --- */}
<div className="md:hidden fixed bottom-6 left-4 right-4 z-[100]">
  <div className="flex justify-around items-center h-20 bg-white/90 dark:bg-zinc-900/95 backdrop-blur-2xl  shadow-2xl rounded-[2.5rem] px-2">
    
    {/* Home - No Label, Perfectly Centered */}
   <NavLink 
  to="/home" 
  className="relative flex items-center justify-center flex-1 h-full"
>
  {({ isActive }) => (
    <div className="flex items-center justify-center w-full h-full">
      
      <div className={`transition-colors duration-300 ${
        isActive ? 'text-indigo-600' : 'text-slate-400 active:opacity-70'
      }`}>
        <CIcon 
          icon={cilHome} 
          className="w-10 h-10 stroke-[2px]" 
        />
      </div>
      <div className={`absolute bottom-1 h-1 rounded-full transition-all duration-300 ${
        isActive 
          ? 'w-6 bg-indigo-600 opacity-100 shadow-[0_0_10px_rgba(79,70,229,0.4)]' 
          : 'w-0 opacity-0'
      }`} />
      
    </div>
  )}
</NavLink>
    <div className="flex items-center justify-center flex-1 h-full">
      <button 
        onClick={handleCreate}
        className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-700 !rounded-full shadow-lg shadow-blue-500/40 active:scale-75 transition-all"
        style={{ borderRadius: '9999px' }}
      >
        <CIcon icon={cilPlus} className="w-8 h-8 text-white stroke-[4px]" />
      </button>
    </div>

    {/* Exit - Vibrant Red, No Label, Perfectly Centered */}
    <div className="flex items-center justify-center flex-1 h-full">
      <button 
        onClick={handleLogout} 
        className="group flex items-center justify-center"
      >
        <div className="p-3.5 rounded-full text-white shadow-lg shadow-red-500/30 transition-all duration-300 group-active:scale-90 active:bg-red-600">
          <CIcon 
            icon={cilAccountLogout} 
            className="w-6 h-6 stroke-[2px]" 
          />
        </div>
      </button>
    </div>
  </div>
</div>
    </>
  );
};
