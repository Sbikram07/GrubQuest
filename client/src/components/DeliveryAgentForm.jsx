"use client"

// src/components/DeliveryAgentForm.jsx

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"

export default function DeliveryAgentForm() {
  const { updateRoleToAgent } = useAuth()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    vehicleNumber: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // For now, just update the role to delivery agent
      // In a real app, you might want to save additional agent details
      const success = await updateRoleToAgent()
      if (success) {
        alert("Successfully registered as delivery agent!")
      }
    } catch (error) {
      console.error("Failed to register as delivery agent:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
      <Input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} required />
      <Input
        name="phone"
        placeholder="Phone Number"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <Input
        name="vehicleNumber"
        placeholder="Vehicle Number"
        value={formData.vehicleNumber}
        onChange={handleChange}
        required
      />
      <Button type="submit" className="bg-green-600 text-white" disabled={loading}>
        {loading ? "Registering..." : "Register as Delivery Agent"}
      </Button>
    </form>
  )
}
