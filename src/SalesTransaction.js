import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { baseUrl } from './features/constant';

const SalesTransaction = () => {

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantitySold, setQuantitySold] = useState({});
  const [customProductName, setCustomProductName] = useState('');
  const [customProductPrice, setCustomProductPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);

  // Function to fetch the list of products from the backend
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/api/products`);
      if (response.ok) {
        const products = await response.json();
        setProducts(products);
      } else {
        toast.error('Failed to fetch products.');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products.');
    }
    finally {
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

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
      setIsLoading(true);
      const successMessages = [];
      const errorMessages = [];

      const transactionsPromises = selectedProducts.map(async (selectedProduct) => {

        const response = await fetch(`${baseUrl}/api/sales`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product: {
              name: selectedProduct.name,
              price: selectedProduct.price,
              quantity: quantitySold[selectedProduct.name] || 1,
            },
            quantitySold: quantitySold[selectedProduct.name],
            totalAmount: calculateTotalAmount(selectedProduct),
            timestamp: new Date().toISOString(),
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
      setIsLoading(false);
      setSelectedProducts([]);
      setQuantitySold({});
      setCustomProductName('');
      setCustomProductPrice('');
    }
  };

  return (
    <div>
      {isLoading ? (
        <div>
          <lottie-player src="https://lottie.host/109cd246-c7ed-423e-afdf-e66851833722/ksePca1mSt.json" background="##F2F2F2" speed="1" loop autoplay direction="1" mode="normal"></lottie-player>
        </div>
      ) : (
        <div>
          <div className=' m-5 mb-0 text-3xl flex justify-between'>
            <h1 ><strong>Item List</strong></h1>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-2 p-5 gap-2">
            {products.map((item) => (
              <div
                className="bg-blue-100 p-4 border rounded-md"
                key={item._id}
                style={{ borderRadius: '8px' }}
              >
                <img
                  src={`data:image/jpeg;base64,${item.base64Image}`}
                  alt={item.name}
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
                />
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
            <button className={'bg-teal-300 mb-5 rounded-md p-2'} onClick={isLoading ? null : handleCompleteTransaction}
              disabled={isLoading}>
              {isLoading ? (
                <div className="h-7 w-7 border-2 border-t-blue-gray-900 rounded-full animate-spin mx-auto"></div>
              ) : (
                'Add Income'
              )}
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTransaction;
