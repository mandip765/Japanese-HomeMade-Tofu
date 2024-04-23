import React from 'react'
const BillModal = ({ selectedProducts, customProduct, isOpen, onClose, onPrint, onConfirm }) => {

  const calculateTotalBill = () => {
    let total = 0;
    selectedProducts.forEach(product => {
      total += parseFloat(product.price) * product.quantity;
    });
    if (customProduct && customProduct.price) {
      total += parseFloat(customProduct.price) * customProduct.quantity;
    }
    return total.toFixed(2);
  };

  return (
    <div className='bill-preview'>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <div className='printable-area'>
            <h3>Bill Summary</h3>
            {selectedProducts.map((product) => (
              <div key={product.name}>
                {product.name} - Rs.{parseFloat(product.price).toFixed(2)} x {product.quantity} = Rs.{(parseFloat(product.price) * product.quantity).toFixed(2)}
              </div>
            ))}
            {customProduct && customProduct.name && (
              <div>
                {customProduct.name} - Rs.{parseFloat(customProduct.price).toFixed(2)} x {customProduct.quantity} = Rs.{(parseFloat(customProduct.price) * customProduct.quantity).toFixed(2)}
              </div>
            )}
            <h4>Total: Rs.{calculateTotalBill()}</h4>
          </div>
          <div className='button-area'>
            <div className="mt-4">
              <button className="bg-red-900 text-white px-4 py-2 rounded mr-2"
                onClick={onPrint}>Print Bill</button>
              <button className="bg-teal-300 px-4 py-2 rounded"
                onClick={onConfirm}>Confirm and Save</button>
              <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
                onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default BillModal
