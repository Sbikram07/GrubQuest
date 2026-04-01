import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Canceled = () => {
    const navigator = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigator("/home");
        }, 3000);
    }, [])
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-200 px-4">
      {/* Card */}
      <div className="relative w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden animate-fadeIn">
        {/* Top bar */}
        <div className="w-full h-2 bg-gradient-to-r from-red-400 to-red-600"></div>

        {/* Content */}
        <div className="flex flex-col items-center text-center p-6 sm:p-8">
          {/* Image */}
          <div className="w-32 sm:w-40 mb-4 animate-shake">
            <img
              src="/canceled.svg"
              alt="payment failed"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Heading */}
          <h1 className="text-xl sm:text-2xl font-bold text-red-600 mb-2">
            Payment Failed 
          </h1>

          {/* Message */}
          <p className="text-sm sm:text-base text-slate-500 mb-6">
            Oops! Your payment could not be completed. <br />
            Please try again or use a different payment method.
          </p>

          {/* Buttons */}
          <div className="flex gap-3 flex-col sm:flex-row w-full justify-center">
            {/* Retry */}
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full shadow-md transition-all duration-300 hover:scale-105" onClick={()=>navigator("/cart")}>
              Retry Payment
            </button>

            {/* Home */}
            <button className="border border-gray-300 text-gray-600 px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-300" onClick={()=>navigator("/home")}>
              Go Home
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-in-out;
          }

          .animate-shake {
            animation: shake 0.6s ease-in-out;
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

          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            50% { transform: translateX(6px); }
            75% { transform: translateX(-6px); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Canceled;
