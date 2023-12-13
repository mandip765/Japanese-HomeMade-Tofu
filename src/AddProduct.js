import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { baseUrl } from './features/constant';

const AddProduct = ({ onProductAdded }) => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
  };

  const handleAddProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('name', productName);
      formData.append('price', parseFloat(productPrice));
      formData.append('image', productImage);

      const response = await fetch(`${baseUrl}/api/products`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newProduct = await response.json();
        toast.success('Product added successfully.');
        onProductAdded(newProduct);
      } else {
        toast.error('Failed to add product.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error adding product.');
    }
  };


  return (
    <div>
      <div>
        <label>Product Name:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      <div>
        <label>Product Price:</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />
      </div>
      <div>
        <label>Product Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <div className='flex justify-center items-center'>
        <button onClick={handleAddProduct} className='bg-light-green-300 mt-2 rounded'>
          Add Product
        </button>
      </div>

    </div>
  );
};

export default AddProduct;
