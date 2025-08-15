"use client"

import { useState, useEffect } from "react"

const CART_STORAGE_KEY = "grubquest_cart"

export const useCart = () => {
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)

  // Load cart from localStorage
  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      const cart = savedCart ? JSON.parse(savedCart) : []
      setCartItems(cart)

      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(totalItems)

      return cart
    } catch (error) {
      console.error("Error loading cart:", error)
      return []
    }
  }

  // Save cart to localStorage
  const saveCart = (cart) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
      setCartItems(cart)

      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(totalItems)

      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cart }))
    } catch (error) {
      console.error("Error saving cart:", error)
    }
  }

  // Add item to cart
  const addToCart = (item) => {
    const currentCart = loadCart()
    const existingItemIndex = currentCart.findIndex((cartItem) => cartItem.id === item.id)

    let updatedCart
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      updatedCart = currentCart.map((cartItem, index) =>
        index === existingItemIndex ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) } : cartItem,
      )
    } else {
      // Add new item
      updatedCart = [...currentCart, { ...item, quantity: item.quantity || 1 }]
    }

    saveCart(updatedCart)
    return updatedCart
  }

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    const currentCart = loadCart()

    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }

    const updatedCart = currentCart.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))

    saveCart(updatedCart)
  }

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const currentCart = loadCart()
    const updatedCart = currentCart.filter((item) => item.id !== itemId)
    saveCart(updatedCart)
  }

  // Clear entire cart
  const clearCart = () => {
    saveCart([])
  }

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  // Initialize cart on mount
  useEffect(() => {
    loadCart()

    // Listen for storage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === CART_STORAGE_KEY) {
        loadCart()
      }
    }

    // Listen for cart update events
    const handleCartUpdate = () => {
      loadCart()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("cartUpdated", handleCartUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

  return {
    cartItems,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    loadCart,
  }
}
