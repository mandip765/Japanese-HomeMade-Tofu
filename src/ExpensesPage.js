import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { baseUrl } from './features/constant';

const ExpensesPage = () => {
  const [customProductName, setCustomProductName] = useState('');
  const [customProductPrice, setCustomProductPrice] = useState('');
  const [quantitySold, setQuantitySold] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [unitOfMeasurement, setUnitOfMeasurement] = useState('unit');
  const [vat, setVat] = useState(0);

  const calculateTotalAmount = (item) => {
    const quantity = quantitySold[item.name] || 1;
    const subtotal = item.price * quantity;
    const vatAmount = (subtotal * (parseFloat(vat) || 0)) / 100;
    return subtotal + vatAmount;
  };

  const handleCompleteTransaction = async () => {
    try {
      setIsLoading(true);
      const successMessages = [];
      const errorMessages = [];

      if (customProductName && customProductPrice) {
        const customProduct = {
          name: customProductName,
          price: parseFloat(customProductPrice),
          quantity: quantitySold[customProductName] || 1,
          unit: unitOfMeasurement,
          vat: parseFloat(vat) || 0,
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
            vat: customProduct.vat,
            timestamp: new Date(),
          }),
        });

        if (customProductResponse.ok) {
          successMessages.push('Custom product added to the transaction.');
        } else {
          errorMessages.push('Failed to add custom product to the transaction.');
        }
      } else {
        errorMessages.push('Please provide both product name and price.');
      }

      successMessages.forEach((message) => toast.success(message));
      errorMessages.forEach((message) => toast.error(message));

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error completing transactions.');
    } finally {
      setIsLoading(false);
      setQuantitySold({});
      setCustomProductName('');
      setCustomProductPrice('');
      setVat(0);
    }
  };

  return (
    <div>
      <div className="p-5 gap-2">
        <div>
          <form className="p-5 bg-blue-100 rounded-md">
            <h2 className="text-xl mb-4 font-bold">Add Expenses</h2>
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
              <div className="grid grid-flow-col">
                <input
                  className="w-full rounded-md p-2 border"
                  type="number"
                  min="0"
                  step="0.01"
                  value={customProductPrice}
                  onChange={(e) => setCustomProductPrice(e.target.value)}
                />
                <select
                  className="ml-2 p-2 border rounded-md"
                  value={unitOfMeasurement}
                  onChange={(e) => setUnitOfMeasurement(e.target.value)}
                >
                  <option value="unit">per unit</option>
                  <option value="kg">per kg</option>
                  <option value="liter">per liter</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-1">VAT Rate (%):</label>
              <input
                className="w-full rounded-md p-2 border"
                type="number"
                min="0"
                step="0.01"
                value={vat}
                onChange={(e) => setVat(e.target.value)}
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
      </div>

      <div className="px-5 flex justify-center items-center mt-4">
        <button
          className={`bg-teal-300 mb-5 rounded-md p-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleCompleteTransaction}
          disabled={isLoading}
        >
          {isLoading ? 'Adding Expense...' : 'Add Expense'}
        </button>
      </div>
    </div>
  );
};

export default ExpensesPage;
