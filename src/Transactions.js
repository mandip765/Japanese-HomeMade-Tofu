// import React, { useState, useEffect } from 'react';
// import { format } from 'date-fns';
// import { baseUrl } from './features/constant';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash } from '@fortawesome/free-solid-svg-icons';
// import 'tailwindcss/tailwind.css'; // Import Tailwind CSS

// const backendURL = baseUrl;

// const Transactions = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [totalAllTransactions, setTotalAllTransactions] = useState(0);
//   const [totalSelectedTransactions, setTotalSelectedTransactions] = useState(0);
//   const [expenses, setExpenses] = useState([]);
//   const [totalAllExpenses, setTotalAllExpenses] = useState(0);
//   const [totalSelectedExpenses, setTotalSelectedExpenses] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);

//   const fetchTotalTransactions = async () => {
//     try {
//       let apiUrl = `${backendURL}/api/transactions/total`;

//       if (startDate && endDate) {
//         apiUrl += `?startDate=${encodeURIComponent(startDate.toISOString())}&endDate=${encodeURIComponent(endDate.toISOString())}`;
//       }

//       const response = await fetch(apiUrl);
//       if (response.ok) {
//         const total = await response.json();
//         setTotalAllTransactions(total);
//       } else {
//         console.error('Failed to fetch total transactions. Response:', response);
//       }
//     } catch (error) {
//       console.error('Error fetching total transactions:', error);
//     }
//   };

//   const fetchDetailedTransactions = async () => {
//     try {
//       setLoading(true);
//       let apiUrl = `${backendURL}/api/transactions`;

//       if (startDate && endDate) {
//         apiUrl += `?startDate=${encodeURIComponent(startDate.toISOString())}&endDate=${encodeURIComponent(endDate.toISOString())}`;
//       }

//       const response = await fetch(apiUrl);

//       if (response.ok) {
//         const transactionsData = await response.json();

//         // Filter transactions based on the selected date range
//         const filteredTransactions = transactionsData.filter(transaction => {
//           const transactionDate = new Date(transaction.timestamp);
//           return (!startDate || transactionDate >= startDate) && (!endDate || transactionDate <= endDate);
//         });

//         // Reverse the array to show the last added transactions first
//         const reversedTransactions = filteredTransactions.reverse();

//         setTransactions(reversedTransactions);

//         const total = reversedTransactions.reduce((acc, transaction) => acc + transaction.totalAmount, 0);
//         setTotalSelectedTransactions(total);
//       } else {
//         console.error('Failed to fetch detailed transactions. Response:', response);
//       }
//     } catch (error) {
//       console.error('Error fetching detailed transactions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTotalExpenses = async () => {
//     try {
//       let apiUrl = `${backendURL}/api/expenses/total`;

//       if (startDate && endDate) {
//         apiUrl += `?startDate=${encodeURIComponent(startDate.toISOString())}&endDate=${encodeURIComponent(endDate.toISOString())}`;
//       }

//       const response = await fetch(apiUrl);
//       if (response.ok) {
//         const total = await response.json();
//         setTotalAllExpenses(total); // Corrected line
//       } else {
//         console.error('Failed to fetch total expenses. Response:', response);
//       }
//     } catch (error) {
//       console.error('Error fetching total expenses:', error);
//     }
//   };

//   const fetchDetailedExpenses = async () => {
//     try {
//       setLoading(true);
//       let apiUrl = `${backendURL}/api/expenses`;

//       if (startDate && endDate) {
//         apiUrl += `?startDate=${encodeURIComponent(startDate.toISOString())}&endDate=${encodeURIComponent(endDate.toISOString())}`;
//       }

//       const response = await fetch(apiUrl);

//       if (response.ok) {
//         const expensesData = await response.json();

//         const filteredExpenses = expensesData.filter(expense => {
//           const expenseDate = new Date(expense.timestamp);
//           return (!startDate || expenseDate >= startDate) && (!endDate || expenseDate <= endDate);
//         });

//         // console.log(expensesData);
//         const reversedExpenses = filteredExpenses.reverse();

//         setExpenses(reversedExpenses);

//         const totalExpenses = reversedExpenses.reduce((acc, expense) => acc + expense.totalAmount, 0);
//         setTotalSelectedExpenses(totalExpenses);
//         // console.log(totalExpenses);
//       } else {
//         console.error('Failed to fetch detailed expenses. Response:', response);
//       }
//     } catch (error) {
//       console.error('Error fetching detailed expenses:', error);
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleClear = () => {
//     setStartDate(null);
//     setEndDate(null);
//     fetchTotalTransactions();
//     fetchTotalExpenses();
//   };


//   useEffect(() => {
//     fetchTotalTransactions();
//     fetchDetailedTransactions();
//     fetchTotalExpenses();
//     fetchDetailedExpenses();
//   }, [startDate, endDate]);

//   const handleDeleteTransaction = async (transactionId) => {
//     const isConfirmed = window.confirm('Are you sure you want to delete this expense?');

//     if (!isConfirmed) {
//       return;
//     }
//     try {
//       const response = await fetch(`${backendURL}/api/transactions/${transactionId}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         // Remove the deleted transaction from the state
//         setTransactions((prevTransactions) => prevTransactions.filter((transaction) => transaction._id !== transactionId));
//       } else {
//         console.error('Failed to delete transaction. Response:', response);
//       }
//     } catch (error) {
//       console.error('Error deleting transaction:', error);
//     }
//   };

//   const handleDeleteExpense = async (expenseId) => {
//     const isConfirmed = window.confirm('Are you sure you want to delete this expense?');

//     if (!isConfirmed) {
//       return;
//     }
//     try {
//       const response = await fetch(`${backendURL}/api/expenses/${expenseId}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         // Remove the deleted expense from the state
//         setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense._id !== expenseId));
//       } else {
//         console.error('Failed to delete expense. Response:', response);
//       }
//     } catch (error) {
//       console.error('Error deleting expense:', error);
//     }
//   };



//   return (
//     <div className='p-5'>
//       <h3 className='text-center text-2xl mb-4'><strong>Transaction History</strong></h3>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
//         <div className="mb-2">
//           <label className="mr-2">Start Date:</label>
//           <input
//             type="date"
//             onChange={(e) => setStartDate(new Date(e.target.value))}
//             value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
//             className="border p-2 rounded w-full"
//           />
//         </div>
//         <div className="mb-2">
//           <label className="mr-2">End Date:</label>
//           <input
//             type="date"
//             onChange={(e) => setEndDate(new Date(e.target.value))}
//             value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
//             className="border p-2 rounded w-full"
//           />
//         </div>
//         <div className="mt-2 md:mt-6">
//           <button
//             className="bg-red-500 text-white p-2 rounded w-full"
//             onClick={handleClear}
//           >
//             Clear
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div>
//           <lottie-player src="https://lottie.host/109cd246-c7ed-423e-afdf-e66851833722/ksePca1mSt.json" background="##F2F2F2" speed="1" loop autoplay direction="1" mode="normal"></lottie-player>
//         </div>
//       ) : (
//         <table className='table w-full '>
//           <thead>
//             <tr>
//               <th className='text-left'>Expense</th>
//               <th>Date</th>
//               <th>Quantity Sold</th>
//               <th>Total Amount (Rs)</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {expenses.map((expense) => (
//               <tr key={expense._id}>
//                 <td>{expense.product && expense.product.name}</td>
//                 <td>{format(new Date(expense.timestamp), 'PPP', { timeZone: 'Asia/Kathmandu' })}</td>
//                 <td className='text-center'>{expense.quantitySold || '-'}</td>
//                 <td className='text-center text-red-400'>{expense.totalAmount}</td>
//                 <td className="text-center">
//                   <button
//                     onClick={() => handleDeleteExpense(expense._id)}
//                     className="flex items-center justify-center h-full"
//                   >
//                     <FontAwesomeIcon icon={faTrash} className="mx-7" />
//                   </button>
//                 </td>


//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//       <table className='table w-full '>
//         <thead>
//           <tr>
//             <th className='text-left'>Income</th>
//             <th>Date</th>
//             <th>Quantity Sold</th>
//             <th>Total Amount (Rs)</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {transactions.map((transaction) => (
//             <tr key={transaction._id}>
//               <td>{transaction.product && transaction.product.name}</td>
//               <td>{format(new Date(transaction.timestamp), 'PPP', { timeZone: 'Asia/Kathmandu' })}</td>
//               <td className='text-center'>{transaction.quantitySold}</td>
//               <td className='text-center text-green-500'>{transaction.totalAmount}</td>
//               <td className="text-center">
//                 <button
//                   onClick={() => handleDeleteTransaction(transaction._id)}
//                   className="flex items-center justify-center h-full"
//                 >
//                   <FontAwesomeIcon icon={faTrash} className="mx-7" />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>

//       </table>
//       {(startDate && endDate) || (startDate || endDate) ? (
//         <div className="mt-4">
//           <p className="text-xl mb-2">
//             <strong>Total of Selected Expenses:</strong> {totalSelectedExpenses}
//           </p>
//           <p className="text-xl mb-2">
//             <strong>Total of Selected Incomes:</strong> {totalSelectedTransactions}
//           </p>
//         </div>
//       ) : (


//         <tfoot className="mt-4">
//           <tr className="text-xl mb-2">
//             <td ><strong>Total of All Incomes:</strong></td>
//             <td className='text-green-500'><strong>{totalAllTransactions}</strong></td>
//           </tr>
//           <tr className="text-xl mb-2">
//             <td ><strong>Total of All Expenses:</strong></td>
//             <td className='text-red-400'><strong>{totalAllExpenses}</strong></td>
//           </tr>
//           <div>
//             <p className="text-xl mb-2"><strong>Total of All Transactions:</strong> {totalAllTransactions - totalAllExpenses}</p>
//           </div>
//         </tfoot>
//       )}
//     </div>
//   );
// };

// export default Transactions;







import React, { useState, useEffect } from 'react';
import { format, addDays, startOfMonth, endOfMonth } from 'date-fns';
import { baseUrl } from './features/constant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from './DeleteConfirmationModal';
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS
import Select from 'react-select';
import { toast } from 'react-toastify';

const backendURL = baseUrl;

// Define filter options
const FILTER_OPTIONS = {
  ALL: 'All',
  TRANSACTIONS: 'Incomes',
  EXPENSES: 'Expenses',
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalAllTransactions, setTotalAllTransactions] = useState(0);
  const [totalSelectedTransactions, setTotalSelectedTransactions] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [totalAllExpenses, setTotalAllExpenses] = useState(0);
  const [totalSelectedExpenses, setTotalSelectedExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isIncomeConfirmation, setIsIncomeConfirmation] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationItemId, setConfirmationItemId] = useState(null);
  const [currentFilter, setCurrentFilter] = useState(FILTER_OPTIONS.ALL); // Added state for filter selection

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
        setTotalAllExpenses(total);
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

        const reversedExpenses = filteredExpenses.reverse();

        setExpenses(reversedExpenses);

        const totalExpenses = reversedExpenses.reduce((acc, expense) => acc + expense.totalAmount, 0);
        setTotalSelectedExpenses(totalExpenses);
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

  const handleDeleteTransaction = async (transactionId) => {
    setConfirmationItemId(transactionId);
    setIsIncomeConfirmation(true);
    setShowConfirmationModal(true);
  };

  const handleDeleteExpense = async (expenseId) => {
    setConfirmationItemId(expenseId);
    setIsIncomeConfirmation(false);
    setShowConfirmationModal(true);
  };

  const hideConfirmationModal = () => {
    setShowConfirmationModal(false);
    setConfirmationItemId(null);
  };

  const handleDeleteIncomeConfirmation = async () => {
    if (!confirmationItemId) {
      hideConfirmationModal();
      return;
    }

    try {
      const response = await fetch(`${backendURL}/api/transactions/${confirmationItemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTransactions((prevTransactions) => prevTransactions.filter((transaction) => transaction._id !== confirmationItemId));
        toast.success('Transaction deleted successfully');
      } else {
        toast.error('Failed to delete transaction');
        console.error('Failed to delete transaction. Response:', response);
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    } finally {
      hideConfirmationModal();
    }
  };

  const handleDeleteExpensesConfirmation = async () => {
    if (!confirmationItemId) {
      hideConfirmationModal();
      return;
    }

    try {
      const response = await fetch(`${backendURL}/api/expenses/${confirmationItemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense._id !== confirmationItemId));
        toast.success('Expense deleted successfully');
      } else {
        toast.error('Failed to delete expense');
        console.error('Failed to delete expense. Response:', response);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    } finally {
      hideConfirmationModal();
    }
  };

  const today = new Date();
  const last7Days = addDays(today, -6);
  const last30Days = addDays(today, -29);
  const thisMonthStart = startOfMonth(today);
  const thisMonthEnd = endOfMonth(today);

  const defaultDateRanges = [
    { label: 'Today', range: [today, today] },
    { label: 'Last 7 Days', range: [last7Days, today] },
    { label: 'Last 30 Days', range: [last30Days, today] },
    { label: 'This Month', range: [thisMonthStart, thisMonthEnd] },
  ];

  const handleDefaultDateRange = (selectedOption) => {
    const range = selectedOption.value;
    setStartDate(range[0]);
    setEndDate(range[1]);
  };

  useEffect(() => {
    fetchTotalTransactions();
    fetchDetailedTransactions();
    fetchTotalExpenses();
    fetchDetailedExpenses();
  }, [startDate, endDate]);

  return (
    <div className="p-5">
      <h3 className="text-center text-2xl mb-4">
        <strong>Transaction History</strong>
      </h3>
      {/* Filter Controls */}
      <div className="filter-controls mb-4 flex justify-center gap-4">
        {Object.values(FILTER_OPTIONS).map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setCurrentFilter(filterOption)}
            className={`py-2 px-4 rounded ${currentFilter === filterOption ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {filterOption}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-1 mb-4">
        <div className="mb-2">
          <label className="mr-2">Start Date:</label>
          <input
            type="date"
            onChange={(e) => setStartDate(new Date(e.target.value))}
            value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-2">
          <label className="mr-2">End Date:</label>
          <input
            type="date"
            onChange={(e) => setEndDate(new Date(e.target.value))}
            value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mt-6">
          <button className="bg-red-500 text-white p-2 rounded w-full" onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>
      <div className="mb-4">
        <Select
          options={defaultDateRanges.map((rangeOption) => ({
            value: rangeOption.range,
            label: rangeOption.label,
          }))}
          onChange={handleDefaultDateRange}
          placeholder="Select Date Range"
        />
      </div>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={hideConfirmationModal}
        onConfirm={() => {
          if (isIncomeConfirmation) {
            handleDeleteIncomeConfirmation();
          } else {
            handleDeleteExpensesConfirmation();
          }
        }}
        message="Are you sure you want to delete this item?"
      />

      {loading ? (
        <div>
          <lottie-player
            src="https://lottie.host/109cd246-c7ed-423e-afdf-e66851833722/ksePca1mSt.json"
            background="##F2F2F2"
            speed="1"
            loop
            autoplay
            direction="1"
            mode="normal"
          ></lottie-player>
        </div>
      ) : (
        <>
          {/* Expenses Table: Only rendered if filter is set to ALL or EXPENSES */}
          {currentFilter === FILTER_OPTIONS.ALL || currentFilter === FILTER_OPTIONS.EXPENSES ? (
            <div>
              <table className="table w-full mb-4">
                <thead className='bg-black text-white'>
                  <tr>
                    <th>Detail</th>
                    <th>Date</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                    <th>VAT</th>
                    <th>Unit</th> {/* Added Unit column */}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense, index) => (
                    <tr key={expense._id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                      <td>{expense.product && expense.product.name}</td>
                      <td className="hidden sm:table-cell text-sm text-center">{format(new Date(expense.timestamp), 'MM/dd', { timeZone: 'Asia/Kathmandu' })}</td>
                      <td className="sm:hidden text-center">{format(new Date(expense.timestamp), 'PPP')}</td>
                      <td className="text-center">{expense.quantitySold || '-'}</td>
                      <td className="text-center text-red-400">{expense.totalAmount}</td>
                      <td className="text-center text-red-400">{expense.product.vat || '-'}</td>
                      <td className="text-center text-red-400">{expense.product.unit || '-'}</td> {/* Added unit data */}
                      <td className="text-center">
                        <button
                          onClick={() => handleDeleteExpense(expense._id)}
                          className="flex items-center justify-center h-full"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mx-2" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {/* Transactions Table: Only rendered if filter is set to ALL or TRANSACTIONS */}
          {currentFilter === FILTER_OPTIONS.ALL || currentFilter === FILTER_OPTIONS.TRANSACTIONS ? (
            <div>
              <table className="table w-full">
                <thead className='bg-black text-white'>
                  <tr>
                    <th>Detail</th>
                    <th>Date</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={transaction._id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                      <td>{transaction.product && transaction.product.name}</td>
                      <td className="hidden sm:table-cell text-sm text-center">{format(new Date(transaction.timestamp), 'MM/dd', { timeZone: 'Asia/Kathmandu' })}</td>
                      <td className="sm:hidden text-center">{format(new Date(transaction.timestamp), 'PPP')}</td>
                      <td className="text-center">{transaction.quantitySold}</td>
                      <td className="text-center text-green-500">{transaction.totalAmount}</td>
                      <td className="text-center">
                        <button
                          onClick={() => handleDeleteTransaction(transaction._id)}
                          className="flex items-center justify-center h-full"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mx-2" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {/* Total amounts display */}
          {(startDate && endDate) || (startDate || endDate) ? (
            <div className="mt-4">
              <p className="text-xl mb-2">
                <strong>Total of Selected Expenses:</strong> {totalSelectedExpenses}
              </p>
              <p className="text-xl mb-2">
                <strong>Total of Selected Incomes:</strong> {totalSelectedTransactions}
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-xl mb-2">
                <strong>Total of All Incomes:</strong> {totalAllTransactions}
              </p>
              <p className="text-xl mb-2">
                <strong>Total of All Expenses:</strong> {totalAllExpenses}
              </p>
              <div>
                <p className="text-xl mb-2">
                  <strong>Total of All Transactions:</strong> {totalAllTransactions - totalAllExpenses}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Transactions;
