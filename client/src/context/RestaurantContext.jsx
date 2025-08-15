"use client";
import { createContext, useContext, useEffect, useState } from "react";
const BaseUrl = import.meta.env.VITE_BASE_API_URL;
import { usePopup } from "./PopupContext";
import { useAuth } from "./AuthContext";

const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ownedRestaurants, setOwnedRestaurants] = useState([]);
  const [RestaurantOrders, setRestaurantOrder] = useState([]);

  const { token } = useAuth();
  const { showPopup } = usePopup();

  // Helper: fetch wrapper
  const handleResponse = async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Something went wrong");
    return data;
  };

  const addRestaurant = async (formData) => {
    try {
      setLoading(true);
    
      const res = await fetch(`${BaseUrl}/api/restaurants/create`, {
        method: "POST",
        credentials: "include", // ✅ required if using cookie auth
        body: formData,
      });

      const result = await handleResponse(res);
      showPopup("Restaurant added successfully");
      setRestaurants((prev) => [...prev, result.data]); // not result.restaurant
    } catch (err) {
      showPopup(err.message || "Failed to add restaurant");
    } finally {
      setLoading(false);
    }
  };

  // Get all restaurants
  const getAllRestaurants = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BaseUrl}/api/restaurants/getall`, {
        method: "GET",
        credentials: "include",
      });
      const data = await handleResponse(res);
      setRestaurants(data.data);
    } catch (err) {
      showPopup(err.message || "Failed to fetch restaurants");
    } finally {
      setLoading(false);
    }
  };

  // Get one restaurant by ID
  const getRestaurant = async (id) => {
    try {
      setLoading(true);
    
      const res = await fetch(`${BaseUrl}/api/restaurants/get/${id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await handleResponse(res);
      setRestaurant(data.data);
    } catch (err) {
      showPopup(err.message || "Failed to fetch restaurant");
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnedRestaurants = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BaseUrl}/api/restaurants/getby/owned`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || "Failed to fetch restaurants");

      setOwnedRestaurants(data.data);
    } catch (err) {
      console.error(err);
      showPopup(err.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  // Update restaurant
  const updateRestaurant = async (id, formData) => {
    try {
      setLoading(true);
      const res = await fetch(`${BaseUrl}/api/restaurants/update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: formData,
      });
      const data = await handleResponse(res);
      showPopup("Restaurant updated successfully");
      setRestaurant(data.restaurant);
    } catch (err) {
      showPopup(err.message || "Failed to update restaurant");
    } finally {
      setLoading(false);
    }
  };

  // Delete restaurant
  const deleteRestaurant = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`${BaseUrl}/api/restaurants/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleResponse(res);
      showPopup("Restaurant deleted successfully");
      setRestaurants((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      showPopup(err.message || "Failed to delete restaurant");
    } finally {
      setLoading(false);
    }
  };

  const allOrders = async (restaurantID) => {
    try {
      setLoading(true);

      const res = fetch(`${BaseUrl}/api/order/restaurant/${restaurantID}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await handleResponse(res);
      setRestaurantOrder(data || [])
    } catch (err) {
      showPopup(err.message || "something unexpected happend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllRestaurants();
  }, []);

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        restaurant,
       RestaurantOrders,
        loading,
        addRestaurant,
        getAllRestaurants,
        getRestaurant,
        updateRestaurant,
        deleteRestaurant,
        ownedRestaurants,
        fetchOwnedRestaurants,
        allOrders
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => useContext(RestaurantContext);
