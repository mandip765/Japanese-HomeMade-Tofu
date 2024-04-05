// HomePage.js
import React, { useState, useEffect } from 'react';
import { Chart } from "chart.js/auto";
import { CategoryScale } from "chart.js";
import ExpensesPage from './ExpensesPage';


Chart.register(CategoryScale);

const Homepage = () => {
  const backendURL = 'https://jhmt.onrender.com';
  const [totalAllExpenses, setTotalAllExpenses] = useState(0);
  const [totalAllTransactions, setTotalAllTransactions] = useState(0);



  const fetchTotalTransactions = async () => {
    try {
      let apiUrl = `${backendURL}/api/transactions/total`;

      const response = await fetch(apiUrl);
      if (response.ok) {
        const total = await response.json();
        setTotalAllTransactions(total);
      } else {
        console.error('Failed to fetch total transactions. Response:', response);
      }
    } catch (error) {
      console.error('Error fetching total transactions:', error);
    }
  };

  const fetchTotalExpenses = async () => {
    try {
      let apiUrl = `${backendURL}/api/expenses/total`;

      const response = await fetch(apiUrl);
      if (response.ok) {
        const total = await response.json();
        setTotalAllExpenses(total); // Corrected line
      } else {
        console.error('Failed to fetch total expenses. Response:', response);
      }
    } catch (error) {
      console.error('Error fetching total expenses:', error);
    }
  };




  useEffect(() => {
    fetchTotalTransactions();
    fetchTotalExpenses();

  });

  return (
    <div className='p-5 grid grid-cols-2 md:grid-cols-1 gap-5 bg-blue-50'>
      <div>
        <div className='grid grid-cols-2 gap-1'>
          <div className='p-2 bg-blue-gray-100 rounded'>
            <h1 className='text-xl'><strong>Total Income</strong></h1>
            <strong className='text-green-700'> {totalAllTransactions}</strong>
          </div>
          <div className='p-2 bg-blue-gray-100 rounded'>
            <h1 className='text-xl'><strong>Total Expense</strong></h1>
            <strong className='text-red-700'> {totalAllExpenses}</strong>
          </div>
        </div>


        <div className='p-2 mt-2 bg-blue-gray-100 rounded'>
          <h1 className='text-xl'><strong>Difference</strong></h1>
          {
            totalAllTransactions > totalAllExpenses
              ? <strong className='text-green-700'>Profit:{totalAllTransactions - totalAllExpenses}</strong>
              : <strong className='text-red-700'>Loss:{totalAllExpenses - totalAllTransactions}</strong>
          }
        </div>


      </div>
      <ExpensesPage />
    </div>
  );
};

export default Homepage;