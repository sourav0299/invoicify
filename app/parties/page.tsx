"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { useUser } from "@clerk/nextjs"
import "../globals.css"
import "react-tooltip/dist/react-tooltip.css"
import { Search, ChevronDown, ChevronRight, Trash2 } from "lucide-react"
// import { useUserCheck } from "@/helper/useUserCheck"

interface CaretIconProps {
  isOpen: boolean
}

const AllItemsIcon = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="28" cy="28" r="28" fill="#DDEBFF" />
    <path
      d="M18.674 26.9208V28L28.0038 33.389L37.3337 28V26.9208M18.667 33.5318V34.611L27.9968 40L37.3267 34.611V33.5318M28.0038 16L18.674 21.389L28.0038 26.778L37.3337 21.389L28.0038 16Z"
      stroke="#3A8BFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const InStockIcon = () => (
  <svg width="57" height="56" viewBox="0 0 57 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="28.5" cy="28" r="28" fill="#D3FFE2" />
    <path
      d="M19.5 27.8893L25.7987 34L38.1667 22"
      stroke="#1EB386"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const LowStockIcon = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
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
)

const OutOfStockIcon = () => (
  <svg width="57" height="56" viewBox="0 0 57 56" fill="none" xmlns="http://www.w3.org/2000/svg">
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
)

const CaretIcon: React.FC<CaretIconProps> = ({ isOpen }) => (
  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
)

interface PartiesProp {
  _id?: string
  userEmail: string
  partyName: string
  partyType: string
  partyContactDetails: string
  billingAddress: string
  shippingAddress: string
  creditPeriod: number
  creditLimit: number
}

const Modal: React.FC = () => {
  const { user } = useUser()
  const [showModal, setShowModal] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [partiesList, setPartiesList] = useState<PartiesProp[]>([])
  const [parties, setParties] = useState<PartiesProp>({
    userEmail: user?.primaryEmailAddress?.emailAddress || "",
    partyName: "",
    partyType: "Customer",
    partyContactDetails: "",
    billingAddress: "",
    shippingAddress: "",
    creditPeriod: 0,
    creditLimit: 0,
  })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [errors, setErrors] = useState<{ [K in keyof PartiesProp]?: string }>({})
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("Select Categories")
  const [outOfStockCount, setOutOfStockCount] = useState(0)
  const [lowStockCount, setLowStockCount] = useState(0)
  const [inStockCount, setInStockCount] = useState(0)
  const [categories, setCategories] = useState<string[]>(["Customer", "Supplier"])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedParties, setExpandedParties] = useState<string[]>([])
  // Add selectedParties state to track selected items
  const [selectedParties, setSelectedParties] = useState<string[]>([])

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false)
    // Optionally clear selections when canceling delete
    // If you want to clear selections on cancel, uncomment the next line:
    // setSelectedParties([])
  }

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setParties({
      userEmail: user?.primaryEmailAddress?.emailAddress || "",
      partyName: "",
      partyType: "Customer",
      partyContactDetails: "",
      billingAddress: "",
      shippingAddress: "",
      creditPeriod: 0,
      creditLimit: 0,
    })
    setErrors({})
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target

    // If the select field for category is changed, update the selectedCategory state
    if (name === "category") {
      setSelectedCategory(value)
      // Only update the partyType if it's coming from the category dropdown
      setParties((prevParties) => ({ ...prevParties, partyType: value }))
    } else if (name === "partyType") {
      // When partyType changes, only update the partyType in the state, not the category
      setParties((prevParties) => ({ ...prevParties, [name]: value }))
    } else {
      setParties((prevParties) => ({ ...prevParties, [name]: value }))
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }))
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target
    setParties((prevParties) => ({ ...prevParties, [name]: checked }))
  }

  const validateForm = (): boolean => {
    const newErrors: { [K in keyof PartiesProp]?: string } = {}

    if (!parties.partyName.trim()) {
      newErrors.partyName = "Name is required"
    }

    if (isNaN(parties.creditLimit) || parties.creditLimit <= 0) {
      newErrors.creditLimit = "Price must be a positive number"
    }

    if (!parties.partyContactDetails.trim()) {
      newErrors.partyContactDetails = "Contact Number is required"
    }

    setErrors(newErrors)
    console.log("Validation errors:", newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (validateForm()) {
      console.log("Form is valid, showing confirmation dialog")
      setShowConfirmation(true)
    } else {
      console.log("Form is invalid, not showing confirmation dialog")
    }
  }

  const handleConfirm = async () => {
    const partiesToSave = {
      ...parties,
      userEmail: user?.primaryEmailAddress?.emailAddress || "",
    }

    try {
      const response = await fetch("/api/parties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partiesToSave),
      })

      if (!response.ok) {
        throw new Error("Failed to save product")
      }

      const savedParties = await response.json()

      setShowConfirmation(false)
      handleCloseModal()
      fetchPartiesList()
    } catch (error) {
      console.error("Error saving parties:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()

        const categoryNames = data.map((cat: any) => cat.name)
        setCategories(["Customer", "Supplier", ...categoryNames])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleCreateCategory = async (categoryName: string) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName }),
      })

      if (response.ok) {
        const newCategory = await response.json()
        setCategories([...categories, newCategory.name])

        setSelectedCategory(newCategory.name)

        setParties((prev) => ({ ...prev, partyType: newCategory.name }))

        setNewCategoryName("")
      } else {
        const error = await response.json()
        console.error("Error creating category:", error)
      }
    } catch (error) {
      console.error("Error creating category:", error)
    }
  }

  const fetchPartiesList = async () => {
    try {
      const response = await fetch("/api/parties")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }
      const parties = await response.json()
      setPartiesList(parties)

      const customerCount = parties.filter((party: PartiesProp) => party.partyType === "Customer").length
      const supplierCount = parties.filter((party: PartiesProp) => party.partyType === "Supplier").length

      setInStockCount(supplierCount)
      setLowStockCount(0)
      setOutOfStockCount(0)
    } catch (error) {
      setPartiesList([])
      setOutOfStockCount(0)
      setLowStockCount(0)
      setInStockCount(0)
    }
  }

  const togglePartyExpand = (partyId: string | undefined) => {
    if (!partyId) return

    setExpandedParties((prev) => (prev.includes(partyId) ? prev.filter((id) => id !== partyId) : [...prev, partyId]))
  }

  // Add this function after the togglePartyExpand function
  const togglePartySelection = (partyId: string | undefined) => {
    if (!partyId) return

    setSelectedParties((prev) => (prev.includes(partyId) ? prev.filter((id) => id !== partyId) : [...prev, partyId]))
  }

  // Add this function to handle bulk delete
  const handleBulkDelete = () => {
    if (selectedParties.length > 0) {
      setShowDeleteConfirmation(true)
    }
  }

  // Add this function to perform the actual deletion
  const confirmBulkDelete = async () => {
    try {
      // Delete each selected party
      for (const partyId of selectedParties) {
        await fetch(`/api/parties/${partyId}`, {
          method: "DELETE",
        })
      }

      // Clear selections and refresh the list
      setSelectedParties([])
      setShowDeleteConfirmation(false)
      fetchPartiesList()
    } catch (error) {
      console.error("Error deleting parties:", error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchPartiesList()
  }, [])

  useEffect(() => {
    if (partiesList.length > 0) {
      const filteredList =
        selectedCategory === "Select Categories"
          ? partiesList
          : partiesList.filter((party) => party.partyType === selectedCategory)

      const customerCount = filteredList.filter((party) => party.partyType === "Customer").length
      const supplierCount = filteredList.filter((party: PartiesProp) => party.partyType === "Supplier").length

      setInStockCount(supplierCount)
    }
  }, [selectedCategory, partiesList])

  const handleCancel = () => {
    setShowConfirmation(false)
  }

  const filteredPartiesList = partiesList.filter((party) => {
    // First filter by search query
    const matchesSearch =
      searchQuery === "" ||
      party.partyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      party.partyType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      party.partyContactDetails.toLowerCase().includes(searchQuery.toLowerCase())

    // Then filter by selected category
    const matchesCategory = selectedCategory === "Select Categories" || party.partyType === selectedCategory

    return matchesSearch && matchesCategory
  })

  // useUserCheck()

  return (
    <div className="flex flex-col gap-3 pt-3 px-3 sm:px-6 bg-universal_gray_background">
      <div className="flex flex-col items-start mb-2">
        <div className="text-[22px] sm:text-[28px] font-semibold text-business_settings_black_text">Parties List</div>
        <div className="text-business_settings_gray_text text-sm sm:text-base">
          An Overview of all your transaction over the year.
        </div>
      </div>

      {/* Responsive Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-white flex shadow rounded px-4 py-6 items-center gap-3">
          <div className="flex-shrink-0">
            <AllItemsIcon />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-business_settings_black_text">
              {partiesList.length < 10 ? `0${partiesList.length}` : partiesList.length}
            </div>
            <div className="text-lg sm:text-xl font-bold text-business_settings_gray_text">All Customers</div>
          </div>
        </div>
        <div className="bg-white flex shadow rounded px-4 py-6 items-center gap-3">
          <div className="flex-shrink-0">
            <InStockIcon />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-business_settings_black_text">
              {inStockCount < 10 ? `0${inStockCount}` : inStockCount}
            </div>
            <div className="text-lg sm:text-xl font-bold text-business_settings_gray_text">All Suppliers</div>
          </div>
        </div>
        <div className="bg-white flex shadow rounded px-4 py-6 items-center gap-3">
          <div className="flex-shrink-0">
            <LowStockIcon />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-business_settings_black_text">
              ₹{lowStockCount < 10 ? `0${lowStockCount}` : lowStockCount}
            </div>
            <div className="text-lg sm:text-xl font-bold text-business_settings_gray_text">To Collect</div>
          </div>
        </div>
        <div className="bg-white flex shadow rounded px-4 py-6 items-center gap-3">
          <div className="flex-shrink-0">
            <OutOfStockIcon />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-business_settings_black_text">
              ₹{outOfStockCount < 10 ? `0${outOfStockCount}` : outOfStockCount}
            </div>
            <div className="text-lg sm:text-xl font-bold text-business_settings_gray_text">To Pay</div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls on same line */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-center">
        <div className="border rounded-lg bg-white py-4 px-5 w-full sm:w-1/3">
          <div className="flex items-center justify-start gap-3 relative">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 ml-1">
              <Search className="h-5 w-5 text-gray-500" />
            </span>
            <input
              type="text"
              placeholder="Search Items"
              className="w-full outline-none text-business_settings_black_text font-bold pl-8"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="relative border rounded-lg bg-white text-business_settings_black_text font-semibold py-4 px-5 w-full sm:w-1/3">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div>{selectedCategory}</div>
            <CaretIcon isOpen={isDropdownOpen} />
          </div>
          {isDropdownOpen && (
            <ul className="absolute z-10 w-full left-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-medium text-sidebar_green_button_background"
                onClick={() => {
                  setSelectedCategory("Select Categories")
                  setIsDropdownOpen(false)
                }}
              >
                Show All Categories
              </li>
              {categories.map((category, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedCategory(category)
                    setIsDropdownOpen(false)
                  }}
                >
                  {category}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className="border rounded-lg py-4 px-5 w-full sm:w-1/3 text-semibold bg-sidebar_green_button_background text-white"
          onClick={() => setShowModal(true)}
        >
          <div className="">+Add New Customer/Supplier</div>
        </button>
      </div>

      {/* Add this between the search/filter controls and the table */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            className={`rounded-md py-2 px-4 flex items-center justify-between ${
              selectedParties.length > 0 ? "bg-[#f44336] text-white" : "bg-gray-200 text-gray-500"
            }`}
            onClick={handleBulkDelete}
            disabled={selectedParties.length === 0}
          >
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              <span>Delete Selected</span>
            </div>
            <span className="ml-2">{`(${selectedParties.length})`}</span>
          </button>
        </div>
      </div>

      {(selectedCategory !== "Select Categories" || searchQuery) && (
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-business_settings_gray_text">
            {selectedCategory !== "Select Categories" && (
              <span className="mr-2">
                Category: <span className="font-medium">{selectedCategory}</span>
              </span>
            )}
            {searchQuery && (
              <span>
                Search: <span className="font-medium">"{searchQuery}"</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Desktop and Tablet Table View */}
      <div className="border-[0.5px] bg-white rounded-lg overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full bg-universal_gray_background">
            <thead>
              <tr className="">
                <th className="py-6 px-4 border-b text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedParties.length === filteredPartiesList.length && filteredPartiesList.length > 0}
                    onChange={() => {
                      if (selectedParties.length === filteredPartiesList.length) {
                        setSelectedParties([])
                      } else {
                        setSelectedParties(filteredPartiesList.map((party) => party._id || "").filter(Boolean))
                      }
                    }}
                  />
                </th>
                <th className="py-6 px-4 border-b text-left">Name</th>
                <th className="py-6 px-4 border-b text-left">Category</th>
                <th className="py-6 px-4 border-b text-left">Type</th>
                <th className="py-6 px-4 border-b text-left">Mobile Number</th>
                <th className="py-6 px-4 border-b text-left">Date</th>
                <th className="py-6 px-4 border-b text-left">Balance</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartiesList.map((party, index) => (
                <tr key={index} className="bg-white hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={party._id ? selectedParties.includes(party._id) : false}
                      onChange={() => togglePartySelection(party._id)}
                    />
                  </td>
                  <td className="py-2 px-4 border-b">{party.partyName}</td>
                  <td className="py-2 px-4 border-b">{party.partyType}</td>
                  <td className="py-2 px-4 border-b">{party.partyType}</td>
                  <td className="py-2 px-4 border-b">{party.partyContactDetails}</td>
                  <td className="py-2 px-4 border-b">{new Date().toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">₹{Number(party.creditLimit).toFixed(2)}</td>
                </tr>
              ))}
              {filteredPartiesList.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-business_settings_gray_text">
                    No parties found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {filteredPartiesList.length === 0 ? (
            <div className="py-8 text-center text-business_settings_gray_text">
              No parties found matching your filters.
            </div>
          ) : (
            filteredPartiesList.map((party, index) => (
              <div key={index} className="border-b border-gray-200">
                <div className="p-4 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 mr-3"
                        checked={party._id ? selectedParties.includes(party._id) : false}
                        onChange={() => togglePartySelection(party._id)}
                      />
                      <div className="font-medium text-lg">{party.partyName}</div>
                    </div>
                    <button onClick={() => togglePartyExpand(party._id)} className="text-gray-500 focus:outline-none">
                      {expandedParties.includes(party._id || "") ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <div className="text-xs text-gray-500">Category</div>
                      <div>{party.partyType}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Type</div>
                      <div>{party.partyType}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Mobile Number</div>
                      <div>{party.partyContactDetails}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Balance</div>
                      <div className="font-medium">₹{Number(party.creditLimit).toFixed(2)}</div>
                    </div>
                  </div>

                  {expandedParties.includes(party._id || "") && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <div className="text-xs text-gray-500">Billing Address</div>
                          <div>{party.billingAddress || "Not provided"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Shipping Address</div>
                          <div>{party.shippingAddress || "Not provided"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Credit Period</div>
                          <div>{party.creditPeriod} days</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Responsive Modal */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-[849px] mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
              <div className="flex items-center justify-between w-full">
                <div className="text-xl font-semibold">Add New Item</div>
                <button type="button" className="focus:outline-none" onClick={() => setShowModal(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
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
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="p-5 bg-universal_gray_background rounded-lg text-start w-full">
                    <div className="text-sidebar_black_text text-xs">Type</div>
                    <div className="flex gap-10">
                      <label className="flex items-center gap-3">
                        <span className="text-sm py-3 text-semibold">Customer</span>
                        <input
                          type="radio"
                          name="partyType"
                          value="Customer"
                          checked={parties.partyType === "Customer"}
                          onChange={(e) => {
                            handleInputChange(e)
                          }}
                          className="custom-radio h-4 w-4"
                        />
                      </label>
                      <label className="flex items-center gap-3">
                        <span className="py-3 text-sm text-semibold">Supplier</span>
                        <input
                          type="radio"
                          name="partyType"
                          value="Supplier"
                          checked={parties.partyType === "Supplier"}
                          onChange={(e) => {
                            handleInputChange(e)
                          }}
                          className="custom-radio h-4 w-4 "
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                    <div className="bg-transparent w-full text-xs text-sidebar_black_text text-start">Category</div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative w-full">
                        <select
                          name="category"
                          value={selectedCategory}
                          onChange={handleInputChange}
                          className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1 appearance-none"
                        >
                          <option value="">Select a category</option>
                          {categories.map((category, index) => (
                            <option key={index} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <CaretIcon isOpen={isDropdownOpen} />
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter new category name"
                        className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                      />
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            if (newCategoryName.trim()) {
                              handleCreateCategory(newCategoryName)
                              setNewCategoryName("")
                            }
                          }}
                          className="px-3 bg-sidebar_green_button_background text-white rounded h-8"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            setNewCategoryName("")
                          }}
                          className="px-3 border border-gray-300 rounded h-8"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                    <div className="bg-transparent w-full text-xs text-sidebar_black_text text-start">Party Name</div>
                    <input
                      type="text"
                      className={`bg-transparent border ${
                        errors.partyName ? "border-red-500" : "border-business_settings_gray_border"
                      } border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1`}
                      name="partyName"
                      value={parties.partyName}
                      onChange={handleInputChange}
                    />
                    {errors.partyName && <div className="text-red-500 text-xs mt-1">{errors.partyName}</div>}
                  </div>
                  <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                    <div className="bg-transparent w-full text-xs text-sidebar_black_text text-start">
                      Mobile Number
                    </div>
                    <input
                      type="text"
                      className={`bg-transparent border ${
                        errors.partyContactDetails ? "border-red-500" : "border-business_settings_gray_border"
                      } border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1`}
                      id="partyContactDetails"
                      name="partyContactDetails"
                      value={parties.partyContactDetails}
                      onChange={handleInputChange}
                    />
                    {errors.partyContactDetails && (
                      <div className="text-red-500 text-xs mt-1">{errors.partyContactDetails}</div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                    <div className="bg-transparent w-full text-xs text-sidebar_black_text text-start">
                      Billing Address
                    </div>
                    <input
                      type="text"
                      name="billingAddress"
                      value={parties.billingAddress}
                      onChange={handleInputChange}
                      className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                    />
                  </div>
                  <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                    <div className="bg-transparent w-full text-xs text-sidebar_black_text text-start">
                      Shipping Address
                    </div>
                    <input
                      type="text"
                      name="shippingAddress"
                      value={parties.shippingAddress}
                      onChange={handleInputChange}
                      className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                    <div className="bg-transparent w-full text-xs text-sidebar_black_text text-start">
                      Credit Period
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative w-full">
                        <input
                          type="number"
                          id="creditPeriod"
                          name="creditPeriod"
                          placeholder="eg-30"
                          value={parties.creditPeriod}
                          onChange={handleInputChange}
                          className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none pl-3 pr-2 font-semibold"
                        />
                      </div>
                      <div className="flex items-center justify-center rounded-lg bg-unit_gray_button_background px-10 py-2 text-sm h-8">
                        days
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                    <div className="bg-transparent w-full text-xs text-sidebar_black_text text-start">Credit Limit</div>
                    <div className="relative w-full">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sidebar_black_text font-semibold">
                        ₹
                      </span>
                      <input
                        type="number"
                        id="creditLimit"
                        name="creditLimit"
                        value={parties.creditLimit}
                        onChange={handleInputChange}
                        className={`bg-transparent border ${
                          errors.creditLimit ? "border-red-500" : "border-business_settings_gray_border"
                        } border-dashed w-full h-8 rounded-[4px] focus:outline-none pl-6 pr-2 font-semibold`}
                      />
                      {errors.creditLimit && <div className="text-red-500 text-xs mt-1">{errors.creditLimit}</div>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-universal_white_background px-4 h-10 py-[10px] border flex items-center justify-center rounded-lg w-full sm:max-w-[190px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-sidebar_green_button_background h-10 text-universal_white_background px-4 py-[10px] flex items-center justify-center rounded-lg w-full sm:max-w-[190px] focus:outline-none"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Responsive Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full max-w-[95%] mx-auto">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Party Creation</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Are you sure you want to create the following party?</p>
                      <ul className="mt-2 list-disc pl-5">
                        <li>Name: {parties.partyName}</li>
                        <li>Type: {parties.partyType}</li>
                        <li>Credit Limit: ₹{parties.creditLimit}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleConfirm}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Delete Confirmation */}
      {showDeleteConfirmation && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full max-w-[95%] mx-auto">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Party Deletion</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete {selectedParties.length} selected{" "}
                        {selectedParties.length === 1 ? "party" : "parties"}?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmBulkDelete}
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
    </div>
  )
}

export default Modal
