// AddProduct.js
import React, { useState } from 'react';

const AddProduct = ({ onAddProduct }) => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const handleAddProduct = () => {
    const newProduct = {
      name: productName,
      price: parseFloat(productPrice),
    };

    onAddProduct(newProduct);
    // You can add additional validation or reset the form fields as needed
  };

  return (
    <div>
      <h2>Add Product</h2>
      <label>
        Name:
        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
      </label>
      <label>
        Price:
        <input type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
      </label>
      <button onClick={handleAddProduct}>Add Product</button>
    </div>
  );
};

export default AddProduct;
