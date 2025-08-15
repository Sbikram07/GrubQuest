

import Navbar1 from "@/components/Navbar1";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useDeliveryAgent } from "@/context/DeliveryAgentContext";

export default function AgentDashboard() {
  const { user } = useAuth();
  const {
    agentData,
    assignedOrders,
    pickedOrders,
    stats,
    loading,
    getAgentDashboard,
    updateAvailability,
    pickupOrder,
    markAsDelivered,
    ordersAssigned,
  } = useDeliveryAgent();

  useEffect(() => {
    getAgentDashboard();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleAvailability = () => {
    if (!agentData) return;
    updateAvailability(!agentData.isActive);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar1 />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header / Agent Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Agent Info */}
          <Card className="p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Agent Details</h2>
              <p>
                <strong>Name:</strong> {agentData?.name || user?.name || "—"}
              </p>
              <p>
                <strong>Email:</strong> {agentData?.email || user?.email || "—"}
              </p>
              <p>
                <strong>Phone:</strong> {agentData?.phone || user?.phone || "—"}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    agentData?.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {agentData?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <Button onClick={handleToggleAvailability} size="sm">
                {agentData?.isActive ? "Go Offline" : "Go Online"}
              </Button>
            </div>
          </Card>

          {/* Stats */}
          <Card className="p-5 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Stats Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-100 rounded p-3 text-center">
                <p className="text-sm font-medium">Total Deliveries</p>
                <p className="text-2xl font-bold">
                  {stats?.totalDeliveries ?? 0}
                </p>
              </div>
              <div className="bg-gray-100 rounded p-3 text-center">
                <p className="text-sm font-medium">Earnings</p>
                <p className="text-2xl font-bold">
                  ₹{stats?.totalEarnings?.toFixed(2) ?? "0.00"}
                </p>
              </div>
              <div className="bg-gray-100 rounded p-3 text-center">
                <p className="text-sm font-medium">Active Orders</p>
                <p className="text-2xl font-bold">{stats?.activeOrders ?? 0}</p>
              </div>
            </div>
          </Card>

          {/* Loading / Quick Action Placeholder */}
          <Card className="p-5 flex flex-col justify-center items-center">
            {loading ? (
              <div className="text-center">
                <p className="mb-2 font-medium">Refreshing dashboard...</p>
                <div className="loader h-8 w-8 border-4 border-dashed rounded-full animate-spin border-gray-400" />
              </div>
            ) : (
              <div className="text-center">
                <p className="font-medium">Last synced:</p>
                <p className="text-sm text-gray-600">
                  {agentData?.lastSynced
                    ? new Date(agentData.lastSynced).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                      })
                    : "—"}
                </p>
                <Button onClick={getAgentDashboard} className="mt-3" size="sm">
                  Refresh
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Orders Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assigned Orders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Assigned Orders</h2>
              <span className="text-sm text-gray-500">
                {assignedOrders?.length || 0} order
                {assignedOrders && assignedOrders.length !== 1 && "s"}
              </span>
            </div>
            {assignedOrders && assignedOrders.length > 0 ? (
              <div className="space-y-3">
                {assignedOrders.map((order) => (
                  <Card
                    key={order._id}
                    className="p-4 flex flex-col md:flex-row md:justify-between md:items-center"
                  >
                    <div className="space-y-1 flex-1">
                      <p>
                        <strong>Order ID:</strong> {order._id}
                      </p>
                      <p>
                        <strong>Restaurant:</strong> {order.restaurant.name}
                      </p>
                      <p>
                        <strong>Customer:</strong> {order.customer.name}
                      </p>
                      <p>
                        <strong>Restaurant Address:</strong>{" "}
                        {order.restaurant.address}
                      </p>
                    </div>
                    <div className="mt-3 md:mt-0">
                      <Button
                        onClick={() => pickupOrder(order._id)}
                        disabled={!agentData?.isActive}
                      >
                        Pickup
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-4">
                <p className="text-center text-gray-600">
                  No assigned orders currently.
                </p>
              </Card>
            )}
          </div>

          {/* Picked Orders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Picked Orders</h2>
              <span className="text-sm text-gray-500">
                {pickedOrders?.length || 0} order
                {pickedOrders && pickedOrders.length !== 1 && "s"}
              </span>
            </div>
            {pickedOrders && pickedOrders.length > 0 ? (
              <div className="space-y-3">
                {pickedOrders.map((order) => (
                  <Card
                    key={order._id}
                    className="p-4 flex flex-col md:flex-row md:justify-between md:items-center"
                  >
                    <div className="space-y-1 flex-1">
                      <p>
                        <strong>Order ID:</strong> {order._id}
                      </p>
                      <p>
                        <strong>Customer:</strong> {order.customer.name}
                      </p>
                      {order.phone && (
                        <p>
                          <strong>Phone:</strong> {order?.phone || "xxxxxx789"}
                        </p>
                      )}
                      <p>
                        <strong>Address:</strong> {order.deliveryAddress}
                      </p>
                    </div>
                    <div className="mt-3 md:mt-0">
                      <Button
                        onClick={() => {markAsDelivered(order._id)
                          console.log(order._id);
                        }}
                        disabled={!agentData?.isActive}
                      >
                        Mark Delivered
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-4">
                <p className="text-center text-gray-600">
                  No picked orders currently.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
