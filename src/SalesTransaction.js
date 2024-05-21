// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import { baseUrl } from './features/constant';
// import BillModal from './BillModal';
// import CustomProductInput from './CustomProductInput';

// const SalesTransaction = () => {
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [quantitySold, setQuantitySold] = useState({});
//   const [customProductName, setCustomProductName] = useState('');
//   const [customProductPrice, setCustomProductPrice] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [showBillModal, setShowBillModal] = useState(false);

//   const fetchProducts = async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch(`${baseUrl}/api/products`);
//       if (response.ok) {
//         const products = await response.json();
//         setProducts(products);
//       } else {
//         toast.error('Failed to fetch products.');
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       toast.error('Error fetching products.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handlePreviewBill = () => {
//     setShowBillModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowBillModal(false);
//   };

//   const handlePrintBill = () => {
//     const printableContent = document.querySelector('.printable-area').innerHTML;
//     const printWindow = window.open('', '_blank', 'width=600,height=600');
//     printWindow.document.write(`<html><head><title>Print Bill</title><style>
//       body { font-family: Arial, sans-serif; }
//       .content { width: 100%; }
//       </style></head><body><div class='content'>${printableContent}</div></body></html>`);
//     printWindow.print();
//   };

//   const handleConfirmAndSave = async () => {
//     setShowBillModal(false);
//     try {
//       handleCompleteTransaction();
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Error completing transactions.');
//     }
//   };

//   const calculateTotalAmount = (item) => {
//     const quantity = item.name === customProductName ? quantitySold[customProductName] || 0 : quantitySold[item.name] || 0;

//     if (quantity) {
//       return parseFloat(item.price) * quantity;
//     }

//     return 0;
//   };

//   const handleQuantityChange = (e, item) => {
//     const quantity = parseInt(e.target.value, 10);

//     setQuantitySold((prevQuantitySold) => ({
//       ...prevQuantitySold,
//       [item.name]: quantity,
//     }));

//     setSelectedProducts((prevSelectedProducts) => {
//       const existingProductIndex = prevSelectedProducts.findIndex((p) => p.name === item.name);

//       if (existingProductIndex !== -1) {
//         prevSelectedProducts[existingProductIndex] = { ...item, quantity };
//       } else {
//         prevSelectedProducts.push({ ...item, quantity });
//       }

//       return [...prevSelectedProducts];
//     });

//     if (item.name === customProductName) {
//       setQuantitySold((prevQuantitySold) => ({
//         ...prevQuantitySold,
//         [customProductName]: quantity,
//       }));
//     }
//   };

//   const handleCompleteTransaction = async () => {
//     try {
//       setIsLoading(true);
//       const successMessages = [];
//       const errorMessages = [];

//       const transactionsPromises = selectedProducts.map(async (selectedProduct) => {
//         const response = await fetch(`${baseUrl}/api/sales`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             product: {
//               name: selectedProduct.name,
//               price: selectedProduct.price,
//               quantity: quantitySold[selectedProduct.name] || 1,
//             },
//             quantitySold: quantitySold[selectedProduct.name],
//             totalAmount: calculateTotalAmount(selectedProduct),
//             timestamp: new Date().toISOString(),
//           }),
//         });

//         if (response.ok) {
//           successMessages.push('Transaction completed successfully.');
//         } else {
//           errorMessages.push('Transaction failed.');
//         }
//       });

//       if (customProductName && customProductPrice) {
//         const customProduct = {
//           name: customProductName,
//           price: parseFloat(customProductPrice),
//           quantity: quantitySold[customProductName] || 1,
//         };

//         const customProductResponse = await fetch(`${baseUrl}/api/sales`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             product: customProduct,
//             quantitySold: customProduct.quantity,
//             totalAmount: calculateTotalAmount(customProduct),
//             timestamp: new Date(),
//           }),
//         });

//         if (customProductResponse.ok) {
//           successMessages.push('Custom product added to the transaction.');
//         } else {
//           errorMessages.push('Failed to add custom product to the transaction.');
//         }
//       }

//       await Promise.all(transactionsPromises);

//       successMessages.forEach((message) => {
//         toast.success(message);
//       });

//       errorMessages.forEach((message) => {
//         toast.error(message);
//       });
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Error completing transactions.');
//     } finally {
//       setIsLoading(false);
//       setSelectedProducts([]);
//       setQuantitySold({});
//       setCustomProductName('');
//       setCustomProductPrice('');
//     }
//   };

//   return (
//     <div>
//       {isLoading ? (
//         <div>
//           <lottie-player src="https://lottie.host/109cd246-c7ed-423e-afdf-e66851833722/ksePca1mSt.json" background="##F2F2F2" speed="1" loop autoplay direction="1" mode="normal"></lottie-player>
//         </div>
//       ) : (
//         <div>
//           <div className=' m-5 mb-0 text-3xl flex justify-between'>
//             <h1 ><strong>Item List</strong></h1>
//           </div>

//           <div className="grid grid-cols-4 md:grid-cols-2 p-5 gap-2">
//             {products.map((item) => (
//               <div
//                 className="bg-blue-100 p-4 border rounded-md"
//                 key={item._id}
//                 style={{ borderRadius: '8px' }}
//               >
//                 <img
//                   src={`data:image/jpeg;base64,${item.base64Image}`}
//                   alt={item.name}
//                   style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
//                 />
//                 <h2 className="text-xl font-bold"> {item.name}</h2>
//                 <p>Price: {item.price}</p>

//                 <label className="block mt-2">
//                   Quantity:
//                   <input
//                     className="w-full rounded-md p-2 border"
//                     type="number"
//                     min="0"
//                     value={quantitySold[item.name] || ''}
//                     onChange={(e) => handleQuantityChange(e, item)}
//                   />
//                 </label>
//               </div>

//             ))}
//             <CustomProductInput
//               customProductName={customProductName}
//               setCustomProductName={setCustomProductName}
//               customProductPrice={customProductPrice}
//               setCustomProductPrice={setCustomProductPrice}
//               quantitySold={quantitySold}
//               setQuantitySold={setQuantitySold}
//             />
//           </div>

//           <div className="px-5 flex justify-center items-center mt-4">
//             <button className={'bg-teal-300 mb-5 rounded-md p-2 mr-2'} onClick={isLoading ? null : handleCompleteTransaction}
//               disabled={isLoading}>
//               {isLoading ? (
//                 <div className="h-7 w-7 border-2 border-t-blue-gray-900 rounded-full animate-spin mx-auto"></div>
//               ) : (
//                 'Add Income'
//               )}
//             </button>
//             <button className={'bg-teal-300 mb-5 rounded-md p-2'} onClick={isLoading ? null : handlePreviewBill}
//               disabled={isLoading}>
//               {isLoading ? (
//                 <div className="h-7 w-7 border-2 border-t-blue-gray-900 rounded-full animate-spin mx-auto"></div>
//               ) : (
//                 'Preview Bill'
//               )}
//             </button>
//             {showBillModal && (
//               <BillModal
//                 selectedProducts={selectedProducts}
//                 customProduct={{ name: customProductName, price: customProductPrice, quantity: quantitySold[customProductName] || 0 }}
//                 isOpen={showBillModal}
//                 onClose={handleCloseModal}
//                 onConfirm={handleConfirmAndSave}
//                 onPrint={handlePrintBill}
//               />
//             )}

//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SalesTransaction;

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { baseUrl } from './features/constant';
import BillModal from './BillModal';
import CustomProductInput from './CustomProductInput';

const SalesTransaction = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantitySold, setQuantitySold] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [showBillModal, setShowBillModal] = useState(false);
  const [customProducts, setCustomProducts] = useState([{ name: '', price: 0, quantity: 0 }]);

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePreviewBill = () => {
    setShowBillModal(true);
  };

  const handleCloseModal = () => {
    setShowBillModal(false);
  };

  const handlePrintBill = () => {
    const printableContent = document.querySelector('.printable-area').innerHTML;
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    printWindow.document.write(`<html><head><title>Print Bill</title><style>
      body { font-family: Arial, sans-serif; }
      .content { width: 100%; }
      </style></head><body><div class='content'>${printableContent}</div></body></html>`);
    printWindow.print();
  };

  const handleConfirmAndSave = async () => {
    setShowBillModal(false);
    try {
      handleCompleteTransaction();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error completing transactions.');
    }
  };

  const calculateTotalAmount = () => {
    let total = 0;

    // Calculate total amount for existing products
    selectedProducts.forEach((product) => {
      total += product.price * (quantitySold[product.name] || 0);
    });

    // Calculate total amount for custom products
    customProducts.forEach((product) => {
      const price = parseFloat(product.price) || 0;
      const quantity = parseInt(product.quantity, 10) || 0;
      total += price * quantity;
    });

    return total;
  };

  const handleQuantityChange = (e, item) => {
    const value = e.target.value;
    const quantity = value === '' ? 0 : parseInt(value, 10);

    setQuantitySold((prevQuantitySold) => ({
      ...prevQuantitySold,
      [item.name]: isNaN(quantity) ? 0 : quantity,
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
  };

  const handleCompleteTransaction = async () => {
    try {
      setIsLoading(true);
      const successMessages = [];
      const errorMessages = [];

      const filteredSelectedProducts = selectedProducts.filter(
        (product) => quantitySold[product.name] > 0
      );
      const filteredCustomProducts = customProducts.filter(
        (product) => product.quantity > 0 && product.name && product.price
      );

      if (filteredSelectedProducts.length === 0 && filteredCustomProducts.length === 0) {
        toast.error('Please fill out all required fields with valid values.');
        return;
      }

      const transactionsPromises = filteredSelectedProducts.map(async (selectedProduct) => {
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
            totalAmount: selectedProduct.price * (quantitySold[selectedProduct.name]),
            timestamp: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          successMessages.push('Transaction completed successfully.');
        } else {
          errorMessages.push('Transaction failed.');
        }
      });

      await Promise.all([
        ...transactionsPromises,
        ...filteredCustomProducts.map(async (customProduct) => {
          const response = await fetch(`${baseUrl}/api/sales`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              product: {
                name: customProduct.name,
                price: parseFloat(customProduct.price) || 0,
                quantity: parseInt(customProduct.quantity, 10) || 0,
              },
              quantitySold: parseInt(customProduct.quantity, 10) || 0,
              totalAmount: (parseFloat(customProduct.price) || 0) * (parseInt(customProduct.quantity, 10) || 0),
              timestamp: new Date().toISOString(),
            }),
          });

          if (response.ok) {
            successMessages.push(`Custom product "${customProduct.name}" added to the transaction.`);
          } else {
            errorMessages.push(`Failed to add custom product "${customProduct.name}" to the transaction.`);
          }
        }),
      ]);

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
      setCustomProducts([{ name: '', price: '0', quantity: '0' }]); // Reset custom products
    }
  };

  const handleAddCustomProductForm = () => {
    setCustomProducts((prevCustomProducts) => [...prevCustomProducts, { name: '', price: '', quantity: '' }]);
  };

  const handleRemoveCustomProductForm = (index) => {
    setCustomProducts((prevCustomProducts) => prevCustomProducts.filter((_, i) => i !== index));
  };

  return (
    <div>
      {isLoading ? (
        <div>
          <lottie-player src="https://lottie.host/109cd246-c7ed-423e-afdf-e66851833722/ksePca1mSt.json" background="##F2F2F2" speed="1" loop autoplay direction="1" mode="normal"></lottie-player>
        </div>
      ) : (
        <div>
          <div className='m-5 mb-0 text-3xl flex justify-between'>
            <h1><strong>Item List</strong></h1>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-2 sm:grid-cols-1 p-5 gap-2">
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

                <input
                  type="number"
                  className="mt-2 p-2 border rounded-md"
                  placeholder="Quantity"
                  value={quantitySold[item.name] || ''}
                  onChange={(e) => handleQuantityChange(e, item)}
                />
              </div>
            ))}
          </div>
          <div className='grid grid-cols-4 md:grid-cols-1 p-5 pt-0 gap-2'>
            {customProducts.map((customProduct, index) => (
              <CustomProductInput
                key={index}
                customProduct={customProduct}
                onChange={(updatedProduct) =>
                  setCustomProducts((prevCustomProducts) =>
                    prevCustomProducts.map((product, i) => (i === index ? updatedProduct : product))
                  )
                }
                onRemove={() => handleRemoveCustomProductForm(index)}
              />
            ))}
          </div>

          <div className="flex justify-center mb-4">
            <button className="flex items-center bg-teal-300 rounded-md p-2" onClick={handleAddCustomProductForm}>
              <span className="ml-2">Add Custom Product</span>
            </button>
          </div>

          <div className="px-5 flex justify-center items-center mt-4">
            <button className={'bg-teal-300 mb-5 rounded-md p-2 mr-2'} onClick={isLoading ? null : handleCompleteTransaction}
              disabled={isLoading}>
              {isLoading ? (
                <div className="h-7 w-7 border-2 border-t-blue-gray-900 rounded-full animate-spin mx-auto"></div>
              ) : (
                'Add Income'
              )}
            </button>
            <button className={'bg-teal-300 mb-5 rounded-md p-2'} onClick={isLoading ? null : handlePreviewBill}
              disabled={isLoading}>
              {isLoading ? (
                <div className="h-7 w-7 border-2 border-t-blue-gray-900 rounded-full animate-spin mx-auto"></div>
              ) : (
                'Preview Bill'
              )}
            </button>

            {showBillModal && (
              <BillModal
                selectedProducts={selectedProducts.filter((product) => quantitySold[product.name] > 0)}
                customProducts={customProducts.filter((product) => product.quantity > 0 && product.name && product.price)}
                isOpen={showBillModal}
                onClose={handleCloseModal}
                onConfirm={handleConfirmAndSave}
                onPrint={handlePrintBill}
                totalAmount={calculateTotalAmount()}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTransaction;
