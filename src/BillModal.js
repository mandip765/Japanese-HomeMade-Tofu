import React from 'react';
import './BillModal.css'; // Assuming CSS is externalized

const BillModal = ({ selectedProducts, customProduct, isOpen, onClose, onPrint, onConfirm }) => {
  if (!isOpen) return null; // Modal does not render when it's not open

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
    <div className="bill-preview">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="printable-area">
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
