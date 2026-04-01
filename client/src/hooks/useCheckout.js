

import { useCart } from "./useCart";
import { useAuth } from "@/context/AuthContext";
import { useOrder } from "@/context/OrderContext";

export const useCheckout = () =>{
      const { cartItems,getAddress,clearAddress,clearCart } = useCart()
      const { user } = useAuth()
      const { placeOrder } = useOrder()

    const handlePlaceOrder = async () => {
        const deliveryAddress = getAddress();
      if (!user) {
        alert("Please login to place order");
        return;
      }

      if (!deliveryAddress.trim()) {
        alert("Please enter delivery address");
        return;
      }

      if (cartItems.length === 0) {
        alert("Cart is empty");
        return;
      }

      // Group items by restaurant
      const ordersByRestaurant = {};
      cartItems.forEach((item) => {
        const restaurantId = item.restaurantId;
        if (!ordersByRestaurant[restaurantId]) {
          ordersByRestaurant[restaurantId] = [];
        }
        ordersByRestaurant[restaurantId].push({
          itemId: item.id,
          quantity: item.quantity,
          price: item.price,
        });
      });

      // Place orders for each restaurant
      try {
        for (const [restaurantId, items] of Object.entries(
          ordersByRestaurant,
        )) {
          await placeOrder({
            restaurantId,
            items,
            deliveryAddress,
          });
        }

        // Clear cart after successful order
        clearCart();
        clearAddress();

      } catch (error) {
        console.error("Failed to place order:", error);
      }
    };
    return {handlePlaceOrder}
}