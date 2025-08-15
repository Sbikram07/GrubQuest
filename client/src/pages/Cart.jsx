"use client"
import { Button } from "@/components/ui/button"
import Navbar1 from "@/components/Navbar1"
import { useOrder } from "@/context/OrderContext"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "../hooks/useCart"
import { useState } from "react"

export default function Cart() {
  const { placeOrder, loading } = useOrder()
  const { user } = useAuth()
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart()
  const [deliveryAddress, setDeliveryAddress] = useState("")

  const totalAmount = getCartTotal()

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Please login to place order")
      return
    }

    if (!deliveryAddress.trim()) {
      alert("Please enter delivery address")
      return
    }

    if (cartItems.length === 0) {
      alert("Cart is empty")
      return
    }

    // Group items by restaurant
    const ordersByRestaurant = {}
    cartItems.forEach((item) => {
      const restaurantId = item.restaurantId
      if (!ordersByRestaurant[restaurantId]) {
        ordersByRestaurant[restaurantId] = []
      }
      ordersByRestaurant[restaurantId].push({
        itemId: item.id,
        quantity: item.quantity,
        price: item.price,
      })
    })

    // Place orders for each restaurant
    try {
      for (const [restaurantId, items] of Object.entries(ordersByRestaurant)) {
        await placeOrder({
          restaurantId,
          items,
          deliveryAddress,
        })
      }

      // Clear cart after successful order
      clearCart()
    } catch (error) {
      console.error("Failed to place order:", error)
    }
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar1 />
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <p className="text-gray-500 text-lg">Your cart is empty</p>
          <Button onClick={() => (window.location.href = "/home")} className="mt-4">
            Continue Shopping
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar1 />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {/* Delivery Address */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium mb-2">Delivery Address *</label>
          <textarea
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Enter your complete delivery address..."
            className="w-full p-3 border rounded-lg resize-none"
            rows={3}
            required
          />
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[80px_1fr_100px_120px_100px_80px] gap-6 text-sm font-semibold text-gray-500 border-b pb-2 mb-4">
          <div>Image</div>
          <div>Item</div>
          <div className="text-center">Price</div>
          <div className="text-center">Quantity</div>
          <div className="text-center">Amount</div>
          <div className="text-center">Action</div>
        </div>

        {/* Cart Items */}
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[80px_1fr_100px_120px_100px_80px] gap-6 items-center py-4 border-b"
          >
            <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-16 h-16 object-cover rounded" />
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.restaurantName}</p>
            </div>
            <p className="text-center">₹{item.price}</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
              >
                −
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
              >
                +
              </button>
            </div>
            <p className="text-center font-medium">₹{item.price * item.quantity}</p>
            <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-center">
              ✕
            </button>
          </div>
        ))}

        {/* Summary */}
        <div className="flex justify-end mt-8">
          <div className="bg-gray-50 p-6 rounded-lg w-full max-w-sm shadow">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>₹40</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>₹{totalAmount + 40}</span>
              </div>
            </div>
            <Button onClick={handlePlaceOrder} className="w-full" disabled={loading || !deliveryAddress.trim()}>
              {loading ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
