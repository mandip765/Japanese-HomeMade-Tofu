import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { baseUrl } from './features/constant';
import { product } from './product';

const SalesTransaction = () => {
  const nav = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantitySold, setQuantitySold] = useState({});
  const [customProductName, setCustomProductName] = useState('');
  const [customProductPrice, setCustomProductPrice] = useState('');

  const calculateTotalAmount = (item) => {
    const quantity = item.name === customProductName ? quantitySold[customProductName] || 0 : quantitySold[item.name] || 0;

    if (quantity) {
      return item.price * quantity;
    }

    return 0;
  };

  const handleQuantityChange = (e, item) => {
    const quantity = parseInt(e.target.value, 10);

    setQuantitySold((prevQuantitySold) => ({
      ...prevQuantitySold,
      [item.name]: quantity,
    }));

    setSelectedProducts((prevSelectedProducts) => {
      const existingProductIndex = prevSelectedProducts.findIndex((p) => p.name === item.name);

      if (existingProductIndex !== -1) {
        prevSelectedProducts[existingProductIndex] = { ...item, quantity };
      } else {
        prevSelectedProducts.push({ ...item, quantity });
      }

      return [...prevSelectedProducts];
    });

    if (item.name === customProductName) {
      setQuantitySold((prevQuantitySold) => ({
        ...prevQuantitySold,
        [customProductName]: quantity,
      }));
    }
  };

  const handleCompleteTransaction = async () => {
    try {
      const successMessages = [];
      const errorMessages = [];

      const transactionsPromises = selectedProducts.map(async (selectedProduct) => {
        const response = await fetch(`${baseUrl}/api/sales`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product: selectedProduct,
            quantitySold: quantitySold[selectedProduct.name],
            totalAmount: calculateTotalAmount(selectedProduct),
            timestamp: new Date(),
          }),
        });

        if (response.ok) {
          successMessages.push('Transaction completed successfully.');
        } else {
          errorMessages.push('Transaction failed.');
        }
      });

      if (customProductName && customProductPrice) {
        const customProduct = {
          name: customProductName,
          price: parseFloat(customProductPrice),
          quantity: quantitySold[customProductName] || 1,
        };

        const customProductResponse = await fetch(`${baseUrl}/api/sales`, {
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

      await Promise.all(transactionsPromises);

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
      setSelectedProducts([]);
      setQuantitySold({});
      setCustomProductName('');
      setCustomProductPrice('');
    }
  };

  return (
    <div>
      <div className="grid grid-cols-4 md:grid-cols-2 p-5 gap-2">
        {product.map((item) => (
          <div
            className="bg-blue-100 p-4 border rounded-md"
            key={item.name}
            style={{ borderRadius: '8px' }}
          >
            {item.pic}
            <h2 className="text-xl font-bold"> {item.name}</h2>
            <p>Price: {item.price}</p>
            <label className="block mt-2">
              Quantity:
              <input
                className="w-full rounded-md p-2 border"
                type="number"
                min="0"
                value={quantitySold[item.name] || ''}
                onChange={(e) => handleQuantityChange(e, item)}
              />
            </label>

          </div>

        ))}
        <div className='md:col-span-2' >
          <form className="p-5 bg-blue-100 rounded-md">
            <h2 className="text-xl mb-4 font-bold">Custom Product</h2>
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
      </div>

      <div className="px-5 flex justify-center items-center mt-4">
        <button
          className="bg-teal-300 mb-5 rounded-md p-2"
          onClick={handleCompleteTransaction}
        >
          Add Income
        </button>
      </div>
    </div>
  );
};

export default SalesTransaction;
