// src/components/LineChart.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';

const LineChart = () => {
  const [transactions, setTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    // Fetch transactions data
    axios.get('http://localhost:5005/api/transactions')
      .then(response => {
        setTransactions(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    // Fetch expenses data
    axios.get('http://localhost:5005/api/expenses')
      .then(response => {
        setExpenses(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  // Aggregate data by date for transactions
  const aggregatedTransactions = transactions.reduce((acc, entry) => {
    const dateKey = format(new Date(entry.timestamp), 'MM/dd/yyyy');
    acc[dateKey] = acc[dateKey] || { sales: 0, expenses: 0 };
    acc[dateKey].sales += entry.totalAmount;
    return acc;
  }, {});

  // Aggregate data by date for expenses
  const aggregatedExpenses = expenses.reduce((acc, entry) => {
    const dateKey = format(new Date(entry.timestamp), 'MM/dd/yyyy');
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
  const chartData = {
    labels: Object.keys(combinedAggregatedData),
    datasets: [
      {
        label: 'Sales',
        data: Object.values(combinedAggregatedData).map(item => item.sales),
        fill: false,
        borderColor: '#07DC01',
      },
      {
        label: 'Expenses',
        data: Object.values(combinedAggregatedData).map(item => item.expenses),
        fill: false,
        borderColor: 'red',
      },
    ],
  };

  return (
    <div>
      <h2 className='text-2xl'><strong>Sales and Expenses Chart</strong></h2>
      <Line data={chartData} />
    </div>
  );
};

export default LineChart;
