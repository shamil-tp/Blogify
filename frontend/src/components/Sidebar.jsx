import React, { useEffect, useState } from 'react'
import {
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CNavItem,
  CNavTitle,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
// 1. Import the Logout icon
import { cilHome, cilPencil, cilFootball, cilBold, cilAccountLogout, cilNotes } from '@coreui/icons'
import { NavLink, useNavigate } from 'react-router-dom' 
import api from '../api/axios'




export const Sidebar = () => {
  const [theme,setTheme] = useState(localStorage.getItem('theme'))
    const navigate = useNavigate();
    const handleLogout = async () => {
    // stop NavLink default behavior

    try {
      await api.post("/api/auth/logout"); // clears cookie
      navigate("/login", { replace: true }); // redirect
    } catch (error) {
      console.error("Logout failed", error);
    }
  }


  useEffect(()=>{
    setTheme(localStorage.getItem('theme'))
  },[localStorage.getItem('theme')])

  return (
    <CSidebar className="border-end h-screen" unfoldable colorScheme={theme} size='sm'>
      <CSidebarHeader className="border-bottom d-flex justify-content-center align-items-center bg-secondary">
        <CSidebarBrand className="sidebar-brand d-flex align-items-center gap-2">
  <CIcon icon={cilNotes} height={28} />
  <span className="brand-text">Blogify</span>
</CSidebarBrand>


      </CSidebarHeader>

      <CSidebarNav>
        <CNavTitle>MENU</CNavTitle>

        <CNavItem>
          <NavLink to="/home" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilHome} /> Home
          </NavLink>
        </CNavItem>

        <CNavItem>
          <NavLink to="/create" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilPencil} /> Compose
          </NavLink>
        </CNavItem>

        {/* <CNavItem>
          <NavLink to="/viewPost" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilBold} /> View Blog
          </NavLink>
        </CNavItem> */}

        {/* THE LOGOUT BUTTON
           1. mt-auto: Pushes this item to the very bottom of the sidebar.
           2. text-danger: Makes the text and icon red.
        */}
        <CNavItem className="mt-auto">
          <NavLink onClick={handleLogout} className="nav-link text-danger">
            <CIcon customClassName="nav-icon text-danger" icon={cilAccountLogout} /> Logout
          </NavLink>
        </CNavItem>

      </CSidebarNav>
    </CSidebar>
  )
}

