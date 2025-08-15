"use client"

import { useEffect, useState } from "react"
import Navbar1 from "@/components/Navbar1"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRestaurant } from "@/context/RestaurantContext"
import { useAuth } from "@/context/AuthContext"
import RestaurantForm from "@/components/RestaurantForm"
import PopupModal from "@/components/PopupModal"
import { useItem } from "@/context/ItemContext"
import RestaurantOrdersPanel from "@/components/RestaurantOrdersPanel"

const RestaurantDashboard = () => {
  const { addRestaurant, updateRestaurant, deleteRestaurant, ownedRestaurants, fetchOwnedRestaurants } = useRestaurant()

  const { items, fetchItemsByRestaurant, addItem, updateItem, deleteItem } = useItem()

  const { user } = useAuth()

  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null)
  const [activeTab, setActiveTab] = useState("restaurant") // restaurant, items, orders
  const [showForm, setShowForm] = useState(false)
  const [restaurantToEdit, setRestaurantToEdit] = useState(null)
  const [showItemForm, setShowItemForm] = useState(false)
  const [itemToEdit, setItemToEdit] = useState(null)

  const [itemForm, setItemForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: null,
  })

  useEffect(() => {
    fetchOwnedRestaurants()
  }, [])

  useEffect(() => {
    if (ownedRestaurants.length > 0 && !selectedRestaurantId) {
      setSelectedRestaurantId(ownedRestaurants[0]._id)
    }
  }, [ownedRestaurants])

  useEffect(() => {
    if (selectedRestaurantId && activeTab === "items") {
      fetchItemsByRestaurant(selectedRestaurantId)
    }
  }, [selectedRestaurantId, activeTab])

  const selectedRestaurant = ownedRestaurants.find((r) => r._id === selectedRestaurantId)

  const openEditForm = (restaurant) => {
    setRestaurantToEdit(restaurant)
    setShowForm(true)
  }

  const handleSubmitRestaurant = async (formData) => {
    if (restaurantToEdit) {
      await updateRestaurant(restaurantToEdit._id, formData)
    } else {
      await addRestaurant(formData)
    }
    fetchOwnedRestaurants()
    setShowForm(false)
    setRestaurantToEdit(null)
  }

  const handleItemChange = (e) => {
    const { name, value, files } = e.target
    if (name === "image") {
      setItemForm((prev) => ({ ...prev, image: files[0] }))
    } else {
      setItemForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleAddItem = async (e) => {
    e.preventDefault()

    if (!selectedRestaurantId) {
      alert("Please select a restaurant first")
      return
    }

    const formData = new FormData()
    formData.append("name", itemForm.name)
    formData.append("price", itemForm.price)
    formData.append("description", itemForm.description)
    formData.append("category", itemForm.category)
    if (itemForm.image) {
      formData.append("image", itemForm.image)
    }

    if (itemToEdit) {
      await updateItem(selectedRestaurantId, itemToEdit._id, formData)
    } else {
      await addItem(selectedRestaurantId, formData)
    }

    // Reset form
    setItemForm({
      name: "",
      price: "",
      description: "",
      category: "",
      image: null,
    })
    setItemToEdit(null)
    setShowItemForm(false)

    // Refresh items
    fetchItemsByRestaurant(selectedRestaurantId)
  }

  const handleEditItem = (item) => {
    setItemForm({
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      image: null,
    })
    setItemToEdit(item)
    setShowItemForm(true)
  }

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await deleteItem(selectedRestaurantId, itemId)
      fetchItemsByRestaurant(selectedRestaurantId)
    }
  }

  if (!user || user.role !== "restaurantOwner") {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar1 />
        <div className="max-w-7xl mx-auto p-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You need to be a restaurant owner to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar1 />
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="md:w-1/4 space-y-4">
            <h2 className="text-lg font-semibold">Owner Details</h2>
            <div className="p-3 bg-white rounded shadow">
              <p>
                <strong>Name:</strong> {user?.name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Phone:</strong> {user?.phone || "N/A"}
              </p>
            </div>

            {/* Restaurant Selector */}
            {ownedRestaurants.length > 1 && (
              <div className="p-3 bg-white rounded shadow">
                <h3 className="font-semibold mb-2">Select Restaurant</h3>
                <select
                  value={selectedRestaurantId || ""}
                  onChange={(e) => setSelectedRestaurantId(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {ownedRestaurants.map((restaurant) => (
                    <option key={restaurant._id} value={restaurant._id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="p-3 bg-white rounded shadow">
              <h3 className="font-semibold mb-2">Dashboard Sections</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("restaurant")}
                  className={`w-full text-left p-2 rounded ${
                    activeTab === "restaurant" ? "bg-orange-100 text-orange-800" : "hover:bg-gray-100"
                  }`}
                >
                  Restaurant Management
                </button>
                <button
                  onClick={() => setActiveTab("items")}
                  className={`w-full text-left p-2 rounded ${
                    activeTab === "items" ? "bg-orange-100 text-orange-800" : "hover:bg-gray-100"
                  }`}
                >
                  Menu Items
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left p-2 rounded ${
                    activeTab === "orders" ? "bg-orange-100 text-orange-800" : "hover:bg-gray-100"
                  }`}
                >
                  Orders
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4 space-y-6">
            {/* Restaurant Management Tab */}
            {activeTab === "restaurant" && (
              <div className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Restaurant Management</h2>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setRestaurantToEdit(null)
                      setShowForm(true)
                    }}
                  >
                    Add New Restaurant
                  </Button>
                </div>

                {selectedRestaurant && (
                  <div>
                    <img
                      src={selectedRestaurant.image?.url || "/placeholder.svg"}
                      alt={selectedRestaurant.name}
                      className="w-full h-40 object-cover rounded mb-4"
                    />
                    <p>
                      <strong>Name:</strong> {selectedRestaurant.name}
                    </p>
                    <p>
                      <strong>Location:</strong> {selectedRestaurant.address}
                    </p>
                    <p>
                      <strong>Description:</strong> {selectedRestaurant.description}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button onClick={() => openEditForm(selectedRestaurant)}>Update Restaurant</Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this restaurant?")) {
                            deleteRestaurant(selectedRestaurant._id)
                          }
                        }}
                      >
                        Delete Restaurant
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Item Management Tab */}
            {activeTab === "items" && selectedRestaurantId && (
              <>
                {/* Add/Edit Item Form */}
                <div className="bg-white p-4 rounded shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">{itemToEdit ? "Edit Item" : "Add New Item"}</h2>
                    {!showItemForm && <Button onClick={() => setShowItemForm(true)}>Add Item</Button>}
                  </div>

                  {showItemForm && (
                    <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Item Name"
                        name="name"
                        value={itemForm.name}
                        onChange={handleItemChange}
                        required
                      />
                      <Input
                        placeholder="Price"
                        name="price"
                        type="number"
                        value={itemForm.price}
                        onChange={handleItemChange}
                        required
                      />
                      <Input
                        placeholder="Description"
                        name="description"
                        value={itemForm.description}
                        onChange={handleItemChange}
                        required
                      />
                      <Input
                        placeholder="Category (veg/non-veg/snacks)"
                        name="category"
                        value={itemForm.category}
                        onChange={handleItemChange}
                        required
                      />
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleItemChange}
                        className="md:col-span-1 border-2 h-9 rounded-md px-3 py-1 border-gray-200  "
                        required={!itemToEdit}
                      />
                      <div className="md:col-span-2 flex gap-2">
                        <Button type="submit">{itemToEdit ? "Update Item" : "Add Item"}</Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowItemForm(false)
                            setItemToEdit(null)
                            setItemForm({
                              name: "",
                              price: "",
                              description: "",
                              category: "",
                              image: null,
                            })
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Item List */}
                <div className="bg-white p-4 rounded shadow">
                  <h2 className="text-lg font-bold mb-4">Manage Items</h2>
                  {items.length === 0 ? (
                    <p className="text-gray-500">No items found. Add some items to get started.</p>
                  ) : (
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item._id} className="flex justify-between items-center p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image?.url || "/placeholder.svg"}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                ₹{item.price} • {item.category}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleEditItem(item)}>
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item._id)}>
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && selectedRestaurantId && (
              <RestaurantOrdersPanel restaurantId={selectedRestaurantId} />
            )}
          </div>
        </div>
      </div>

      {/* Restaurant Form Modal */}
      {showForm && (
        <PopupModal onClose={() => setShowForm(false)}>
          <RestaurantForm
            initialData={restaurantToEdit}
            onSubmit={handleSubmitRestaurant}
            closeForm={() => setShowForm(false)}
          />
        </PopupModal>
      )}
    </div>
  )
}

export default RestaurantDashboard
