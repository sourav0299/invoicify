"use client"
import { useState } from "react"
import type React from "react"

import { X } from "lucide-react"

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (categoryName: string) => void
}

export default function CategoryModal({ isOpen, onClose, onSave }: CategoryModalProps) {
  const [categoryName, setCategoryName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!categoryName.trim()) {
      setError("Category name is required")
      return
    }

    onSave(categoryName)
    setCategoryName("")
    setError("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create New Category</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value)
                setError("")
              }}
              className={`w-full p-2 border ${error ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="Enter category name"
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sidebar_green_button_background text-white rounded-lg hover:bg-green-600"
            >
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

