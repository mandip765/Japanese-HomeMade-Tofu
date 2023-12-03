import React, { useState } from "react";

import {
  Navbar,
  Typography,
  Avatar,
} from "@material-tailwind/react";

import { NavLink, useNavigate } from "react-router-dom";



const Header = () => {

  const [show, setShow] = useState(false);

  const toggle = () => {
    setShow(!show);
  }



  return (


    <Navbar className=" p-2 px-7 bg-blue-400">
      <div className=" flex justify-between">
        <Typography
          className="mr-4 ml-2 cursor-pointer py-1.5 font-medium"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-blue-500 p-0.5"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          />
          <NavLink to='/' replace> Japanese Homemade Tofu</NavLink>
        </Typography>





        <div className="flex items-center space-x-5">
          {/* <div className="space-x-5"> */}
          {show && <nav className='space-x-5  flex-col hidden sm:flex '>
            <NavLink to='/Transactions'>Transactions</NavLink>
            <NavLink to='Expenses'>Expenses</NavLink>
            <NavLink to='/SalesTransaction'>Incomes</NavLink>
          </nav>}
        </div>
        <div className='hidden sm:flex'>
          <button onClick={toggle}>
            {show ? <i className="fa-solid fa-xmark fa-xl"></i> : <i className="fa-solid fa-bars fa-xl"></i>} </button>
        </div>




        <nav className='space-x-5 sm:hidden flex items-center'>
          <NavLink to='/Transactions'>Transactions</NavLink>
          <NavLink to='/expenses'>Expenses</NavLink>
          <NavLink to='/SalesTransaction'>Incomes</NavLink>

        </nav>







      </div>

    </Navbar >

  )
}

export default Header