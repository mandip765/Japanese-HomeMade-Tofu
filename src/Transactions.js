import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const backendURL = 'http://localhost:5005';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalAllTransactions, setTotalAllTransactions] = useState(0);
  const [totalSelectedTransactions, setTotalSelectedTransactions] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [totalAllExpenses, setTotalAllExpenses] = useState(0);
  const [totalSelectedExpenses, setTotalSelectedExpenses] = useState(0);

  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchTotalTransactions = async () => {
    try {
      let apiUrl = `${backendURL}/api/transactions/total`;

      if (startDate && endDate) {
        apiUrl += `?startDate=${encodeURIComponent(startDate.toISOString())}&endDate=${encodeURIComponent(endDate.toISOString())}`;
      }

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

  const fetchDetailedTransactions = async () => {
    try {
      setLoading(true);
      let apiUrl = `${backendURL}/api/transactions`;

      if (startDate && endDate) {
        apiUrl += `?startDate=${encodeURIComponent(startDate.toISOString())}&endDate=${encodeURIComponent(endDate.toISOString())}`;
      }

      const response = await fetch(apiUrl);

      if (response.ok) {
        const transactionsData = await response.json();

        // Filter transactions based on the selected date range
        const filteredTransactions = transactionsData.filter(transaction => {
          const transactionDate = new Date(transaction.timestamp);
          return (!startDate || transactionDate >= startDate) && (!endDate || transactionDate <= endDate);
        });

        // Reverse the array to show the last added transactions first
        const reversedTransactions = filteredTransactions.reverse();

        setTransactions(reversedTransactions);

        const total = reversedTransactions.reduce((acc, transaction) => acc + transaction.totalAmount, 0);
        setTotalSelectedTransactions(total);
      } else {
        console.error('Failed to fetch detailed transactions. Response:', response);
      }
    } catch (error) {
      console.error('Error fetching detailed transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalExpenses = async () => {
    try {
      let apiUrl = `${backendURL}/api/expenses/total`;

      if (startDate && endDate) {
        apiUrl += `?startDate=${encodeURIComponent(startDate.toISOString())}&endDate=${encodeURIComponent(endDate.toISOString())}`;
      }

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

  const fetchDetailedExpenses = async () => {
    try {
      setLoading(true);
      let apiUrl = `${backendURL}/api/expenses`;

      if (startDate && endDate) {
        apiUrl += `?startDate=${encodeURIComponent(startDate.toISOString())}&endDate=${encodeURIComponent(endDate.toISOString())}`;
      }

      const response = await fetch(apiUrl);

      if (response.ok) {
        const expensesData = await response.json();

        const filteredExpenses = expensesData.filter(expense => {
          const expenseDate = new Date(expense.timestamp);
          return (!startDate || expenseDate >= startDate) && (!endDate || expenseDate <= endDate);
        });

        // console.log(expensesData);
        const reversedExpenses = filteredExpenses.reverse();

        setExpenses(reversedExpenses);

        const totalExpenses = reversedExpenses.reduce((acc, expense) => acc + expense.totalAmount, 0);
        setTotalSelectedExpenses(totalExpenses);
        // console.log(totalExpenses);
      } else {
        console.error('Failed to fetch detailed expenses. Response:', response);
      }
    } catch (error) {
      console.error('Error fetching detailed expenses:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    fetchTotalTransactions();
    fetchTotalExpenses();
  };


  useEffect(() => {
    fetchTotalTransactions();
    fetchDetailedTransactions();
    fetchTotalExpenses();
    fetchDetailedExpenses();
  }, [startDate, endDate]);

  return (
    <div className='p-5 '>
      <h3 className='text-center text-2xl mb-4'><strong>Transaction History</strong></h3>

      <div className="flex justify-between mb-4 md:">
        <div>
          <label className="mr-2">Start Date:</label>
          <input type="date" onChange={(e) => setStartDate(new Date(e.target.value))} value={startDate ? format(startDate, 'yyyy-MM-dd') : ''} />
        </div>
        <div>
          <label className="mr-2">End Date:</label>
          <input type="date" onChange={(e) => setEndDate(new Date(e.target.value))} value={endDate ? format(endDate, 'yyyy-MM-dd') : ''} />
        </div>
        <div>
          <button className='bg-red-500 text-white p-1 px-4 rounded' onClick={handleClear}>Clear</button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className='table w-full'>
          <thead>
            <tr>
              <th className='text-left'>Expense</th>
              <th>Date</th>
              <th>Quantity Sold</th>
              <th>Total Amount (Rs)</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td>{expense.product && expense.product.name}</td>
                <td>{format(new Date(expense.timestamp), 'PPP', { timeZone: 'Asia/Kathmandu' })}</td>
                <td className='text-center'>{expense.quantitySold || '-'}</td>
                <td className='text-center text-red-400'>{expense.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <table className='table w-full'>
        <thead>
          <tr>
            <th className='text-left'>Income</th>
            <th>Date</th>
            <th>Quantity Sold</th>
            <th>Total Amount (Rs)</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.product && transaction.product.name}</td>
              <td>{format(new Date(transaction.timestamp), 'PPP', { timeZone: 'Asia/Kathmandu' })}</td>
              <td className='text-center'>{transaction.quantitySold}</td>
              <td className='text-center text-green-500 '>{transaction.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {startDate && endDate ? (
        <div>
          <p className="text-xl mb-2"><strong>Total of Selected Expenses:</strong> {totalSelectedExpenses}</p>
          <p className="text-xl mb-2"><strong>Total of Selected Incomes:</strong> {totalSelectedTransactions}</p>
        </div>
      ) : (
        <tfoot>
          <tr>
            <td colSpan="3"><strong>Total of All Incomes:</strong></td>
            <td className='text-green-500'><strong>{totalAllTransactions}</strong></td>
          </tr>
          <tr>
            <td colSpan="3"><strong>Total of All Expenses:</strong></td>
            <td className='text-red-400'><strong>{totalAllExpenses}</strong></td>
          </tr>
        </tfoot>

      )}
      <div>
        <p className="text-xl mb-2"><strong>Total of All Transactions:</strong> {totalAllTransactions - totalAllExpenses}</p>
      </div>
    </div>
  );
};

export default Transactions;