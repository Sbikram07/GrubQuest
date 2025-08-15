"use client"
import { useState } from "react"
import { Link } from "react-router-dom"
import { UserCircle2, ShoppingCart, Menu, X } from "lucide-react"
import { useCart } from "../hooks/useCart"

export default function Navbar1() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { cartCount } = useCart()

  return (
    <nav className="bg-white/10 backdrop-blur-md shadow-md sticky top-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-4 py-2 sm:py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="logo" className="w-9 h-9 sm:w-10 sm:h-10 object-cover rounded-xl" />
          <Link to="/" className="text-2xl font-bold text-orange-600">
            Grub<span className="text-red-500">Quest</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-20 text-shadow-slate-800 font-medium">
          <Link to="/home" className="hover:text-orange-500 transition">
            Home
          </Link>
          <Link to="/orders" className="hover:text-orange-500 transition">
            Orders
          </Link>
          <Link to="/cart" className="hover:text-orange-500 transition flex items-center gap-1 relative">
            <ShoppingCart className="w-5 h-5" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Right Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/profile">
            <UserCircle2 className="w-8 h-8 text-gray-700 hover:text-orange-500" />
          </Link>
        </div>

        {/* Hamburger Button (Mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 hover:text-orange-500 transition"
        >
          {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col items-center gap-4 text-gray-700 font-medium">
          <Link to="/home" onClick={() => setMenuOpen(false)} className="hover:text-orange-500 transition">
            Home
          </Link>
          <Link to="/orders" onClick={() => setMenuOpen(false)} className="hover:text-orange-500 transition">
            Orders
          </Link>
          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className="hover:text-orange-500 transition flex items-center gap-1 relative"
          >
            <ShoppingCart className="w-5 h-5" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className="hover:text-orange-500 transition flex items-center gap-1"
          >
            <UserCircle2 className="w-6 h-6" />
            Profile
          </Link>
        </div>
      )}
    </nav>
  )
}
