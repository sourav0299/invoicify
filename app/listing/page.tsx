"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode";

interface Product {
  name: string;
  price: number;
  itemType: string;
  serviceCode: string;
  taxIncluded: boolean;
  tax: string;
  measuringUnit: string;
  totalPrice?: number;
  taxAmount?: number;
  qrCode?: string;
}

const Modal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [productList, setProductList] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product>({
    name: "",
    price: 0,
    itemType: "Product",
    serviceCode: "",
    taxIncluded: true,
    tax: "0",
    measuringUnit: "Pcs",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState<{ [K in keyof Product]?: string }>({});

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProduct({
      name: "",
      price: 0,
      itemType: "Product",
      serviceCode: "",
      taxIncluded: true,
      tax: "0",
      measuringUnit: "Pcs",
    });
    setErrors({});
  };

  const generateServiceCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setProduct((prevProduct) => ({ ...prevProduct, serviceCode: code }));
    setErrors((prevErrors) => ({ ...prevErrors, serviceCode: undefined }));
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

    if (!product.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (isNaN(product.price) || product.price <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (!product.serviceCode.trim()) {
      newErrors.serviceCode = "Service Code is required";
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
    const taxRate = parseFloat(product.tax) / 100;
    let totalPrice: number;
    let taxAmount: number;

    if (product.taxIncluded) {
      totalPrice = product.price;
      taxAmount = (product.price * taxRate) / (1 + taxRate);
    } else {
      taxAmount = product.price * taxRate;
      totalPrice = product.price + taxAmount;
    }

    const qrCode = await QRCode.toDataURL(JSON.stringify(product));

    const productToSave = {
      ...product,
      totalPrice,
      taxAmount,
      qrCode,
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
      console.log("Product saved:", savedProduct);

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
      console.error("Error fetching product list:", error);
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
        <h2 className="text-2xl font-bold mb-4">Product List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Item Type</th>
                <th className="py-2 px-4 border-b">Service Code</th>
                <th className="py-2 px-4 border-b">Tax</th>
                <th className="py-2 px-4 border-b">Measuring Unit</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-2 px-4 border-b">{product.name}</td>
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
                  <td className="py-2 px-4 border-b">{product.price}</td>
                  <td className="py-2 px-4 border-b">{product.itemType}</td>
                  <td className="py-2 px-4 border-b">{product.serviceCode}</td>
                  <td className="py-2 px-4 border-b">{product.tax}%</td>
                  <td className="py-2 px-4 border-b">
                    {product.measuringUnit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
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
                      Create New Product
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Fill in the details below to create a new product.
                      </p>
                    </div>
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
                        id="name"
                        name="name"
                        value={product.name}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full border ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm sm:text-sm`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.name}
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
                          id="serviceCode"
                          name="serviceCode"
                          value={product.serviceCode}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full border ${
                            errors.serviceCode
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
                      {errors.serviceCode && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.serviceCode}
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
                          id="price"
                          name="price"
                          value={product.price}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full border ${
                            errors.price ? "border-red-500" : "border-gray-300"
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
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.price}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="tax"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Tax:
                      </label>
                      <select
                        id="tax"
                        name="tax"
                        value={product.tax}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                      >
                        <option value="0">No Tax</option>
                        <option value="5">5%</option>
                        <option value="10">10%</option>
                        <option value="15">15%</option>
                        <option value="20">20%</option>
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
              </div>
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
                        <li>Name: {product.name}</li>
                        <li>Price: {product.price}</li>
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
