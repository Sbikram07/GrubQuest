import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { BrowserRouter } from "react-router-dom"
import { PopupProvider } from "./context/PopupContext"
import { AuthProvider } from "./context/AuthContext"
import { RestaurantProvider } from "./context/RestaurantContext"
import { RestaurantOrderProvider } from "./context/RestaurantOrderContext"
import { ItemProvider } from "./context/ItemContext"
import { OrderProvider } from "./context/OrderContext"
import { DeliveryAgentProvider } from "./context/DeliveryAgentContext"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <PopupProvider>
        <AuthProvider>
          <RestaurantProvider>
            <RestaurantOrderProvider>
              <ItemProvider>
                <OrderProvider>
                  <DeliveryAgentProvider>
                    <App />
                  </DeliveryAgentProvider>
                </OrderProvider>
              </ItemProvider>
            </RestaurantOrderProvider>
          </RestaurantProvider>
        </AuthProvider>
      </PopupProvider>
    </BrowserRouter>
  </StrictMode>,
)
