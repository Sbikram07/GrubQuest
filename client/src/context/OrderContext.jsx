"use client"

import { createContext, useContext, useState } from "react"
import { usePopup } from "./PopupContext"

const BaseUrl = import.meta.env.VITE_BASE_API_URL

const OrderContext = createContext()

export const OrderProvider = ({ children }) => {
  const { showPopup } = usePopup()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  // ---------------------- Place Order ----------------------
  const placeOrder = async ({ restaurantId, items, deliveryAddress }) => {
    try {
      setLoading(true)
      const res = await fetch(`${BaseUrl}/api/order/place`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, items, deliveryAddress }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Order placement failed")

      showPopup("Order placed successfully", "success")
      return data.order
    } catch (err) {
      showPopup(err.message || "Failed to place order", "error")
      return null
    } finally {
      setLoading(false)
    }
  }

  // ---------------------- Get My Orders ----------------------
  const fetchMyOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${BaseUrl}/api/order/my-orders`, {
        method: "GET",
        credentials: "include",
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to fetch orders")

      setOrders(data.orders)
    } catch (err) {
      showPopup(err.message || "Could not load orders", "error")
    } finally {
      setLoading(false)
    }
  }

  // ---------------------- Cancel Order ----------------------
  const cancelOrder = async (orderId) => {
    try {
      const res = await fetch(`${BaseUrl}/api/order/${orderId}/cancel`, {
        method: "DELETE",
        credentials: "include",
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to cancel")

      showPopup("Order cancelled successfully", "success")
      fetchMyOrders() // Refresh after cancel
    } catch (err) {
      showPopup(err.message || "Could not cancel order", "error")
    }
  }

  // ---------------------- Update Order Status ----------------------
  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`${BaseUrl}/api/order/status/${orderId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Update failed")

      showPopup("Order status updated", "success")
      fetchMyOrders() // Optional
    } catch (err) {
      showPopup(err.message || "Could not update status", "error")
    }
  }
  

  return (
    <OrderContext.Provider
      value={{
        loading,
        orders,
        placeOrder,
        fetchMyOrders,
        cancelOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export const useOrder = () => useContext(OrderContext)
