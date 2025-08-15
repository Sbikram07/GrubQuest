"use client"

import { useAuth } from "@/context/AuthContext"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, isLoggedIn, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        navigate("/login")
        return
      }

      if (requiredRole && user?.role !== requiredRole) {
        navigate("/home")
        return
      }
    }
  }, [isLoggedIn, loading, user, requiredRole, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!isLoggedIn || (requiredRole && user?.role !== requiredRole)) {
    return null
  }

  return children
}
