import React from 'react'
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
import { cilHome, cilPencil, cilFootball, cilBold, cilAccountLogout } from '@coreui/icons'
import { NavLink } from 'react-router-dom' 

export const Sidebar = () => {
  return (
    <CSidebar className="border-end h-screen bg-slate-400" unfoldable>
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand>
            <CIcon icon={cilFootball} height={32} />
        </CSidebarBrand>
      </CSidebarHeader>

      <CSidebarNav>
        <CNavTitle>BLOGIFY</CNavTitle>

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

        <CNavItem>
          <NavLink to="/viewPost" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilBold} /> View Blog
          </NavLink>
        </CNavItem>

        {/* THE LOGOUT BUTTON
           1. mt-auto: Pushes this item to the very bottom of the sidebar.
           2. text-danger: Makes the text and icon red.
        */}
        <CNavItem className="mt-auto">
          <NavLink to="/login" className="nav-link text-danger">
            <CIcon customClassName="nav-icon text-danger" icon={cilAccountLogout} /> Logout
          </NavLink>
        </CNavItem>

      </CSidebarNav>
    </CSidebar>
  )
}

export default Sidebar