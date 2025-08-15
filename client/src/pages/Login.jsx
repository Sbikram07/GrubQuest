import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react";
const Login = () => {
  const {login,loading }=useAuth()
  const navigate=useNavigate();
  const [formData,setFormData]=useState({
    email:"",
    password:""
  })
   const handleChange = (e) => {
     setFormData((prev) => ({
       ...prev,
       [e.target.name]: e.target.value,
     }));
   };
  
 const handleSubmit = async (e) => {
   e.preventDefault();

   if (!formData.email || !formData.password) {
     return alert("All fields are mandatory");
   }

   try {
     const success = await login({
       email: formData.email,
       password: formData.password,
     });

     if (success) {
       navigate("/");
     } 
   } catch (err) {
     console.error("Login failed", err);
     window.location.reload();
   }
 };


  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-yellow-400 to-red-500 px-4">
      <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/dot-grid.png')] opacity-55"></div>
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-20 bg-white/80 hover:bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md border border-gray-300 transition-all duration-200 flex items-center"
      >
        <ArrowLeft className="mr-2 h-5 w-5" /> Back
      </button>
      <div className="relative z-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-black p-8 rounded-xl shadow-md w-full max-w-md space-y-4 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-center">
            Welcome Back to GrubQuest
          </h2>

          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>

          <p className="text-sm text-center text-gray-400 mt-2">
            Don’t have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
export default Login
