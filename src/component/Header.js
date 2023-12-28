import React, { useState, useEffect, useRef } from "react";
import { Navbar, Typography } from "@material-tailwind/react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [show, setShow] = useState(false);
  const sidebarRef = useRef(null);

  const toggle = (event) => {
    event.stopPropagation();  // Prevent click event from propagating to document
    setShow(!show);
  };
  const handleClick = (event) => {
    if (show && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [show]);

  return (
    <div className="relative">
      {/* Header */}
      <Navbar className="p-2 px-3 bg-blue-400 w-full" style={{ zIndex: 3 }}>
        <div className="flex items-center justify-between">
          <Typography className="mr-4 ml-2 cursor-pointer py-1.5 font-medium">
            <NavLink to="/" replace>
              Japanese Homemade Tofu
            </NavLink>
          </Typography>
          <div className="hidden sm:flex">
            <button onClick={toggle} aria-label={show ? "Close menu" : "Open menu"}>
              {show ? (
                <i className="fa-solid fa-xmark fa-xl"></i>
              ) : (
                <i className="fa-solid fa-bars fa-xl"></i>
              )}
            </button>
          </div>
          <nav className="space-x-5 sm:hidden flex items-center">
            <NavLink to="/Transactions" aria-label="Transactions" onClick={() => setShow(false)}>
              Transactions
            </NavLink>
            <NavLink to="/expenses" aria-label="Expenses" onClick={() => setShow(false)}>
              Expenses
            </NavLink>
            <NavLink to="/SalesTransaction" aria-label="Incomes" onClick={() => setShow(false)}>
              Incomes
            </NavLink>
            <NavLink to="/products" aria-label="Products" onClick={() => setShow(false)}>
              Products
            </NavLink>
          </nav>
        </div>
      </Navbar>

      {/* Dark Overlay for Body */}
      {show && <div className="fixed top-14 right-0 w-full h-full bg-black overlay-visible" style={{ opacity: 0.5, zIndex: 2 }}></div>}

      {/* Sidebar */}
      {show && (
        <div
          ref={sidebarRef}
          className="fixed top-14 right-0 h-screen w-[70%] bg-blue-400 p-4  sidebar"
          style={{ zIndex: 3 }}
        >
          <nav className="flex flex-col space-y-1">
            <NavLink to="/Transactions" className="text-white border-b border-blue-gray-400 p-2" aria-label="Transactions">
              Transactions
            </NavLink>
            <NavLink to="/Expenses" className="text-white border-b border-blue-gray-400 p-2" aria-label="Expenses">
              Expenses
            </NavLink>
            <NavLink to="/SalesTransaction" className="text-white border-b border-blue-gray-400 p-2" aria-label="Incomes">
              Incomes
            </NavLink>
            <NavLink to="/products" className="text-white border-b border-blue-gray-400 p-2" aria-label="Products">
              Products
            </NavLink>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Header;