import React from 'react'
import { Route, Routes } from 'react-router'
import RootLayOut from './component/RootLayOut'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SalesTransaction from './SalesTransaction';
import Transactions from './Transactions';
import ExpensesPage from './ExpensesPage';
import Homepage from './Homepage';



const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<RootLayOut />} >
          <Route index element={<Homepage />} />
          <Route path='/Transactions' element={<Transactions />} />
          <Route path='/Expenses' element={<ExpensesPage />} />
          <Route path='/SalesTransaction' element={<SalesTransaction />} />
        </Route>


      </Routes >
      <ToastContainer autoClose={1000} />
    </>

  )
}

export default App