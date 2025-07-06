import React from 'react'
import Navbar from '../components/layout/Navbar'
import QueryBar from '../components/home/QueryBar'
import FoodCarousel from '../components/home/FoodCarousel'
import FilterChips from '../components/home/FilterChips'
import FoodGrid from '../components/home/FoodGrid'
import restaurantData from "./../data/repeated_image_restaurants.json";
import reviews from "./../data/review.json";
import RestaurantCarousel from '../components/home/RestaurantCarousel'
import ReviewCarousel from '../components/home/ReviewCarousel'
import About from "../components/home/About";
import Contact from "../components/home/Contact";
const Home = () => {
  return (
    <>
    <div>
      <Navbar/>
      <QueryBar/>

     <FoodCarousel/>
     <FilterChips/>
     <FoodGrid/>
      <div className="bg-gray-50 min-h-100">
      <h1 className="text-2xl font-bold text-center py-6">Popular Restaurants</h1>
      <RestaurantCarousel restaurants={restaurantData} />
    </div>
    <div className="max-w-full mx-auto">
      <ReviewCarousel reviews={reviews}/>
    </div>
    </div>
    <About/>
    <Contact/>
  </>
  )
}

export default Home