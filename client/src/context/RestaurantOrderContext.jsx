"use client"

import { createContext, useContext, useState } from "react"
import { usePopup } from "./PopupContext"

const BaseUrl = import.meta.env.VITE_BASE_API_URL

const RestaurantOrderContext = createContext()

export const RestaurantOrderProvider = ({ children }) => {
  const [restaurantOrders, setRestaurantOrders] = useState([])
  const [ordersStats, setOrdersStats] = useState(null)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState(null)
  const { showPopup } = usePopup()

  const handleResponse = async (res) => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Something went wrong")
    return data
  }

  // Get all orders for a restaurant
  const allOrders = async (restaurantId, filters = {}) => {
    try {
      setOrdersLoading(true)
      setOrdersError(null)

      const queryParams = new URLSearchParams()
      if (filters.status) queryParams.append("status", filters.status)
      if (filters.search) queryParams.append("search", filters.search)

      const url = `${BaseUrl}/api/order/restaurant/${restaurantId}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      })

      const data = await handleResponse(res)
      setRestaurantOrders(data.data.orders || [])
      setOrdersStats(data.data.stats || null)
    } catch (err) {
      setOrdersError(err.message || "Failed to fetch orders")
      showPopup(err.message || "Failed to fetch orders", "error")
    } finally {
      setOrdersLoading(false)
    }
  }

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`${BaseUrl}/api/order/status/${orderId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      const data = await handleResponse(res)
      showPopup("Order status updated successfully", "success")

      // Update the order in the local state
      setRestaurantOrders((prev) =>
        prev.map((order) => (order._id === orderId ? { ...order, orderStatus: status } : order)),
      )

      return data
    } catch (err) {
      showPopup(err.message || "Failed to update order status", "error")
      throw err
    }
  }

  return (
    <RestaurantOrderContext.Provider
      value={{
        restaurantOrders,
        ordersStats,
        ordersLoading,
        ordersError,
        allOrders,
        updateOrderStatus,
      }}
    >
      {children}
    </RestaurantOrderContext.Provider>
  )
}

export const useRestaurantOrders = () => {
  const context = useContext(RestaurantOrderContext)
  if (!context) {
    throw new Error("useRestaurantOrders must be used within a RestaurantOrderProvider")
  }
  return context
}
