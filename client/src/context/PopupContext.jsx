// src/context/PopupContext.jsx

import { createContext, useContext, useState, useEffect } from "react";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [popup, setPopup] = useState({
    message: "",
    type: "info", // "success", "error", "info"
    visible: false,
  });

  const showPopup = (message, type = "info") => {
    setPopup({ message, type, visible: true });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setPopup((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  return (
    <PopupContext.Provider value={{ showPopup }}>
      {children}
      {popup.visible && (
        <div className={`fixed top-5 right-5 z-50`}>
          <div
            className={`px-4 py-2 rounded shadow text-white text-sm font-medium transition-all duration-300
              ${popup.type === "success" ? "bg-green-500" : ""}
              ${popup.type === "error" ? "bg-red-500" : ""}
              ${popup.type === "info" ? "bg-blue-500" : ""}`}
          >
            {popup.message}
          </div>
        </div>
      )}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
