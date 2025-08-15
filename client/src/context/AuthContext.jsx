"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { usePopup } from "./PopupContext"

const BaseUrl = import.meta.env.VITE_BASE_API_URL
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const { showPopup } = usePopup()

  // ---------------------- GET ME ----------------------
  const getMe = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${BaseUrl}/api/auth/me`, {
        method: "GET",
        credentials: "include",
      })

      if (!res.ok) throw new Error("Unauthorized")

      const data = await res.json()
      setUser(data.user)
    
      setIsLoggedIn(true)
    } catch (err) {
      setUser(null)
      setIsLoggedIn(false)
    } finally {
      setLoading(false)
    }
  }

  // ---------------------- REGISTER ----------------------
  const register = async ({ name, email, password }) => {
    try {
      setLoading(true)
      const res = await fetch(`${BaseUrl}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Registration failed")

      setUser(data.user)
      setIsLoggedIn(true)
      showPopup("Registered successfully", "success")
      return true
    } catch (err) {
      setAuthError(err.message)
      showPopup(err.message, "error")
      return false
    } finally {
      setLoading(false)
    }
  }

  // ---------------------- LOGIN ----------------------
  const login = async ({ email, password }) => {
    try {
      setLoading(true)
      const res = await fetch(`${BaseUrl}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Login failed")

      setUser(data.user)
      setIsLoggedIn(true)
      showPopup("Logged in successfully", "success")
      return true
    } catch (err) {
      setAuthError(err.message)
      showPopup(err.message, "error")
      return false
    } finally {
      setLoading(false)
    }
  }

  // ---------------------- LOGOUT ----------------------
  const logout = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${BaseUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      })

      if (!res.ok) throw new Error("Logout failed")

      setUser(null)
      setIsLoggedIn(false)
      showPopup("Logged out successfully", "success")
    } catch (err) {
      showPopup("Logout failed", "error")
    } finally {
      setLoading(false)
    }
  }


  const updateProfile = async ({ id, name, phone,address, avatar }) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone",phone);
      formData.append("address",address)
      if (avatar) {
        formData.append("image", avatar);
      }

      const res = await fetch(`${BaseUrl}/api/user/update/${id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setUser(data.user);
      showPopup("Profile updated successfully", "success");
      return true;
    } catch (err) {
      showPopup(err.message || "Failed to update profile", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };


  // ---------------------- CHANGE PASSWORD ----------------------
  const changePassword = async ({ id, oldPassword, newPassword }) => {
    try {
      const res = await fetch(`${BaseUrl}/api/user/change-password/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Password change failed")

      showPopup("Password updated successfully", "success")
      return true
    } catch (err) {
      showPopup(err.message || "Failed to update password", "error")
      return false
    }
  }

  // ---------------------- DELETE PROFILE ----------------------
  const deleteProfile = async (id) => {
    try {
      const res = await fetch(`${BaseUrl}/api/user/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Delete failed")

      showPopup("Profile deleted", "success")
      setUser(null)
      setIsLoggedIn(false)
      return true
    } catch (err) {
      showPopup(err.message || "Failed to delete profile", "error")
      return false
    }
  }

  // ---------------------- UPDATE ROLE TO AGENT ----------------------
  const updateRoleToAgent = async () => {
    try {
      const res = await fetch(`${BaseUrl}/api/user/update-role`, {
        method: "PUT",
        credentials: "include",
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Role update failed")

      setUser(data.user)
      showPopup("Role updated to delivery agent", "success")
      return true
    } catch (err) {
      showPopup(err.message || "Failed to update role", "error")
      return false
    }
  }

  // ---------------------- On Mount ----------------------
 useEffect(() => {
   if (!user) {
     getMe();
   }
 }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        authError,
        register,
        login,
        logout,
        getMe,
        updateProfile,
        changePassword,
        deleteProfile,
        updateRoleToAgent,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
