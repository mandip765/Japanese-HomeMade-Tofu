import React from 'react';

const CustomProductInput = ({ customProduct, onChange, onRemove }) => {
  const handleNameChange = (e) => {
    onChange({ ...customProduct, name: e.target.value });
  };

  const handlePriceChange = (e) => {
    onChange({ ...customProduct, price: e.target.value });
  };

  const handleQuantityChange = (e) => {
    onChange({ ...customProduct, quantity: e.target.value });
  };

  return (
    <div className="bg-blue-100 p-4 border rounded-md" style={{ borderRadius: '8px' }}>
      <h2 className="text-xl mb-4 font-bold">Custom Product</h2>
      <div className="mb-4">
        <label className="block mb-1">Product Name:</label>
        <input
          className="w-full rounded-md p-2 border"
          type="text"
          value={customProduct.name}
          onChange={handleNameChange}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Product Price:</label>
        <input
          className="w-full rounded-md p-2 border"
          type="number"
          min="0"
          value={customProduct.price}
          onChange={handlePriceChange}
        />
      </div>
      <div>
        <label className="block mb-1">Quantity:</label>
        <input
          className="w-full rounded-md p-2 border"
          type="number"
          min="0"
          value={customProduct.quantity}
          onChange={handleQuantityChange}
        />
      </div>
      <button className="mt-4 bg-red-400 text-white px-4 py-2 rounded-md" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
};

export default CustomProductInput;
