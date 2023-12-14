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
  };

  return (
    <Navbar className="p-2 px-3 bg-blue-400 w-[100%]"> {/* Add w-full class */}
      <div className="flex justify-between">
        <Typography className="mr-4 ml-2 cursor-pointer py-1.5 font-medium">
          <NavLink to="/" replace>
            Japanese Homemade Tofu
          </NavLink>
        </Typography>

        <div className="flex items-center space-x-5">
          {show && (
            <nav className="space-x-5 flex-col hidden sm:flex">
              <NavLink to="/Transactions">Transactions</NavLink>
              <NavLink to="/Expenses">Expenses</NavLink>
              <NavLink to="/SalesTransaction">Incomes</NavLink>
              <NavLink to="/products">Products</NavLink>
            </nav>
          )}
        </div>

        <div className="hidden sm:flex">
          <button onClick={toggle}>
            {show ? (
              <i className="fa-solid fa-xmark fa-xl"></i>
            ) : (
              <i className="fa-solid fa-bars fa-xl"></i>
            )}{" "}
          </button>
        </div>

        <nav className="space-x-5 sm:hidden flex items-center">
          <NavLink to="/Transactions">Transactions</NavLink>
          <NavLink to="/expenses">Expenses</NavLink>
          <NavLink to="/SalesTransaction">Incomes</NavLink>
          <NavLink to="/products">Products</NavLink>
        </nav>
      </div>
    </Navbar>
  );
};

export default Header;