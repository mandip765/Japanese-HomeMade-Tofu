// import React, { useState } from 'react';
// import { toast } from 'react-toastify';
// import { baseUrl } from './features/constant';

// const AddProduct = ({ onProductAdded }) => {
//   const [productName, setProductName] = useState('');
//   const [productPrice, setProductPrice] = useState('');
//   const [productImage, setProductImage] = useState(null);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setProductImage(file);
//   };

//   const handleAddProduct = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('name', productName);
//       formData.append('price', parseFloat(productPrice));
//       formData.append('image', productImage);

//       const response = await fetch(`${baseUrl}/api/products`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         const newProduct = await response.json();
//         toast.success('Product added successfully.');
//         onProductAdded(newProduct);
//       } else {
//         toast.error('Failed to add product.');
//       }
//     } catch (error) {
//       console.error('Error adding product:', error);
//       toast.error('Error adding product.');
//     }
//   };


//   return (
//     <div>
//       <div>
//         <label>Product Name:</label>
//         <input
//           type="text"
//           value={productName}
//           onChange={(e) => setProductName(e.target.value)}
//         />
//       </div>
//       <div>
//         <label>Product Price:</label>
//         <input
//           type="number"
//           min="0"
//           step="0.01"
//           value={productPrice}
//           onChange={(e) => setProductPrice(e.target.value)}
//         />
//       </div>
//       <div>
//         <label>Product Image:</label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//         />
//       </div>
//       <div className='flex justify-center items-center'>
//         <button onClick={handleAddProduct} className='bg-cyan-500 mt-2 p-1 rounded'>
//           Add Product
//         </button>
//       </div>

//     </div>
//   );
// };

// export default AddProduct;



import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { baseUrl } from './features/constant';

const AddProduct = ({ onProductAdded }) => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState(null);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!productName || !productPrice || !productImage) {
      toast.error('Please fill in all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', productPrice);
    formData.append('image', productImage);

    try {
      const response = await fetch(`${baseUrl}/api/products`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Product added successfully');
        setProductName('');
        setProductPrice('');
        setProductImage(null);
        onProductAdded();
      } else {
        toast.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error adding product');
    }
  };

  return (
    <form onSubmit={handleAddProduct} className="mt-4">
      <div className="mb-4">
        <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
          Product Name:
        </label>
        <input
          type="text"
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">
          Product Price:
        </label>
        <input
          type="number"
          id="productPrice"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="productImage" className="block text-sm font-medium text-gray-700">
          Product Image:
        </label>
        <input
          type="file"
          id="productImage"
          accept="image/*"
          onChange={(e) => setProductImage(e.target.files[0])}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded-md w-full focus:outline-none"
      >
        Add Product
      </button>
    </form>
  );
};

export default AddProduct;
