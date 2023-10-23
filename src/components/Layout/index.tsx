import React from 'react'
import { Navigate } from 'react-router-dom'
import { NavbarNested } from '../Sidebar/NavbarNested'
import TopBar from '../TopBar'
import "./glabal.css"
type Props = {
  children: React.ReactNode,
  login: boolean
}

const Layout = ({ children, login }: Props) => {
  if (!login) return <Navigate to="/" />

  return (
    <div style={{display: "flex" , justifyContent: "space-between" , flexDirection: "column"}}>
      <div><TopBar/></div>
      <div className='wrapper_topbar_children'>
        <div style={{ height: "100vh" }}>
          <NavbarNested />
        </div>
        <div style={{width :"100%", height: "100vh", overflow: "auto"}}>
          {children}
        </div>
      </div>

    </div>

  )
}

export default Layout
