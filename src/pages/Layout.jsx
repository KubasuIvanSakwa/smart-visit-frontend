import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../components/Navbar'

function Layout() {
  return (
    <section>
        <section>
            <Outlet />
        </section>
    </section>
  )
}

export default Layout