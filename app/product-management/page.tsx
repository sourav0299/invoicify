"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { useUser } from "@clerk/nextjs";
import "../globals.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

interface CaretIconProps {
  isOpen: boolean;
}

const AllItemsIcon = () => (
  <svg
    width="56"
    height="56"
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="28" cy="28" r="28" fill="#DDEBFF" />
    <path
      d="M18.674 26.9208V28L28.0038 33.389L37.3337 28V26.9208M18.667 33.5318V34.611L27.9968 40L37.3267 34.611V33.5318M28.0038 16L18.674 21.389L28.0038 26.778L37.3337 21.389L28.0038 16Z"
      stroke="#3A8BFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InStockIcon = () => (
  <svg
    width="57"
    height="56"
    viewBox="0 0 57 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="28.5" cy="28" r="28" fill="#D3FFE2" />
    <path
      d="M19.5 27.8893L25.7987 34L38.1667 22"
      stroke="#1EB386"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LowStockIcon = () => (
  <svg
    width="56"
    height="56"
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="28" cy="28" r="28" fill="#FFEFCD" />
    <rect width="32" height="32" transform="translate(12 12)" fill="#FFEFCD" />
    <path
      d="M28 29V24M28 32H28.01M37 28C37 32.9706 32.9706 37 28 37C23.0294 37 19 32.9706 19 28C19 23.0294 23.0294 19 28 19C32.9706 19 37 23.0294 37 28Z"
      stroke="#D98F07"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const OutOfStockIcon = () => (
  <svg
    width="57"
    height="56"
    viewBox="0 0 57 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="28.5" cy="28" r="28" fill="#FEE0E0" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M36.0947 20.3327C36.5421 20.7779 36.544 21.5015 36.0988 21.949L30.1122 27.9656L36.1673 34.051C36.6125 34.4985 36.6107 35.2221 36.1633 35.6673C35.7158 36.1125 34.9922 36.1107 34.547 35.6632L28.5 29.5859L22.453 35.6632C22.0078 36.1107 21.2842 36.1125 20.8368 35.6673C20.3893 35.2221 20.3875 34.4985 20.8327 34.051L26.8878 27.9656L20.9013 21.949C20.4561 21.5015 20.4579 20.7779 20.9053 20.3327C21.3527 19.8875 22.0764 19.8893 22.5216 20.3368L28.5 26.3452L34.4785 20.3368C34.9237 19.8893 35.6473 19.8875 36.0947 20.3327Z"
      fill="#E30000"
      stroke="#E30000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 21L17.5 17.5M17 10C17 10.9193 16.8189 11.8295 16.4672 12.6788C16.1154 13.5281 15.5998 14.2997 14.9497 14.9497C14.2997 15.5998 13.5281 16.1154 12.6788 16.4672C11.8295 16.8189 10.9193 17 10 17C9.08075 17 8.1705 16.8189 7.32122 16.4672C6.47194 16.1154 5.70026 15.5998 5.05025 14.9497C4.40024 14.2997 3.88463 13.5281 3.53284 12.6788C3.18106 11.8295 3 10.9193 3 10C3 8.14348 3.7375 6.36301 5.05025 5.05025C6.36301 3.7375 8.14348 3 10 3C11.8565 3 13.637 3.7375 14.9497 5.05025C16.2625 6.36301 17 8.14348 17 10Z"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const CaretIcon: React.FC<CaretIconProps> = ({ isOpen }) => (
  <svg
    className={`w-4 h-4 ml-2 transition-transform ${
      isOpen ? "rotate-180" : ""
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

type CustomTooltipProps = {
  anchorId: string;
  content: React.ReactNode;
};

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
  const [showModal, setShowModal] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Select Categories");

  const categories = ["Product", "Services"];

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

  const handleDownloadQr = (product: Product) => {
    if (product.qrCode) {
      const link = document.createElement("a");
      link.href = product.qrCode;
      link.download = `qr-code-${product.itemName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
    <div className="flex flex-col gap-3 pt-3 px-6 bg-universal_gray_background">
      <div className="flex flex-col items-start">
        <div className="text-[28px] font-semibold text-business_settings_black_text">
          Product List
        </div>
        <div className="text-business_settings_gray_text">
          An Overview of all your transaction over the year.
        </div>
      </div>
      <div className="flex gap-6">
        <div className="w-full bg-white flex shadow rounded px-4 py-6 items-center gap-3">
          <div className="">
            <AllItemsIcon />
          </div>
          <div className="gap-2">
            <div className="text-4xl font-bold text-business_settings_black_text">
              {productList.length < 10
                ? `0${productList.length}`
                : productList.length}
            </div>
            <div className="text-xl font-bold text-business_settings_gray_text">
              All Items
            </div>
          </div>
        </div>
        <div className="w-full bg-white flex shadow rounded px-4 py-6 items-center gap-3">
          <div className="">
            <InStockIcon />
          </div>
          <div className="gap-2">
            <div className="text-4xl font-bold text-business_settings_black_text">
              3843
            </div>
            <div className="text-xl font-bold text-business_settings_gray_text">
              In Stock
            </div>
          </div>
        </div>
        <div className="w-full bg-white flex shadow rounded px-4 py-6 items-center gap-3">
          <div className="">
            <LowStockIcon />
          </div>
          <div className="gap-2">
            <div className="text-4xl font-bold text-business_settings_black_text">
              3843
            </div>
            <div className="text-xl font-bold text-business_settings_gray_text">
              Low Stock
            </div>
          </div>
        </div>
        <div className="w-full bg-white flex shadow rounded px-4 py-6 items-center gap-3">
          <div className="">
            <OutOfStockIcon />
          </div>
          <div className="gap-2">
            <div className="text-4xl font-bold text-business_settings_black_text">
              3843
            </div>
            <div className="text-xl font-bold text-business_settings_gray_text">
              Out of Stock
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="border rounded-lg bg-white py-4 px-5 w-full">
          <div className="flex items-center justify-start gap-3 relative">
            <span
              className={`absolute top-1/2 transform -translate-y-1/2 transition-transform duration-[2000ms] ease-in-out ${
                isFocused ? "translate-x-[480px]" : "translate-x-0"
              } text-business_settings_black_text font-bold`}
              style={{ left: "0.5rem" }}
            >
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search Items"
              className="w-full outline-none text-business_settings_black_text font-bold pl-10"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
        </div>
        <div className="relative border rounded-lg bg-white text-business_settings_black_text font-semibold py-4 px-5 w-full item-start max-w-[339px]">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div>{selectedCategory}</div>
            <CaretIcon isOpen={isDropdownOpen} />
          </div>
          {isDropdownOpen && (
            <ul className="absolute z-10 w-full left-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              {categories.map((category, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsDropdownOpen(false);
                  }}
                >
                  {category}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          className="border rounded-lg py-4 px-5 w-full items-start max-w-[287px] text-semibold bg-sidebar_green_button_background text-white"
          onClick={() => setShowModal(true)}
        >
          <div className="">+Add New Item/Product/Service</div>
        </button>
      </div>
      <div className="border-[0.5px]">
        <div className="overflow-x-auto">
          <table className="w-full bg-universal_gray_background">
            <thead>
              <tr className="">
                <th className="py-6 px-4 border-b text-left">Product Code</th>
                <th className="py-6 px-4 border-b text-left">Name</th>
                <th className="py-6 px-4 border-b text-left">Type</th>
                <th className="py-6 px-4 border-b text-left">Category</th>
                <th className="py-6 px-4 border-b text-left">Unit</th>
                <th className="py-6 px-4 border-b text-left">Sales Price</th>
                <th className="py-6 px-4 border-b text-left">Tax</th>
                <th className="py-6 px-4 border-b text-left">
                  After Tax Price
                </th>
                <th className="py-6 px-4 border-b text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product, index) => (
                <tr key={index} className="bg-white">
                  <td className="py-2 px-4 border-b">{product.itemCode}</td>
                  <td className="py-2 px-4 border-b">{product.itemName}</td>
                  <td className="py-2 px-4 border-b">{product.itemType}</td>
                  <td className="py-2 px-4 border-b">{product.itemType}</td>
                  <td className="py-2 px-4 border-b">
                    {product.measuringUnit}
                  </td>
                  <td className="py-2 px-4 border-b">{product.salesPrice}</td>
                  <td className="py-2 px-4 border-b">{product.taxRate}%</td>
                  <td className="py-2 px-4 border-b">
                    {Number(product.totalPrice).toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      id={`button-${product._id}`}
                      className="py-2 px-3 text-sm rounded border border-download_purple_text text-download_purple_text bg-download_purple_button"
                      onClick={() => handleDownloadQr(product)}
                      data-tooltip-id={`tooltip-${product._id}`}
                    >
                      Download QR
                    </button>
                    <Tooltip
                      id={`tooltip-${product._id}`}
                      place="top"
                      render={() => (
                        <img
                          src={product.qrCode}
                          alt="QR Code"
                          style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "8px",
                          }}
                        />
                      )}
                    />
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
            <form onSubmit={handleSubmit}>
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <div className="w-[849px] h-[570px] mt-24 p-6 gap-6 flex flex-col items-center bg-white rounded-lg shadow-xl transform transition-all">
                <div className="flex items-center justify-between w-full">
                  <div className="text-xl font-semibold">Add New Item</div>
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
                <div className="flex flex-col rounded-lg p-3 border-[0.5px] border-sidebar_gray_border w-full h-auto gap-3">
                  <div className="flex gap-3">
                    <div className="p-5 bg-universal_gray_background rounded-lg text-start">
                      <div className="text-sidebar_black_text text-xs">
                        Item Type
                      </div>
                      <div className="flex gap-10">
                        <label className="flex items-center gap-3">
                          <span className="text-sm py-3 text-semibold">
                            Product
                          </span>
                          <input
                            type="radio"
                            name="itemType"
                            value="Product"
                            checked={product.itemType === "Product"}
                            onChange={handleInputChange}
                            className="custom-radio h-4 w-4"
                          />
                        </label>
                        <label className="flex items-center gap-3">
                          <span className="py-3 text-sm text-semibold">
                            Service
                          </span>
                          <input
                            type="radio"
                            name="itemType"
                            value="Service"
                            checked={product.itemType === "Service"}
                            onChange={handleInputChange}
                            className="custom-radio h-4 w-4 "
                          />
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                      <div className="bg-transparent w-full text-xs text-sidebar_black_text text-start">
                        Category
                      </div>
                      <div className="flex gap-2">
                        <div className="relative w-full">
                          <select
                            name="category"
                            value={product.itemType}
                            onChange={handleInputChange}
                            className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1 appearance-none"
                          >
                            <option value="">Select a category</option>
                            <option value="category1">Product</option>
                            <option value="category2">Service</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <CaretIcon isOpen={isDropdownOpen} />
                          </div>
                        </div>
                        <button className="w-full max-w-[176px] border bg-change_password_green_background border-sidebar_green_button_background text-sidebar_green_button_background rounded text-sm font-semibold">
                          Create New Category
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                      <div className="bg-transparent w-full text-xs text-sidebar_black_text text-start">
                        Item Name
                      </div>
                      <input
                        type="text"
                        className={`bg-transparent border ${
                          errors.itemName
                            ? "border-red-500"
                            : "border-business_settings_gray_border"
                        } border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1`}
                        name="itemName"
                        value={product.itemName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                      <div className="bg-transparent w-full text-xs text-sidebar_black_text text-start">
                        Item Code
                      </div>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                          id="itemCode"
                          name="itemCode"
                          value={product.itemCode}
                          onChange={handleInputChange}
                        />
                        <button
                          onClick={generateServiceCode}
                          className="w-full max-w-[116px] border bg-change_password_green_background border-sidebar_green_button_background text-sidebar_green_button_background rounded text-sm font-semibold"
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                      <div className="bg-transparent w-full text-xs text-sidebar_black_text text-start">
                        Opening Stock
                      </div>
                      <div className="flex gap-3">
                        <input
                          type="number"
                          name="inventory"
                          value={product.inventory}
                          onChange={handleInputChange}
                          className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <div className="w-full max-w-[130px] rounded bg-unit_gray_button_background text-sm flex items-center justify-center text-semibold">
                          {product.measuringUnit || "Pcs"}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                      <div className="bg-transparent w-full text-xs text-sidebar_black_text text-start">
                        Measuring Unit
                      </div>
                      <div className="relative w-full">
                        <select
                          id="measuringUnit"
                          name="measuringUnit"
                          value={product.measuringUnit}
                          onChange={handleInputChange}
                          className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1 appearance-none"
                        >
                          <option value="Pcs">Pcs</option>
                          <option value="Pair">Pair</option>
                          <option value="Dozen">Dozen</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <CaretIcon isOpen={false} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                      <div className="bg-transparent w-full text-xs text-sidebar_black_text text-start">
                        Sales Price
                      </div>
                      <div className="flex gap-3">
                        <div className="relative w-full">
                          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sidebar_black_text font-semibold">
                            ₹
                          </span>
                          <input
                            type="number"
                            id="salesPrice"
                            name="salesPrice"
                            value={product.salesPrice}
                            onChange={handleInputChange}
                            className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none pl-6 pr-2 font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                        <div className="w-full max-w-[130px] rounded bg-unit_gray_button_background text-sm flex items-center justify-center font-semibold gap-2">
                          GST Included
                          <input
                            type="checkbox"
                            name="taxIncluded"
                            checked={product.taxIncluded}
                            onChange={handleCheckboxChange}
                            className="appearance-none h-4 w-4 border border-sidebar_green_button_background rounded-sm bg-white checked:bg-white focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left cursor-pointer"
                            style={{
                              backgroundImage: product.taxIncluded
                                ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%231EB386' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`
                                : "none",
                              backgroundSize: "100% 100%",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                      <div className="bg-transparent w-full text-xs text-sidebar_black_text text-start">
                        Tax Rate
                      </div>
                      <div className="relative w-full">
                        <select
                          id="taxRate"
                          name="taxRate"
                          value={product.taxRate}
                          onChange={handleInputChange}
                          className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1 appearance-none"
                        >
                          <option value={0}>No Tax</option>
                          <option value={5}>5%</option>
                          <option value={12}>12%</option>
                          <option value={18}>18%</option>
                          <option value={28}>28%</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <CaretIcon isOpen={false} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={handleCloseModal}
                      className="bg-universal_white_background px-4 h-10 py-[10px] border flex items-center justify-center rounded-lg w-full max-w-[190px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-sidebar_green_button_background h-10 text-universal_white_background px-4 py-[10px] flex items-center justify-center rounded-lg w-full max-w-[190px] focus:outline-none">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </form>
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
