

import React, {  useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useCheckout } from "@/hooks/useCheckout";

const Success = () => {
    const navigate = useNavigate();
    const {handlePlaceOrder}=useCheckout()
    useEffect(() => {
        handlePlaceOrder();
        setTimeout(() => {
            navigate("/home");
        }, 3000);
        
    })

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-zinc-200 px-4">
      {/* Card */}
      <div className="relative w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden animate-fadeIn">
        {/* Top bar */}
        <div className="w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>

        {/* Content */}
        <div className="flex flex-col items-center text-center p-6 sm:p-8">
          {/* Image with animation */}
          <div className="w-32 sm:w-40 mb-4 animate-bounceSlow">
            <img
              src="/success.svg"
              alt="success"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Text */}
          <h1 className="text-xl sm:text-2xl font-bold text-slate-700 mb-2">
            Payment Successful
          </h1>

          <p className="text-sm sm:text-base text-slate-500 mb-6">
            Your order has been placed successfully.
            <br />
            Thank you for shopping with us!
          </p>

          {/* Button */}
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full shadow-md transition-all duration-300 hover:scale-105"
            onClick={() => navigate("/home")}
            
          >
            Go to Home
          </button>
        </div>
      </div>

      {/* Custom Animations */}
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-in-out;
          }

          .animate-bounceSlow {
            animation: bounceSlow 2.5s infinite;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounceSlow {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Success;