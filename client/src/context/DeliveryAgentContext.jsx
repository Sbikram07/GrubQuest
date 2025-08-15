"use client"

import { createContext, useContext, useState } from "react"
import { usePopup } from "./PopupContext"

const BaseUrl = import.meta.env.VITE_BASE_API_URL

const DeliveryAgentContext = createContext()

export const DeliveryAgentProvider = ({ children }) => {
  const [agentData, setAgentData] = useState(null)
  const [assignedOrders, setAssignedOrders] = useState([])
  const [pickedOrders, setPickedOrders] = useState([])
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    totalEarnings: 0,
    activeOrders: 0,
  })
  const [loading, setLoading] = useState(false)
  const { showPopup } = usePopup()

  const handleResponse = async (res) => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Something went wrong")
    return data
  }

  // Get agent dashboard data
  const getAgentDashboard = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${BaseUrl}/api/delivery-agent/dashboard`, {
        method: "GET",
        credentials: "include",
      })

      const data = await handleResponse(res)
     

      setAgentData(data.data.agent)
      setAssignedOrders(data.data.assignedOrders)
      setPickedOrders(data.data.pickedOrders)
      setStats(data.data.stats)
    } catch (err) {
      showPopup(err.message || "Failed to fetch dashboard data", "error")
    } finally {
      setLoading(false)
    }
  }

  // Update availability status
  const updateAvailability = async (isActive) => {
    try {
      const res = await fetch(`${BaseUrl}/api/delivery-agent/availability`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      })

      const data = await handleResponse(res)
      setAgentData(data.agent)
      showPopup(data.message, "success")
    } catch (err) {
      showPopup(err.message || "Failed to update availability", "error")
    }
  }

  // Update location
  const updateLocation = async (latitude, longitude) => {
    try {
      const res = await fetch(`${BaseUrl}/api/delivery-agent/location`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude }),
      })

      const data = await handleResponse(res)
      setAgentData(data.agent)
      showPopup("Location updated successfully", "success")
    } catch (err) {
      showPopup(err.message || "Failed to update location", "error")
    }
  }

  // Pick up order
  const pickupOrder = async (orderId) => {
    try {
      const res = await fetch(`${BaseUrl}/api/order/agent/pickup/${orderId}`, {
        method: "PUT",
        credentials: "include",
      })

      const data = await handleResponse(res)
      showPopup("Order picked up successfully", "success")

      // Refresh dashboard
      getAgentDashboard()
    } catch (err) {
      showPopup(err.message || "Failed to pickup order", "error")
    }
  }

  // Mark order as delivered
  const markAsDelivered = async (orderId) => {
    try {
      const res = await fetch(`${BaseUrl}/api/order/status/${orderId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "delivered" }),
       
      })

      const data = await handleResponse(res)
      showPopup("Order marked as delivered", "success")

      // Refresh dashboard
      getAgentDashboard()
    } catch (err) {
      showPopup(err.message || "Failed to mark as delivered", "error")
    }
  }

  // Get delivery history
  const getDeliveryHistory = async (page = 1) => {
    try {
      setLoading(true)
      const res = await fetch(`${BaseUrl}/api/delivery-agent/history?page=${page}`, {
        method: "GET",
        credentials: "include",
      })

      const data = await handleResponse(res)
      return data
    } catch (err) {
      showPopup(err.message || "Failed to fetch delivery history", "error")
      return null
    } finally {
      setLoading(false)
    }
  }

  return (
    <DeliveryAgentContext.Provider
      value={{
        agentData,
        assignedOrders,
        pickedOrders,
        stats,
        loading,
        getAgentDashboard,
        updateAvailability,
        updateLocation,
        pickupOrder,
        markAsDelivered,
        getDeliveryHistory,
      
      }}
    >
      {children}
    </DeliveryAgentContext.Provider>
  )
}

export const useDeliveryAgent = () => useContext(DeliveryAgentContext)
