"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { useUser } from "@clerk/nextjs"
import { ChevronDown, Search, Trash2 } from "lucide-react"

interface CaretIconProps {
  isOpen: boolean
}

const CaretIcon: React.FC<CaretIconProps> = ({ isOpen }) => (
  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
)

interface Expense {
  _id?: string
  userEmail: string
  date: string
  itemType: string
  invoiceName: string
  expenseName: string
  note: string
  expenseAmount: number
  taxIncluded: boolean
  taxRate: number
  totalPrice?: number
  taxAmount?: number
}

const ExpensesManager: React.FC = () => {
  const { user } = useUser()
  const [showModal, setShowModal] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [expenseList, setExpenseList] = useState<Expense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [expense, setExpense] = useState<Expense>({
    userEmail: user?.primaryEmailAddress?.emailAddress || "",
    date: new Date().toISOString().split("T")[0],
    itemType: "Product",
    invoiceName: "",
    expenseName: "",
    note: "",
    expenseAmount: 0,
    taxIncluded: true,
    taxRate: 0,
  })
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [errors, setErrors] = useState<{ [K in keyof Expense]?: string }>({})
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedDuration, setSelectedDuration] = useState("Select Duration")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: keyof Expense; direction: "ascending" | "descending" } | null>(
    null,
  )
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [showBulkDeleteConfirmation, setShowBulkDeleteConfirmation] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [categories, setCategories] = useState(["Product", "Service", "All Categories"])


  const durations = ["Last 3 Months", "Last 6 Months", "Last 9 Months", "All Time"]

  const handleCreateCategory = () => {
    if (newCategoryName.trim() === "") return

   
    if (!categories.includes(newCategoryName)) {
      setCategories((prev) => [...prev.filter((cat) => cat !== "All Categories"), newCategoryName, "All Categories"])
    }

    setExpense((prev) => ({ ...prev, itemType: newCategoryName }))

 
    setNewCategoryName("")
    setShowCategoryForm(false)
  }

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setExpense({
      userEmail: user?.primaryEmailAddress?.emailAddress || "",
      date: new Date().toISOString().split("T")[0],
      itemType: "Product",
      invoiceName: "",
      expenseName: "",
      note: "",
      expenseAmount: 0,
      taxIncluded: true,
      taxRate: 0,
    })
    setErrors({})
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setExpense((prevExpense) => ({ ...prevExpense, [name]: value }))
    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }))
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target
    setExpense((prevExpense) => ({ ...prevExpense, [name]: checked }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    handleConfirm()
  }

  const handleConfirm = async () => {
    const expenseAmountNum = Number(expense.expenseAmount)
    const taxRate = expense.taxRate / 100
    let totalPrice: number
    let taxAmount: number

    if (expense.taxIncluded) {
      totalPrice = expenseAmountNum
      taxAmount = (expenseAmountNum * taxRate) / (1 + taxRate)
    } else {
      totalPrice = expenseAmountNum * (1 + taxRate)
      taxAmount = expenseAmountNum * taxRate
    }

    const expenseToSave = {
      ...expense,
      expenseAmount: expenseAmountNum,
      totalPrice,
      taxAmount,
      userEmail: user?.primaryEmailAddress?.emailAddress || "",
    }

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseToSave),
      })

      if (!response.ok) {
        throw new Error("Failed to save expense")
      }

      await response.json()
      handleCloseModal()
      fetchExpenseList()
    } catch (error) {
      console.error("Error saving expense:", error)
    }
  }

  const fetchExpenseList = async () => {
    try {
      const response = await fetch("/api/expenses")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }
      const expenses = await response.json()
      setExpenseList(expenses)
      setFilteredExpenses(expenses)
    } catch (error) {
      console.error("Error fetching expenses:", error)
      setExpenseList([])
      setFilteredExpenses([])
    }
  }

  useEffect(() => {
    let result = [...expenseList]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (expense) =>
          expense.invoiceName.toLowerCase().includes(query) ||
          expense.expenseName.toLowerCase().includes(query) ||
          expense.note.toLowerCase().includes(query),
      )
    }

    if (selectedCategory !== "All Categories") {
      result = result.filter((expense) => expense.itemType === selectedCategory)
    }

    if (selectedDuration !== "Select Duration") {
      const now = new Date()
      let monthsAgo = 0

      if (selectedDuration === "Last 3 Months") monthsAgo = 3
      else if (selectedDuration === "Last 6 Months") monthsAgo = 6
      else if (selectedDuration === "Last 9 Months") monthsAgo = 9

      if (monthsAgo > 0) {
        const cutoffDate = new Date()
        cutoffDate.setMonth(now.getMonth() - monthsAgo)
        result = result.filter((expense) => new Date(expense.date) >= cutoffDate)
      }
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? ""
        const bValue = b[sortConfig.key] ?? ""

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredExpenses(result)
  }, [expenseList, searchQuery, selectedCategory, selectedDuration, sortConfig])

  const requestSort = (key: keyof Expense) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const handleSelectExpense = (id: string | undefined) => {
    if (!id) return

    setSelectedExpenses((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedExpenses([])
    } else {
      setSelectedExpenses(filteredExpenses.map((expense) => expense._id || "").filter((id) => id !== ""))
    }
    setSelectAll(!selectAll)
  }

  // Delete functionality
  const handleDeleteExpense = async (id: string | undefined) => {
    if (!id) return

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete expense")
      }

      fetchExpenseList()
      setShowDeleteConfirmation(false)
      setExpenseToDelete(null)
    } catch (error) {
      console.error("Error deleting expense:", error)
    }
  }

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedExpenses) {
        await fetch(`/api/expenses/${id}`, {
          method: "DELETE",
        })
      }

      fetchExpenseList()
      setSelectedExpenses([])
      setSelectAll(false)
      setShowBulkDeleteConfirmation(false)
    } catch (error) {
      console.error("Error bulk deleting expenses:", error)
    }
  }

  useEffect(() => {
    fetchExpenseList()
  }, [])

  return (
    <div className="flex flex-col gap-3 pt-3 px-6 bg-gray-50">
      <div className="flex flex-col items-start">
        <div className="flex justify-between w-full gap-3">
          <div>
            <div className="text-[28px] font-semibold text-gray-900">Expenses List</div>
            <div className="text-gray-500">An Overview of all your transaction over the year.</div>
          </div>
          <div className="flex gap-3">{}</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap md:flex-nowrap">
        <div className="border rounded-lg bg-white py-4 px-5 w-full">
          <div className="flex items-center justify-start gap-3 relative">
            <span
              className={`absolute top-1/2 transform -translate-y-1/2 transition-transform duration-300 ease-in-out ${
                isFocused ? "translate-x-2" : "translate-x-0"
              } text-gray-900 font-bold`}
              style={{ left: "0.1rem" }}
            >
              <Search size={24} />
            </span>
            <input
              type="text"
              placeholder="Search by invoice, expense name or note"
              className="w-full outline-none text-gray-900 font-bold pl-10"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="relative border rounded-lg bg-white text-gray-900 font-semibold py-4 px-5 w-full md:max-w-[339px]">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsDurationDropdownOpen(!isDurationDropdownOpen)}
          >
            <div>{selectedDuration}</div>
            <CaretIcon isOpen={isDurationDropdownOpen} />
          </div>
          {isDurationDropdownOpen && (
            <ul className="absolute z-10 w-full left-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              {durations.map((duration, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedDuration(duration)
                    setIsDurationDropdownOpen(false)
                  }}
                >
                  {duration}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative border rounded-lg bg-white text-gray-900 font-semibold py-4 px-5 w-full md:max-w-[339px]">
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
          className="border rounded-lg py-4 px-5 w-full md:max-w-[287px] font-semibold bg-sidebar_green_button_background text-white"
          onClick={() => setShowModal(true)}
        >
          <div className="">+Add New Expenses</div>
        </button>
      </div>
      <div className="mt-4 mb-2">
        <button
          className={`border rounded-lg py-2 px-3 flex items-center gap-2 ${
            selectedExpenses.length > 0
              ? "bg-red-50 text-red-600 border-red-200"
              : "bg-gray-100 text-gray-400 border-gray-200"
          }`}
          onClick={() => {
            if (selectedExpenses.length > 0) {
              setShowBulkDeleteConfirmation(true)
            }
          }}
          disabled={selectedExpenses.length === 0}
        >
          <Trash2 size={16} />
          <div>Delete Selected ({selectedExpenses.length})</div>
        </button>
      </div>
      <div className="border-[0.5px] bg-white rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-6 px-4 border-b text-center">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                    />
                  </div>
                </th>
                <th
                  className="py-6 px-4 border-b text-center cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("date")}
                >
                  <div className="flex items-center justify-center">
                    Date
                    {sortConfig?.key === "date" && (
                      <span className="ml-1">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="py-6 px-4 border-b text-center cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("invoiceName")}
                >
                  <div className="flex items-center justify-center">
                    Invoice Number
                    {sortConfig?.key === "invoiceName" && (
                      <span className="ml-1">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="py-6 px-4 border-b text-center cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("expenseName")}
                >
                  <div className="flex items-center justify-center">
                    Expense number
                    {sortConfig?.key === "expenseName" && (
                      <span className="ml-1">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="py-6 px-4 border-b text-center cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("itemType")}
                >
                  <div className="flex items-center justify-center">
                    Category
                    {sortConfig?.key === "itemType" && (
                      <span className="ml-1">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th className="py-6 px-4 border-b text-center">GST</th>
                <th
                  className="py-6 px-4 border-b text-center cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("expenseAmount")}
                >
                  <div className="flex items-center justify-center">
                    Amount
                    {sortConfig?.key === "expenseAmount" && (
                      <span className="ml-1">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th className="py-6 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense, index) => (
                <tr key={index} className="bg-white hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-center">
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={selectedExpenses.includes(expense._id || "")}
                        onChange={() => handleSelectExpense(expense._id)}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b text-center">{expense.date}</td>
                  <td className="py-2 px-4 border-b text-center">{expense.invoiceName}</td>
                  <td className="py-2 px-4 border-b text-center">{expense.expenseName}</td>
                  <td className="py-2 px-4 border-b text-center">{expense.itemType}</td>
                  <td className={`py-2 px-4 border-b text-center`}>
                    <div
                      className={`text-center rounded-[6px] ${
                        expense.taxIncluded
                          ? "bg-green-100 text-green-800 border border-green-800"
                          : "bg-yellow-100 text-yellow-800 border border-yellow-800"
                      }`}
                    >
                      {expense.taxIncluded ? "Included" : "Excluded"}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b text-center">{Number(expense.expenseAmount).toFixed(2)}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <div className="flex justify-center">
                      <button
                        className="text-red-500 hover:text-red-700 p-1"
                        onClick={() => {
                          setExpenseToDelete(expense)
                          setShowDeleteConfirmation(true)
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr className="bg-white">
                  <td colSpan={8} className="py-4 px-4 text-center text-gray-500">
                    No expenses found. Try adjusting your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-[849px] w-full mx-4 md:mx-auto">
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between w-full">
                <div className="text-xl font-semibold">Add Expenses</div>
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
              <div className="flex flex-col rounded-lg p-3 border border-gray-200 w-full gap-3">
                <div className="flex gap-3 flex-col md:flex-row">
                  <div className="p-5 bg-gray-50 rounded-lg text-start w-full">
                    <div className="text-gray-900 text-xs">Date</div>
                    <input
                      type="date"
                      name="date"
                      value={expense.date}
                      onChange={handleInputChange}
                      className="bg-transparent border border-gray-300 border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                    />
                  </div>
                  <div className="flex flex-col w-full bg-gray-50 p-5 rounded-lg gap-1">
                    <div className="bg-transparent w-full text-xs text-gray-900 text-start">Category</div>
                    <div className="flex gap-2 flex-col sm:flex-row">
                      <div className="relative w-full">
                        <select
                          name="itemType"
                          value={expense.itemType}
                          onChange={handleInputChange}
                          className="bg-transparent border border-gray-300 border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1 appearance-none"
                        >
                          <option value="">Select a category</option>
                          {categories
                            .filter((cat) => cat !== "All Categories")
                            .map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <CaretIcon isOpen={false} />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowCategoryForm(!showCategoryForm)}
                       className="w-full max-w-[176px] border bg-change_password_green_background border-sidebar_green_button_background text-sidebar_green_button_background rounded text-sm font-semibold"
                      >
                        Create New Category
                      </button>
                    </div>
                    {showCategoryForm && (
                      <div className="flex  gap-2 mt-2 items-center">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Enter category name"
                          className="bg-transparent border border-business_settings_gray_border border-dashed flex-1 min-w-[200px] h-8 rounded-[4px] focus:outline-none p-1"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleCreateCategory}
                            className="border bg-sidebar_green_button_background text-white rounded text-sm font-semibold h-8 px-4"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowCategoryForm(false)
                              setNewCategoryName("")
                            }}
                            className="border border-gray-300 bg-white text-gray-700 rounded text-sm font-semibold h-8 px-4"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 flex-col md:flex-row">
                  <div className="flex flex-col w-full bg-gray-50 p-5 rounded-lg gap-1">
                    <div className="bg-transparent w-full text-xs text-gray-900 text-start">Invoice Number</div>
                    <input
                      type="text"
                      className={`bg-transparent border ${
                        errors.invoiceName ? "border-red-500" : "border-gray-300"
                      } border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1`}
                      name="invoiceName"
                      value={expense.invoiceName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-col w-full bg-gray-50 p-5 rounded-lg gap-1">
                    <div className="bg-transparent w-full text-xs text-gray-900 text-start">Expense Number</div>
                    <input
                      type="text"
                      className="bg-transparent border border-gray-300 border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                      id="expenseName"
                      name="expenseName"
                      value={expense.expenseName}
                      onChange={handleInputChange}
                      placeholder="Enter expense number"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col w-full bg-gray-50 p-5 rounded-lg gap-1">
                    <div className="bg-transparent w-full text-xs text-gray-900 text-start">Note</div>
                    <input
                      type="text"
                      name="note"
                      value={expense.note}
                      onChange={handleInputChange}
                      className="bg-transparent border border-gray-300 border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                    />
                  </div>
                </div>
                <div className="flex gap-3 flex-col md:flex-row">
                  <div className="flex flex-col w-full bg-gray-50 p-5 rounded-lg gap-1">
                    <div className="bg-transparent w-full text-xs text-gray-900 text-start">Expense Amount</div>
                    <div className="flex gap-3 flex-col sm:flex-row">
                      <div className="relative w-full">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2">₹</span>
                        <input
                          type="number"
                          name="expenseAmount"
                          value={expense.expenseAmount}
                          onChange={handleInputChange}
                          className="bg-transparent border border-gray-300 border-dashed w-full h-8 rounded-[4px] focus:outline-none pl-6 pr-2 font-semibold"
                        />
                      </div>
                      <div className="w-full sm:max-w-[130px] rounded bg-gray-200 text-sm flex items-center justify-center font-semibold gap-2 h-8">
                        GST Included
                        <input
                          type="checkbox"
                          name="taxIncluded"
                          checked={expense.taxIncluded}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-full bg-gray-50 p-5 rounded-lg gap-1">
                    <div className="bg-transparent w-full text-xs text-gray-900 text-start">Tax</div>
                    <div className="relative w-full">
                      <select
                        id="taxRate"
                        name="taxRate"
                        value={expense.taxRate}
                        onChange={handleInputChange}
                        className="bg-transparent border border-gray-300 border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1 appearance-none"
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
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-white px-4 h-10 py-[10px] border flex items-center justify-center rounded-lg w-full max-w-[190px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-sidebar_green_button_background text-white px-4 py-[10px] flex items-center justify-center rounded-lg w-full max-w-[190px] focus:outline-none"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen px-4 py-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Expense</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this expense? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    if (expenseToDelete?._id) {
                      handleDeleteExpense(expenseToDelete._id)
                    }
                  }}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowDeleteConfirmation(false)
                    setExpenseToDelete(null)
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBulkDeleteConfirmation && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen px-4 py-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Bulk Delete Expenses</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete {selectedExpenses.length} selected expenses? This action cannot
                        be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleBulkDelete}
                >
                  Delete All
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowBulkDeleteConfirmation(false)}
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

export default ExpensesManager
