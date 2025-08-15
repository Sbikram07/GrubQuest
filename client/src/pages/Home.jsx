"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar1 from "@/components/Navbar1"
import ItemCard from "@/components/ItemCard"
import RestaurantCard from "@/components/RestaurantCard"
import SearchBanner from "@/components/SearchComponent"
import { useRestaurant } from "@/context/RestaurantContext"
import { useItem } from "@/context/ItemContext"

export default function Home() {
  const navigate = useNavigate()
  const { items, allItem, loading: itemsLoading } = useItem()
  const { restaurants, loading: restaurantsLoading } = useRestaurant()

  const [showAllItems, setShowAllItems] = useState(false)
  const [showAllRestaurants, setShowAllRestaurants] = useState(false)
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    allItem()
  }, [])

  const setQuantity = (id, qty) => {
    setQuantities((prev) => ({ ...prev, [id]: qty }))
  }

  const handleAddToCart = (id) => {
    const qty = quantities[id] || 1
    console.log(`Added ${qty} of item ${id} to cart`)
    // The actual cart logic is handled in ItemCard component
  }

  if (itemsLoading || restaurantsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-rose-100">
        <Navbar1 />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading delicious food...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-rose-100">
      <Navbar1 />
      <SearchBanner />

      {/* 🥘 Featured Items */}
      <section className="py-6 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-black font-handwritten">Popular Dishes</h2>
          <button
            onClick={() => setShowAllItems(!showAllItems)}
            className="px-6 py-2 rounded-full border-2 border-black text-black font-handwritten hover:bg-black hover:text-white transition"
          >
            {showAllItems ? "Show less" : "Explore all →"}
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No items available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {(showAllItems ? items : items.slice(0, 8)).map((item) => (
              <ItemCard
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                imageUrl={item.image?.url}
                restaurantName={item.restaurant?.name}
                restaurantId={item.restaurant?._id}
                rating={item.rating || "Not rated"}
                quantity={quantities[item._id] || 1}
                setQuantity={setQuantity}
                onAddToCart={handleAddToCart}
                onClick={() => navigate(`/item/${item._id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 🍽️ Featured Restaurants */}
      <section className="py-6 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-black font-handwritten">Popular Restaurants</h2>
          <button
            onClick={() => setShowAllRestaurants(!showAllRestaurants)}
            className="px-6 py-2 rounded-full border-2 border-black text-black font-handwritten hover:bg-black hover:text-white transition"
          >
            {showAllRestaurants ? "Show less" : "Explore all →"}
          </button>
        </div>

        {restaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No restaurants available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {(showAllRestaurants ? restaurants : restaurants.slice(0, 6)).map((restaurant) => (
              <RestaurantCard
                key={restaurant._id}
                name={restaurant.name}
                imageUrl={restaurant.image?.url}
                rating={restaurant.rating || "Not rated"}
                location={restaurant.address}
                tags={restaurant.tags || ["Indian", "South Indian"]}
                onClick={() => navigate(`/restaurant/${restaurant._id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
