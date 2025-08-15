"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { ArrowLeft } from "lucide-react";
const Register = () => {
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password) {
      alert("All fields are required")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long")
      return
    }

    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    })

    if (success) {
      navigate("/home")
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-yellow-400 to-red-500 px-4">
      <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/dot-grid.png')] opacity-55"></div>
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-20 bg-white/80 hover:bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md border border-gray-300 transition-all duration-200 flex items-center"
      >
        <ArrowLeft className="mr-2 h-5 w-5" /> Back
      </button>

      <div className="relative z-10 ">
        {/* Back Button */}

        <form
          onSubmit={handleSubmit}
          className="bg-white/90 dark:bg-black p-8 rounded-xl shadow-md w-full max-w-md space-y-4 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-center">
            Create Your GrubQuest Account
          </h2>

          <Input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>

          <p className="text-sm text-center text-gray-400 mt-2">
            Already have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Log in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register
