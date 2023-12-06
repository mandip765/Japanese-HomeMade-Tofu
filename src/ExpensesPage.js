import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { baseUrl } from './features/constant';
import Select from 'react-select';


const ExpensesPage = () => {
  const nav = useNavigate();
  const [customProductName, setCustomProductName] = useState('');
  const [customProductPrice, setCustomProductPrice] = useState('');
  const [quantitySold, setQuantitySold] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);


  const calculateTotalAmount = (item) => {
    const quantity = item.name === customProductName ? quantitySold[customProductName] || 0 : quantitySold[item.name] || 0;

    if (quantity) {
      return item.price * quantity;
    }

    return 0;
  };

  const handleCompleteTransaction = async () => {
    try {
      const successMessages = [];
      const errorMessages = [];

      if (customProductName && customProductPrice) {
        const customProduct = {
          name: customProductName,
          price: parseFloat(customProductPrice),
          quantity: quantitySold[customProductName] || 1,
          timestamp: new Date(),
        };

        const customProductResponse = await fetch(`${baseUrl}/api/expenses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product: customProduct,
            quantitySold: customProduct.quantity,
            totalAmount: calculateTotalAmount(customProduct),
            timestamp: new Date(),
          }),
        });

        if (customProductResponse.ok) {
          successMessages.push('Custom product added to the transaction.');
        } else {
          errorMessages.push('Failed to add custom product to the transaction.');
        }
      }

      // Assuming selectedProducts is not needed for expenses
      // await Promise.all(transactionsPromises);

      successMessages.forEach((message) => {
        toast.success(message);
      });

      errorMessages.forEach((message) => {
        toast.error(message);
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error completing transactions.');
    } finally {
      // Assuming selectedProducts is not needed for expenses
      // setSelectedProducts([]);
      setQuantitySold({});
      setCustomProductName('');
      setCustomProductPrice('');
    }
  };

  const handleAddProduct = () => {
    // Implement validation as needed before adding to the selectedProducts array
    setSelectedProducts([
      ...selectedProducts,
      {
        name: '',
        value: 0, // Set a default value or leave it as an empty string
      },
    ]);
  };

  const handleProductChange = (index, property, newValue) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product, i) => (i === index ? { ...product, [property]: newValue } : product))
    );
  };

  const yourArrayOfOptions = [
    { value: 'CheeseSpread', label: 'Cheese Spread' },
    { value: 'Butter', label: 'Butter' },
    { value: 'Sugar', label: 'Sugar' },
    // Add more options as needed
  ];

  return (
    <div>
      <div className="grid grid-cols-4 sm:grid-cols-1 p-5 gap-2 ">
        <div>
          <form className="p-5 bg-blue-100 rounded-md">
            <h2 className="text-xl mb-4 font-bold">Expenses</h2>
            <div className="mb-4">
              <label className="block mb-1">Product Name:</label>

              <input
                className="w-full rounded-md p-2 border"
                type="text"
                value={customProductName}
                onChange={(e) => setCustomProductName(e.target.value)}
              />

            </div>

            <div className="mb-4">
              <label className="block mb-1">Product Price:</label>
              <input
                className="w-full rounded-md p-2 border"
                type="number"
                min="0"
                step="0.01"
                value={customProductPrice}
                onChange={(e) => setCustomProductPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1">Quantity:</label>
              <input
                className="w-full rounded-md p-2 border"
                type="number"
                min="0"
                value={quantitySold[customProductName] || ''}
                onChange={(e) => {
                  setQuantitySold((prevQuantitySold) => ({
                    ...prevQuantitySold,
                    [customProductName]: parseInt(e.target.value, 10),
                  }));
                }}
              />
            </div>
          </form>
        </div>
      </div >

      <div className="px-5 flex justify-center items-center mt-4">
        <button
          className="bg-teal-300 mb-5 rounded-md p-2"
          onClick={handleCompleteTransaction}
        >
          Add Expense
        </button>
      </div>
    </div >
  );
};

export default ExpensesPage;