import React from 'react'
import { Outlet } from 'react-router'
import Header from './Header'

const RootLayOut = () => {

  return (
    <>
      <Header />
      <Outlet />
      <footer>
        <br />
      </footer>
    </>
  )
}

export default RootLayOut