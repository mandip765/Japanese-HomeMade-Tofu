import React from 'react';
import './BillModal.css'; // Assuming CSS is externalized

const BillModal = ({ selectedProducts, customProducts, isOpen, onClose, onPrint, onConfirm }) => {
  if (!isOpen) return null; // Modal does not render when it's not open
  console.log("Custom Product in BillModal:", customProducts); // Log customProduct data

  const calculateTotalBill = () => {
    let total = 0;
    selectedProducts.forEach(product => {
      total += parseFloat(product.price) * product.quantity;
    });
    if (customProducts) {
      customProducts.forEach(product => {
        total += parseFloat(product.price) * (product.quantity || 0);
      });
    }

    return total.toFixed();
  };

  return (
    <div className="bill-preview">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="printable-area">
            <h3>Bill Summary</h3>
            {selectedProducts.map((product) => (
              <div key={product.name}>
                {product.name} - Rs.{parseFloat(product.price).toFixed()} x {product.quantity} = Rs.{(parseFloat(product.price) * product.quantity).toFixed()}
              </div>
            ))}
            {customProducts && customProducts.map(product => (
              <div key={product.name}>
                {product.name} - Rs.{parseFloat(product.price).toFixed()} x {product.quantity || 0} = Rs.{(parseFloat(product.price) * (product.quantity || 0)).toFixed()}
              </div>
            ))}
            <h4>Total: Rs.{calculateTotalBill()}</h4>
          </div>
          <div className="button-area">
            <button className="print-button" onClick={onPrint}>Print Bill</button>
            <button className="confirm-button" onClick={onConfirm}>Confirm and Save</button>
            <button className="close-button" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillModal;
