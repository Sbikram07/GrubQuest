"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRestaurantOrders } from "@/context/RestaurantOrderContext"

const RestaurantOrdersPanel = ({ restaurantId }) => {
  const { restaurantOrders, ordersStats, ordersLoading, ordersError, allOrders, updateOrderStatus } =
    useRestaurantOrders()

  const [orderFilters, setOrderFilters] = useState({
    status: "",
    search: "",
  })

  useEffect(() => {
    if (restaurantId) {
      allOrders(restaurantId, orderFilters)
    }
  }, [restaurantId, orderFilters])

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      // Refresh orders after status update
      allOrders(restaurantId, orderFilters)
    } catch (error) {
      console.error("Failed to update order status:", error)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "placed":
        return "bg-yellow-100 text-yellow-800"
      case "preparing":
        return "bg-orange-100 text-orange-800"
      case "ready":
        return "bg-blue-100 text-blue-800"
      case "picked":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNextStatus = (currentStatus) => {
    switch (currentStatus?.toLowerCase()) {
      case "placed":
        return "preparing"
      case "preparing":
        return "ready"
      case "ready":
        return null
      default:
        return null
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h2 className="text-lg font-bold">Recent Orders</h2>
          <p className="text-sm text-gray-500">
            Orders placed to this restaurant
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={orderFilters.status}
            onChange={(e) =>
              setOrderFilters((f) => ({ ...f, status: e.target.value }))
            }
            className="p-2 border rounded"
          >
            <option value="">All Statuses</option>
            <option value="placed">Placed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="picked">Picked</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input
            type="text"
            placeholder="Search by order ID or customer"
            value={orderFilters.search}
            onChange={(e) =>
              setOrderFilters((f) => ({ ...f, search: e.target.value }))
            }
            className="p-2 border rounded"
          />
        </div>
      </div>

      {/* Stats */}
      {ordersStats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-100 rounded p-3 text-center">
            <p className="text-sm font-medium">Total Orders</p>
            <p className="text-2xl font-bold">{ordersStats.totalOrders}</p>
          </div>
          <div className="bg-gray-100 rounded p-3 text-center">
            <p className="text-sm font-medium">Revenue</p>
            <p className="text-2xl font-bold">
              ₹{ordersStats.totalRevenue?.toFixed(2) || "0.00"}
            </p>
          </div>
          <div className="bg-gray-100 rounded p-3 text-center">
            <p className="text-sm font-medium">By Status</p>
            <div className="text-xs mt-1">
              {ordersStats.byStatus &&
                Object.entries(ordersStats.byStatus).map(([status, info]) => (
                  <div key={status}>
                    {status}: {info.count} (
                    {info.revenue ? `₹${info.revenue.toFixed(2)}` : "₹0.00"})
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading / Error */}
      {ordersLoading && <p className="text-center py-4">Loading orders...</p>}
      {ordersError && (
        <p className="text-center text-red-600 py-2">{ordersError}</p>
      )}

      {/* Orders List */}
      {!ordersLoading && restaurantOrders.length === 0 && (
        <p className="text-gray-500">
          No orders found for the current filters.
        </p>
      )}

      <div className="space-y-4">
        {restaurantOrders.map((order) => (
          <div
            key={order._id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center border rounded p-4 gap-4"
          >
            <div className="flex-1 space-y-1">
              <p>
                <strong>Order ID:</strong> {order._id.slice(-8)}
              </p>
              <p>
                <strong>Customer:</strong> {order.customer?.name || "—"}
              </p>
              <p>
                <strong>Phone:</strong> {order.customer?.phone || "—"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus?.toUpperCase()}
                </span>
              </p>
              <p>
                <strong>Total:</strong> ₹
                {order.totalPrice?.toFixed(2) || "0.00"}
              </p>
              <p>
                <strong>Placed At:</strong>{" "}
                {new Date(order.createdAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}
              </p>
              <p>
                <strong>Delivery Address:</strong> {order.deliveryAddress}
              </p>

              {/* Order Items */}
              <div className="mt-2">
                <strong>Items:</strong>
                <div className="ml-4 text-sm">
                  {order.items?.map((item, index) => (
                    <div key={index}>
                      {item.item?.name || "Item"} × {item.quantity} = ₹
                      {((item.item?.price || 0) * item.quantity).toFixed(2)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {getNextStatus(order.orderStatus) && ( 
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(order._id, getNextStatus(order.orderStatus))}
                  disabled={ordersLoading}
                >
                  Mark as{" "}
                  {getNextStatus(order.orderStatus)?.charAt(0).toUpperCase() +
                    getNextStatus(order.orderStatus)?.slice(1)}
                </Button>
                )}
                
              {order.orderStatus?.toLowerCase() === "placed" && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleStatusUpdate(order._id, "cancelled")}
                  disabled={ordersLoading}
                >
                  Cancel Order
                </Button>
              )}

              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantOrdersPanel
