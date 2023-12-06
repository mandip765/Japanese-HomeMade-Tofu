import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart, {
  Series,
  ArgumentAxis,
  ZoomAndPan,
  Legend,
  ScrollBar,
  Point,
  Label,
} from 'devextreme-react/chart';
import { format } from 'date-fns';

const LineChart = () => {
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
  const chartData = Object.keys(combinedAggregatedData).map(date => ({
    arg: new Date(date).toDateString(),
    sales: combinedAggregatedData[date].sales,
    expenses: combinedAggregatedData[date].expenses,
  }));
  chartData.sort((a, b) => a.arg - b.arg);

  return (
    <div>
      <h2 className='text-2xl'><strong>Sales and Expenses Chart</strong></h2>
      {chartData.length > 0 ? (
        <Chart
          dataSource={chartData}
        >
          <Series
            valueField="sales"
            name="Sales"
            color="green"
          >
            <Point size={7} />
            <Label
              visible={true}
              position="top"
              backgroundColor="none"
              font={{ size: 12 }}
            />
          </Series>
          <Series
            valueField="expenses"
            name="Expenses"
            color="red"
          >
            <Point size={8} />
            <Label
              visible={true}
              position="bottom"
              backgroundColor="none"
              font={{ size: 12 }}
            />
          </Series>
          <ArgumentAxis />
          <ScrollBar visible={true} />
          <ZoomAndPan argumentAxis="both" />
          <Legend visible={false} />
        </Chart>
      ) : (
        <p>No data available for the chart.</p>
      )}
    </div>
  );
};

export default LineChart;
