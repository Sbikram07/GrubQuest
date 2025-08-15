"use client"

import { ShoppingCart, Star } from "lucide-react"
import { useCart } from "../hooks/useCart"
import { usePopup } from "@/context/PopupContext"

export default function ItemCard({
  id,
  name,
  description,
  price,
  imageUrl,
  rating,
  restaurantName,
  restaurantId,
  quantity = 1,
  setQuantity,
  onAddToCart,
  onClick,
}) {
  const { addToCart } = useCart()
const {showPopup}=usePopup()
  const handleAddToCart = (e) => {
    e.stopPropagation() // Prevent card click when clicking add to cart

    const cartItem = {
      id,
      name,
      description,
      price,
      image: imageUrl,
      restaurantName,
      restaurantId,
      quantity,
    }

    // Use the hook's addToCart method
    addToCart(cartItem)

    // Call the onAddToCart callback if provided
    if (onAddToCart) {
      onAddToCart(id)
    }

    // Show success message (you can replace with a toast)
    showPopup("Added to your cart")
  }

  const handleQuantityChange = (newQuantity, operation) => {
    if (operation === "decrease" && newQuantity < 1) return
    if (setQuantity) {
      setQuantity(id, newQuantity)
    }
  }

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition duration-300 w-full max-w-sm"
      onClick={onClick}
    >
      {/* Image Section with Rating */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-orange-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow">
          <Star className="w-4 h-4 text-yellow-500" />
          {rating || 4.5}
        </div>
      </div>

      {/* Details Section */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        <span className="text-md font-semibold text-orange-600 block">₹{price}</span>

        {/* Quantity and Add to Cart */}
        <div className="flex justify-between items-center mt-3">
          {/* Quantity */}
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleQuantityChange(quantity - 1, "decrease")
              }}
              aria-label="Decrease quantity"
              className="text-lg font-bold text-gray-600 hover:text-gray-800"
            >
              −
            </button>

            <span className="text-sm font-medium min-w-[20px] text-center">{quantity}</span>

            <button
              onClick={(e) => {
                e.stopPropagation()
                handleQuantityChange(quantity + 1, "increase")
              }}
              className="text-lg font-bold text-gray-600 hover:text-gray-800"
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1 bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition text-sm font-medium"
          >
            <ShoppingCart size={16} /> Add to Cart
          </button>
        </div>

        {/* Restaurant Name */}
        <p className="text-xs text-gray-400 mt-2 truncate">{restaurantName}</p>
      </div>
    </div>
  )
}
