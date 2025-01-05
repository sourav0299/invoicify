"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { useUser } from "@clerk/nextjs";

interface Product {
  _id?: string;
  userEmail: string;
  itemName: string;
  itemType: string;
  itemCode: string;
  inventory: number;
  measuringUnit: string;
  salesPrice: number;
  taxIncluded: boolean;
  taxRate: number;
  totalPrice?: number;
  taxAmount?: number;
  qrCode?: string;
}

const Modal: React.FC = () => {
  const { user } = useUser();
  const [showModal, setShowModal] = useState(true);
  const [productList, setProductList] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product>({
    userEmail: user?.primaryEmailAddress?.emailAddress || "",
    itemName: "",
    itemType: "Product",
    itemCode: "",
    inventory: 0,
    measuringUnit: "Pcs",
    salesPrice: 0,
    taxIncluded: true,
    taxRate: 0,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState<{ [K in keyof Product]?: string }>({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        const response = await fetch(`/api/products/${productToDelete._id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete product");
        }

        console.log("Product deleted successfully");
        setShowDeleteConfirmation(false);
        fetchProductList();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setProductToDelete(null);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProduct({
      userEmail: user?.primaryEmailAddress?.emailAddress || "",
      itemName: "",
      itemType: "Product",
      itemCode: "",
      inventory: 0,
      measuringUnit: "Pcs",
      salesPrice: 0,
      taxIncluded: true,
      taxRate: 0,
    });
    setErrors({});
  };

  const generateServiceCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setProduct((prevProduct) => ({ ...prevProduct, itemCode: code }));
    setErrors((prevErrors) => ({ ...prevErrors, itemCode: undefined }));
  };

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: checked }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [K in keyof Product]?: string } = {};

    if (!product.itemName.trim()) {
      newErrors.itemName = "Item Name is required";
    }

    if (isNaN(product.salesPrice) || product.salesPrice <= 0) {
      newErrors.salesPrice = "Price must be a positive number";
    }

    if (!product.itemCode.trim()) {
      newErrors.itemCode = "Service Code is required";
    }

    setErrors(newErrors);
    console.log("Validation errors:", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      console.log("Form is valid, showing confirmation dialog");
      setShowConfirmation(true);
    } else {
      console.log("Form is invalid, not showing confirmation dialog");
    }
  };

  const handleConfirm = async () => {
    const taxRate = product.taxRate / 100;
    let totalPrice: number;
    let taxAmount: number;

    if (product.taxIncluded) {
      totalPrice = product.salesPrice;
      taxAmount = (product.salesPrice * taxRate) / (1 + taxRate);
    } else {
      totalPrice = product.salesPrice * (1 + taxRate);
      taxAmount = totalPrice * taxRate;
    }

    const qrCode = await QRCode.toDataURL(JSON.stringify(product));

    const productToSave = {
      ...product,
      totalPrice,
      taxAmount,
      qrCode,
      userEmail: user?.primaryEmailAddress?.emailAddress || "",
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productToSave),
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      const savedProduct = await response.json();

      setShowConfirmation(false);
      handleCloseModal();
      fetchProductList();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const fetchProductList = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      const products = await response.json();
      setProductList(products);
    } catch (error) {
      setProductList([]);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded sm:w-auto"
        onClick={handleOpenModal}
      >
        Create +
      </button>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Items List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Item Name</th>
                <th className="py-2 px-4 border-b">QR</th>
                <th className="py-2 px-4 border-b">Sales Price</th>
                <th className="py-2 px-4 border-b">Item Type</th>
                <th className="py-2 px-4 border-b">Item Code</th>
                <th className="py-2 px-4 border-b">Tax Rate</th>
                <th className="py-2 px-4 border-b">Measuring Unit</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-2 px-4 border-b">{product.itemName}</td>
                  <td className="py-2 px-4 border-b">
                    {product.qrCode && (
                      <img
                        src={product.qrCode}
                        alt="QR Code"
                        width="150"
                        height="150"
                        className="mx-auto"
                      />
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">{product.salesPrice}</td>
                  <td className="py-2 px-4 border-b">{product.itemType}</td>
                  <td className="py-2 px-4 border-b">{product.itemCode}</td>
                  <td className="py-2 px-4 border-b">{product.taxRate}%</td>
                  <td className="py-2 px-4 border-b">
                    {product.measuringUnit}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showDeleteConfirmation && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen px-4 py-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Confirm Product Deletion
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the following product?
                      </p>
                      {productToDelete && (
                        <ul className="mt-2 list-disc">
                          <li>Name: {productToDelete.itemName}</li>
                          <li>Price: {productToDelete.salesPrice}</li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="flex items-end justify-center min-h-screen px-4 py-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="w-[849px] h-[570px] mt-24 p-6 gap-6 flex flex-col items-center bg-white rounded-lg shadow-xl transform transition-all">
              <div className="flex items-center justify-between w-full">
                <div className="">Create Product</div>
                <button className="" onClick={() => setShowModal(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17.696 6.24954C18.0316 6.58343 18.033 7.12614 17.6991 7.46172L13.2092 11.9742L17.7505 16.5383C18.0844 16.8739 18.083 17.4166 17.7474 17.7505C17.4119 18.0844 16.8692 18.083 16.5353 17.7474L12 13.1894L7.46475 17.7474C7.13086 18.083 6.58814 18.0844 6.25257 17.7505C5.917 17.4166 5.91564 16.8739 6.24954 16.5383L10.7908 11.9742L6.30095 7.46172C5.96705 7.12615 5.96841 6.58344 6.30398 6.24954C6.63956 5.91564 7.18227 5.917 7.51616 6.25258L12 10.7589L16.4838 6.25257C16.8177 5.917 17.3605 5.91564 17.696 6.24954Z"
                      fill="#111928"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col rounded-lg p-3 border-[0.5px] border-sidebar_gray_border w-full h-auto">
                <div className="flex gap-3">
                  <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                  <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                    First Name
                  </div>
                  <input
                    type="text"
                    className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                  />
                </div>
                <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                  <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                    First Name
                  </div>
                  <input
                    type="text"
                    className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                  />
                </div>
                </div>
                <div className="">
                  
                </div>
              </div>
              
              {/* <div className="bg-white w-[849px] h-[570px]">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Create New Product
                    </h3>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 sm:px-6">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label
                        htmlFor="itemType"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Item Type
                      </label>
                      <select
                        id="itemType"
                        name="itemType"
                        value={product.itemType}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                      >
                        <option value="Product">Product</option>
                        <option value="Services">Services</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name:
                      </label>
                      <input
                        type="text"
                        id="itemName"
                        name="itemName"
                        value={product.itemName}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full border ${
                          errors.itemName ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm sm:text-sm`}
                      />
                      {errors.itemName && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.itemName}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="serviceCode"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Service Code
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          id="itemCode"
                          name="itemCode"
                          value={product.itemCode}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full border ${
                            errors.itemCode
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm sm:text-sm`}
                        />
                        <button
                          type="button"
                          onClick={generateServiceCode}
                          className="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Generate
                        </button>
                      </div>
                      {errors.itemCode && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.itemCode}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Sales Price
                      </label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          id="salesPrice"
                          name="salesPrice"
                          value={product.salesPrice}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full border ${
                            errors.salesPrice ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm sm:text-sm`}
                        />
                        <div className="ml-2">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              name="taxIncluded"
                              checked={product.taxIncluded}
                              onChange={handleCheckboxChange}
                              className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Tax Included
                            </span>
                          </label>
                        </div>
                      </div>
                      {errors.salesPrice && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.salesPrice}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="taxRate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Tax:
                      </label>
                      <select
                        id="taxRate"
                        name="taxRate"
                        value={product.taxRate}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                      >
                        <option value={0}>No Tax</option>
                        <option value={5}>5%</option>
                        <option value={12}>12%</option>
                        <option value={18}>18%</option>
                        <option value={28}>28%</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="measuringUnit"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Measuring Unit
                      </label>
                      <select
                        id="measuringUnit"
                        name="measuringUnit"
                        value={product.measuringUnit}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                      >
                        <option value="Pcs">Pcs</option>
                        <option value="Pair">Pair</option>
                        <option value="Dozen">Dozen</option>
                      </select>
                    </div>
                    <div className="mt-4">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </div>
                <div className="mt-5 sm:mt-6 sm:text-right">
                  <button
                    type="button"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 sm:w-auto"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen px-4 py-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Confirm Product Creation
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to create the following product?
                      </p>
                      <ul className="mt-2 list-disc">
                        <li>Name: {product.itemName}</li>
                        <li>Price: {product.salesPrice}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:py-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={handleConfirm}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
