// src/components/JoinUsPopup.jsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { use, useState } from "react";
import RestaurantForm from "./RestaurantForm";
import DeliveryAgentForm from "./DeliveryAgentForm";
import { useRestaurant } from "@/context/RestaurantContext";

export default function JoinUsPopup({ open, setOpen }) {
  const [role, setRole] = useState(null); // 'restaurant' | 'agent'
   const {addRestaurant}=useRestaurant()
  const handleBack = () => setRole(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl p-6">
        {!role ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">
                Join GrubQuest
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-6">
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => setRole("restaurant")}
              >
                Join as Restaurant Owner
              </Button>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setRole("agent")}
              >
                Join as Delivery Agent
              </Button>
            </div>
          </>
        ) : role === "restaurant" ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Restaurant Registration</h2>
              <Button variant="ghost" onClick={handleBack}>
                ← Back
              </Button>
            </div>
            <RestaurantForm initialData={null} onSubmit={addRestaurant} closeForm={handleBack} />
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Delivery Agent Registration</h2>
              <Button variant="ghost" onClick={handleBack}>
                ← Back
              </Button>
            </div>
            <DeliveryAgentForm />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
