// OrderTrackingDialog.jsx
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STAGES = ["placed", "prepared", "out for delivery", "delivered"];

const capitalize = (s) =>
  s
    ? s
        .split(" ")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ")
    : "";

export default function OrderTracker({
  orderId,
  currentStage, // e.g., "prepared", "out for delivery", "delivered", or "cancelled"
  cancelledFrom, // optional: e.g., "placed"
  onClose,
}) {
  let activeIndex = STAGES.findIndex(
    (s) => s.toLowerCase() === (currentStage || "").toLowerCase()
  );
  const isCancelled = (currentStage || "").toLowerCase() === "cancelled";

  if (isCancelled && cancelledFrom) {
    activeIndex = STAGES.findIndex(
      (s) => s.toLowerCase() === cancelledFrom.toLowerCase()
    );
    if (activeIndex === -1) activeIndex = 0;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-1">Track Order</h2>
        <p className="text-sm text-gray-600 mb-4">Order ID: {orderId}</p>

        <div className="flex flex-col space-y-6">
          <div className="flex items-center gap-4">
            {STAGES.map((stage, idx) => {
              const isCompleted = idx <= activeIndex && !isCancelled;
              const isCancelledPoint = isCancelled && idx === activeIndex;

              return (
                <div key={stage} className="flex flex-col items-center flex-1">
                  <div className="flex items-center w-full">
                    {/* Circle + connector */}
                    <div className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 mr-2 ${
                          isCancelledPoint
                            ? "bg-red-100 border-red-500 text-red-600"
                            : isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : "bg-white border-gray-300 text-gray-500"
                        }`}
                      >
                        {isCancelledPoint ? (
                          <span className="text-sm font-bold">×</span>
                        ) : isCompleted ? (
                          <span className="text-sm font-bold">&#10003;</span>
                        ) : (
                          <span className="text-sm font-medium">{idx + 1}</span>
                        )}
                      </div>
                    </div>
                    {idx < STAGES.length - 1 && (
                      <div className="flex-1">
                        <div
                          className={`w-full h-1 rounded ${
                            isCancelled
                              ? idx < activeIndex
                                ? "bg-green-500"
                                : "bg-gray-200"
                              : idx < activeIndex
                              ? "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <span
                      className={`text-sm font-medium ${
                        isCancelledPoint
                          ? "text-red-600"
                          : isCompleted
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      {capitalize(stage)}
                    </span>
                    {isCancelledPoint && (
                      <div className="text-xs text-red-500">Cancelled</div>
                    )}
                    {!isCancelled && idx === activeIndex && (
                      <div className="text-xs text-amber-500">Current</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {isCancelled && (
            <div className="p-3 bg-red-50 rounded border border-red-200 text-red-700">
              <strong>Order cancelled</strong>{" "}
              {cancelledFrom
                ? `after "${capitalize(cancelledFrom)}"`
                : "before progressing further."}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
