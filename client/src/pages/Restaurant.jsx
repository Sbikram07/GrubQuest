"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar1 from "@/components/Navbar1";
import ItemCard from "@/components/ItemCard";
import ReviewCard from "@/components/ReviewCard";
import AddReview from "@/components/AddReview";
import { useRestaurant } from "@/context/RestaurantContext";
import { useItem } from "@/context/ItemContext";
import { useAuth } from "@/context/AuthContext";
const BaseUrl = import.meta.env.VITE_BASE_API_URL;

const Restaurant = () => {
  const { id } = useParams();
  const { restaurant, getRestaurant } = useRestaurant();
  const { items, fetchItemsByRestaurant, addReview } = useItem();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    console.log("🔁 useEffect triggered with id:", id);
    getRestaurant(id);
    fetchItemsByRestaurant(id);
    fetchReviews();
  }, [id]);

  useEffect(() => {
    // Filter items based on search query
    if (searchQuery.trim()) {
      const filtered = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [items, searchQuery]);

  // Fetch reviews for restaurant
  const fetchReviews = async () => {
    try {
      const res = await fetch(`${BaseUrl}/api/review/restaurant/${id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      if (data.success) {
        setReviews(data.data || []);
       
      }
    } catch (err) {
      console.error("Error fetching reviews", err);
    }
  };

  // Submit a review for restaurant
  const handleReviewSubmit = async (review) => {
    if (!user) {
      alert("Please login to add a review");
      return;
    }

    try {

      const reviewData = {
        restaurantId: id,
        rating: review.rating,
        comment: review.text,
      };
      const res=await addReview(reviewData);
      const data = await res.json();
      if (data.success) {
        fetchReviews(); // Refresh reviews
      }
    } catch (err) {
      console.error("Error adding review", err);
    }
  };

  if (!restaurant) {
    return (
      <>
        <Navbar1 />
        <div className="p-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading restaurant details...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar1 />

      {/* Hero Banner */}
      <div
        className="h-[300px] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${restaurant.image?.url})` }}
      >
        <div className="bg-black/50 h-full w-full flex flex-col justify-end p-6 text-white">
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <p>{restaurant.address}</p>
          <p className="text-sm">{restaurant.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-yellow-400">⭐</span>
            <span>{restaurant.rating || 4.0}/5</span>
            <span className="text-sm">({reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Menu ({filteredItems.length} items)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <ItemCard
                key={item._id}
                id={item._id}
                name={item.name}
                price={item.price}
                description={item.description}
                imageUrl={item.image?.url}
                restaurantName={restaurant.name}
                restaurantId={restaurant._id}
                rating={item.rating}
                onClick={() => (window.location.href = `/item/${item._id}`)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">
                {searchQuery
                  ? "No items found matching your search."
                  : "No items available."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Review Section */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {reviews.map((review) => (
              <ReviewCard
                key={review._id}
                user={review.user?.name || "Anonymous"}
                comment={review.comment}
                rating={review.rating}
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
            <button
              onClick={() => (window.location.href = "/login")}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Restaurant;
