import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AddProduct from './AddProduct';
import { baseUrl } from './features/constant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const Products = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedProductName, setEditedProductName] = useState('');
  const [editedProductPrice, setEditedProductPrice] = useState('');

  const fetchProducts = async () => {
    try {
      setIsLoading(true);   // Set loading state to true when starting the fetch
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
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductAdded = () => {
    fetchProducts();
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditedProductName(product.name);
    setEditedProductPrice(product.price);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseUrl}/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedProductName,
          price: editedProductPrice,
        }),
      });

      if (response.ok) {
        toast.success('Product updated successfully');
        fetchProducts();
        setEditingProduct(null);
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product');
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
          <div className='m-5 mb-0 text-3xl flex justify-between'>
            <h1><strong>All Products</strong></h1>
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
                {editingProduct && editingProduct._id === item._id ? (
                  <div className="mt-4 p-4  rounded">
                    <h2 className="text-xl font-bold mb-2">Edit Product</h2>
                    <form onSubmit={handleEditSubmit}>
                      <div className="mb-4">
                        <label htmlFor="editName" className="block text-sm font-medium ">
                          Name:
                        </label>
                        <input
                          type="text"
                          id="editName"
                          value={editedProductName}
                          onChange={(e) => setEditedProductName(e.target.value)}
                          className="mt-1 p-2 border rounded-md w-full"
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="editPrice" className="block text-sm font-medium ">
                          Price:
                        </label>
                        <input
                          type="number"
                          id="editPrice"
                          value={editedProductPrice}
                          onChange={(e) => setEditedProductPrice(e.target.value)}
                          className="mt-1 p-2 border rounded-md w-full"
                        />
                      </div>
                      <div className="flex justify-between">
                        <button
                          type="submit"
                          className="bg-green-500 text-white px-4 py-2 rounded-md focus:outline-none"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="bg-red-500 text-white px-4 py-2 rounded-md focus:outline-none"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="flex flex-col mt-2">
                    <h2 className="text-xl font-bold">{item.name}</h2>
                    <p>Price: {item.price}</p>
                    <button
                      onClick={() => handleEditClick(item)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none mt-2"
                    >
                      <FontAwesomeIcon icon={faPen} className="mr-2" />
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div
              className="bg-blue-100 p-4 border rounded-md"
              style={{ borderRadius: '8px' }}
            >
              <h2 className="text-xl font-bold">Add Product</h2>
              <AddProduct onProductAdded={handleProductAdded} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
