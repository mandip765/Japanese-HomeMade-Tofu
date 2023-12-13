// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Line } from 'react-chartjs-2';
// import { format } from 'date-fns';

// const LineChart = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [expenses, setExpenses] = useState([]);

//   useEffect(() => {
//     // Fetch transactions data
//     axios.get('https://jhmt.onrender.com/api/transactions')
//       .then(response => {
//         setTransactions(response.data);
//       })
//       .catch(error => {
//         console.error(error);
//       });

//     // Fetch expenses data
//     axios.get('https://jhmt.onrender.com/api/expenses')
//       .then(response => {
//         setExpenses(response.data);
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   }, []);

//   // Aggregate data by date for transactions
//   const aggregatedTransactions = transactions.reduce((acc, entry) => {
//     const dateKey = format(new Date(entry.timestamp), 'MM/dd/yyyy');
//     acc[dateKey] = acc[dateKey] || { sales: 0, expenses: 0 };
//     acc[dateKey].sales += entry.totalAmount;
//     return acc;
//   }, {});

//   // Aggregate data by date for expenses
//   const aggregatedExpenses = expenses.reduce((acc, entry) => {
//     const dateKey = format(new Date(entry.timestamp), 'MM/dd/yyyy');
//     acc[dateKey] = acc[dateKey] || { sales: 0, expenses: 0 };
//     acc[dateKey].expenses += entry.totalAmount;
//     return acc;
//   }, {});

//   // Combine the aggregated transactions and expenses data
//   const combinedAggregatedData = { ...aggregatedTransactions };

//   // Add expenses data or update totalAmount if the date already exists
//   Object.keys(aggregatedExpenses).forEach(date => {
//     if (combinedAggregatedData[date]) {
//       combinedAggregatedData[date].expenses += aggregatedExpenses[date].expenses;
//     } else {
//       combinedAggregatedData[date] = aggregatedExpenses[date];
//     }
//   });

//   // Convert aggregated data to an array for the chart
//   const chartData = {
//     labels: Object.keys(combinedAggregatedData),
//     datasets: [
//       {
//         label: 'Sales',
//         data: Object.values(combinedAggregatedData).map(item => item.sales),
//         fill: false,
//         borderColor: '#07DC01',
//       },
//       {
//         label: 'Expenses',
//         data: Object.values(combinedAggregatedData).map(item => item.expenses),
//         fill: false,
//         borderColor: 'red',
//       },
//     ],
//   };

//   return (
//     <div>
//       <h2 className='text-2xl'><strong>Sales and Expenses Chart</strong></h2>
//       <Line data={chartData} />
//     </div>
//   );
// };

// export default LineChart;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, LineChart, XAxis, Tooltip, ResponsiveContainer, Brush, YAxis } from 'recharts';
import { format } from 'date-fns';

const TransactionChart = () => {
  const [transactions, setTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    // Fetch transactions data
    axios.get('https://jhmt.onrender.com/api/transactions')
      .then(response => {
        setTransactions(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    // Fetch expenses data
    axios.get('https://jhmt.onrender.com/api/expenses')
      .then(response => {
        setExpenses(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  // Aggregate data by date for transactions
  const aggregatedTransactions = transactions.reduce((acc, entry) => {
    const dateKey = format(new Date(entry.timestamp), 'MM/dd');
    acc[dateKey] = acc[dateKey] || { sales: 0, expenses: 0 };
    acc[dateKey].sales += entry.totalAmount;
    return acc;
  }, {});

  // Aggregate data by date for expenses
  const aggregatedExpenses = expenses.reduce((acc, entry) => {
    const dateKey = format(new Date(entry.timestamp), 'MM/dd');
    acc[dateKey] = acc[dateKey] || { sales: 0, expenses: 0 };
    acc[dateKey].expenses += entry.totalAmount;
    return acc;
  }, {});

  // Combine the aggregated transactions and expenses data
  const combinedAggregatedData = { ...aggregatedTransactions };

  // Add expenses data or update totalAmount if the date already exists
  Object.keys(aggregatedExpenses).forEach(date => {
    if (combinedAggregatedData[date]) {
      combinedAggregatedData[date].expenses += aggregatedExpenses[date].expenses;
    } else {
      combinedAggregatedData[date] = aggregatedExpenses[date];
    }
  });

  // Convert aggregated data to an array for the chart

  const chartData = Object.keys(combinedAggregatedData).map(date => ({
    date,
    sales: combinedAggregatedData[date].sales,
    expenses: combinedAggregatedData[date].expenses,
  }));

  const formatYAxis = (value) => {
    // Format large numbers with 'k' for thousands without decimal
    const absValue = Math.abs(value);
    if (absValue >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    } else if (absValue >= 1e3) {
      return `${Math.floor(value / 1e3)}k`;
    }
    return value.toFixed(2);
  };

  return (
    <div className='mr-3'>
      <ResponsiveContainer width="100%" height={400} minHeight={300}>
        <LineChart data={chartData} margin={{ left: -27, right: 10 }}>
          <XAxis dataKey="date" />
          <YAxis
            type="number"
            domain={['auto', 'auto']}
            tickFormatter={formatYAxis}
            orientation="left"
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#07DC01" />
          <Line type="monotone" dataKey="expenses" stroke="red" />
          <Brush dataKey="date" height={30} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionChart;

