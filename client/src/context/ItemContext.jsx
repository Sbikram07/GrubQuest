"use client"

import { createContext, useContext, useState } from "react"
const BaseUrl = import.meta.env.VITE_BASE_API_URL

import { usePopup } from "./PopupContext"

const ItemContext = createContext()

export const useItem = () => useContext(ItemContext)

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const { showPopup } = usePopup()

  const handleResponse = async (res) => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Something went wrong")
    return data
  }

  const allItem = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${BaseUrl}/api/items/allitems`, {
        method: "GET",
        credentials: "include",
      })

      const data = await res.json()

      if (data.success) {
        setItems(data.allitems)
      } else {
        console.error("Failed to fetch items:", data.message)
      }
    } catch (err) {
      console.error("Error fetching items:", err)
      showPopup("Failed to fetch items", "error")
    } finally {
      setLoading(false)
    }
  }

  const getItemsByCategory = async (category) => {
    try {
      setLoading(true)
      const res = await fetch(`${BaseUrl}/api/items/category/${category}`, {
        method: "GET",
        credentials: "include",
      })

      const data = await res.json()

      if (data.success) {
        setItems(data.items)
      } else {
        setItems([])
        console.warn(data.message)
      }
    } catch (err) {
      console.error("Error fetching items by category:", err)
      showPopup("Failed to search items", "error")
    } finally {
      setLoading(false)
    }
  }

  const fetchItemsByRestaurant = async (restaurantId) => {
    try {
      setLoading(true)
      const res = await fetch(`${BaseUrl}/api/items/restaurant/${restaurantId}`, {
        method: "GET",
        credentials: "include",
      })
      const data = await handleResponse(res)
      setItems(data.items)
    } catch (err) {
      showPopup(err.message || "Failed to fetch items", "error")
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (restaurantId, formData) => {
    try {
      setLoading(true)
      const res = await fetch(`${BaseUrl}/api/items/add/${restaurantId}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
      const data = await handleResponse(res)
      setItems((prev) => [...prev, data.item])
      showPopup("Item added successfully", "success")
    } catch (err) {
      showPopup(err.message || "Failed to add item", "error")
    } finally {
      setLoading(false)
    }
  }

  const updateItem = async (restaurantId, itemId, formData) => {
    try {
      const res = await fetch(`${BaseUrl}/api/items/${restaurantId}/update/${itemId}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      })
      const data = await handleResponse(res)
      setItems((prev) => prev.map((item) => (item._id === itemId ? data.item : item)))
      showPopup("Item updated successfully", "success")
    } catch (err) {
      showPopup(err.message || "Failed to update item", "error")
    }
  }

  const deleteItem = async (restaurantId, itemId) => {
    try {
      const res = await fetch(`${BaseUrl}/api/items/${restaurantId}/delete/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      })
      await handleResponse(res)
      setItems((prev) => prev.filter((item) => item._id !== itemId))
      showPopup("Item deleted", "success")
    } catch (err) {
      showPopup(err.message || "Failed to delete item", "error")
    }
  }

  const getItemById = async (itemId) => {
    try {
      setLoading(true)
      const res = await fetch(`${BaseUrl}/api/items/get/${itemId}`, {
        method: "GET",
        credentials: "include",
      })
      const data = await handleResponse(res)
      return data.item
    } catch (err) {
      showPopup(err.message || "Failed to fetch item", "error")
      return null
    } finally {
      setLoading(false)
    }
  }

  const getAllReview = async (id) => {
    try {
      const res = await fetch(`${BaseUrl}/api/review/item/${id}`, {
        method: "GET",
        credentials: "include",
      })
      const data = await handleResponse(res)
      setReviews(data.data)
    } catch (err) {
      console.log(err)
      showPopup("Failed to fetch reviews", "error")
    }
  }

  const addReview = async (reviewData) => {
    try {
      const res = await fetch(`${BaseUrl}/api/review/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      })
      const data = await handleResponse(res)
      showPopup("Review added successfully", "success")
      return data
    } catch (err) {
      showPopup(err.message || "Failed to add review", "error")
      return null
    }
  }

  return (
    <ItemContext.Provider
      value={{
        items,
        reviews,
        loading,
        fetchItemsByRestaurant,
        addItem,
        updateItem,
        deleteItem,
        allItem,
        getItemsByCategory,
        getItemById,
        getAllReview,
        addReview,
      }}
    >
      {children}
    </ItemContext.Provider>
  )
}
