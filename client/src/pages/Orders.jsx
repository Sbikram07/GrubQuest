"use client"

import { useEffect, useState } from "react"
import Navbar1 from "@/components/Navbar1"
import { Button } from "@/components/ui/button"
import { useOrder } from "@/context/OrderContext"
import { useAuth } from "@/context/AuthContext"
import OrderTracker from "@/components/OrderTracker"

export default function Orders() {
  const { orders, fetchMyOrders, cancelOrder, loading } = useOrder()
  const { user } = useAuth()
const [trackingOrderId, setTrackingOrderId] = useState(null);
  useEffect(() => {
    if (user) {
      fetchMyOrders()
    }
  }, [user])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "placed":
        return "bg-yellow-100 text-yellow-800"
      case "preparing":
        return "bg-orange-100 text-orange-800"
      case "ready":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const canCancelOrder = (status) => {
    return status?.toLowerCase() === "placed" || status?.toLowerCase() === "preparing"
  }

  if (loading) {
    return (
      <>
        <Navbar1 />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Navbar1 />
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
          <p className="text-gray-500">Please login to view your orders</p>
          <Button onClick={() => (window.location.href = "/login")} className="mt-4">
            Login
          </Button>
        </div>
      </>
    )
  }

  if (orders.length === 0) {
    return (
      <>
        <Navbar1 />
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
          <p className="text-gray-500">No orders found</p>
          <Button onClick={() => (window.location.href = "/home")} className="mt-4">
            Start Shopping
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar1 />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-6 border"
            >
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Order #{order._id.slice(-8)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus?.replace("_", " ").toUpperCase() ||
                      "PENDING"}
                  </span>
                  <p className="text-lg font-bold mt-1">₹{order.totalPrice}</p>
                </div>
              </div>

              {/* Restaurant Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="font-medium">
                  {order.restaurant?.name || "Restaurant"}
                </p>
                <p className="text-sm text-gray-600">
                  {order.restaurant?.address || "Address not available"}
                </p>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="font-medium mb-2">Items:</h4>
                <div className="space-y-2">
                  {order.items?.map((orderItem, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        {orderItem.item?.image?.url && (
                          <img
                            src={orderItem.item.image.url || "/placeholder.svg"}
                            alt={orderItem.item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium">
                            {orderItem.item?.name || "Item"}
                          </p>
                          <p className="text-sm text-gray-500">
                            ₹{orderItem.item?.price || 0} × {orderItem.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">
                        ₹{(orderItem.item?.price || 0) * orderItem.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-4 p-3 bg-blue-50 rounded">
                <p className="font-medium text-sm">Delivery Address:</p>
                <p className="text-sm">{order.deliveryAddress}</p>
              </div>

              {/* Payment Status */}
              <div className="mb-4">
                <p className="text-sm">
                  <span className="font-medium">Payment Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      order.paymentStatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.paymentStatus === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.paymentStatus?.toUpperCase() || "PENDING"}
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                {canCancelOrder(order.orderStatus) && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => cancelOrder(order._id)}
                    disabled={loading}
                  >
                    Cancel Order
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTrackingOrderId(order._id)}
                >
                  Track Order
                </Button>
                {order.orderStatus?.toLowerCase() === "delivered" && (
                  <Button variant="outline" size="sm">
                    Reorder
                  </Button>
                )}
              </div>
              {trackingOrderId === order._id && (
                <OrderTracker
                  orderId={order._id}
                  currentStage={order.orderStatus} // e.g., "cancelled" or other stage
                  // only supply cancelledFrom if the order was cancelled and you know the prior stage
                  {...(order.orderStatus === "cancelled" && order.cancelledFrom
                    ? { cancelledFrom: order.cancelledFrom }
                    : {})}
                  onClose={() => setTrackingOrderId(null)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
