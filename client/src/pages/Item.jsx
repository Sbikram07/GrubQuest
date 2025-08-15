"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar1 from "@/components/Navbar1"
import ReviewCard from "@/components/ReviewCard"
import { Button } from "@/components/ui/button"
import AddReview from "@/components/AddReview"
import { useItem } from "@/context/ItemContext"
import { useCart } from "../hooks/useCart"
import { useAuth } from "@/context/AuthContext"

const Item = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getItemById, loading, reviews, getAllReview, addReview } = useItem()
  const { addToCart } = useCart()
  const { user } = useAuth()

  const [item, setItem] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchItem = async () => {
      const fetchedItem = await getItemById(id)
      if (fetchedItem) {
        setItem(fetchedItem)
      }
    }
    fetchItem()
    getAllReview(id)
  }, [id])

  const handleAddToCart = () => {
    if (!item) return

    const cartItem = {
      id: item._id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image?.url,
      restaurantName: item.restaurant?.name,
      restaurantId: item.restaurant?._id,
      quantity,
    }

    addToCart(cartItem)
    alert(`${item.name} added to cart!`)
  }

  const handleReviewSubmit = async (review) => {
    if (!user) {
      alert("Please login to add a review")
      return
    }

    const reviewData = {
      itemId: item._id,
      rating: review.rating,
      comment: review.text,
    }

    const result = await addReview(reviewData)
    if (result) {
      // Refresh reviews
      getAllReview(id)
    }
  }

  if (loading || !item) {
    return (
      <>
        <Navbar1 />
        <div className="max-w-5xl mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading item details...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar1 />
      <div className="max-w-5xl mx-auto p-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded shadow transition"
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={item.image?.url || "/placeholder.svg"}
            alt={item.name}
            className="w-full h-[400px] object-cover"
          />

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2 space-y-4">
                <h1 className="text-3xl font-bold text-gray-800">
                  {item.name}
                </h1>
                <p className="text-gray-600 text-lg">{item.description}</p>
                <p className="text-2xl font-bold text-orange-600">
                  ₹{item.price}
                </p>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.category === "veg"
                        ? "bg-green-100 text-green-800"
                        : item.category === "non-veg"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {item.category === "veg"
                      ? "🌱 Vegetarian"
                      : item.category === "non-veg"
                      ? "🍖 Non-Vegetarian"
                      : `📦 ${item.category}`}
                  </span>
                  {item.rating && (
                    <span className="flex items-center gap-1 text-yellow-500">
                      ⭐ {item.rating}/5
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Restaurant:
                  </h3>
                  <button
                    onClick={() =>
                      navigate(`/restaurant/${item.restaurant?._id}`)
                    }
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {item.restaurant?.name}
                  </button>
                  <p className="text-sm text-gray-500">
                    {item.restaurant?.address}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                    >
                      −
                    </button>
                    <span className="text-lg font-medium min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium">Total:</span>
                    <span className="text-xl font-bold text-orange-600">
                      ₹{item.price * quantity}
                    </span>
                  </div>
                  <Button onClick={handleAddToCart} className="w-full">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Reviews</h2>

          {reviews && reviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  user={review.user?.name || "Anonymous"}
                  rating={review.rating}
                  comment={review.comment}
                  date={new Date(review.createdAt).toLocaleDateString()}
                  avatarUrl={
                    review.user?.avatar?.url ||
                    "https://res.cloudinary.com/dhiv7nn03/image/upload/v1753718550/GrubQuest/restaurants/rryvhejlcq826gpoklv0.jpg"
                  }
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-8">
              No reviews yet. Be the first to review!
            </p>
          )}

          {user ? (
            <AddReview onSubmit={handleReviewSubmit} />
          ) : (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-2">Please login to add a review</p>
              <Button onClick={() => navigate("/login")}>Login</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Item
