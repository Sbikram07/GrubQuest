"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";



export default function ReviewsList() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-2">My Reviews</h2>
      {sampleReviews.map((review) => (
        <Card key={review.id} className="relative">
          <CardContent className="p-4 space-y-1">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{review.restaurant}</p>
                <p className="text-gray-600 text-sm">{review.date}</p>
              </div>
              <Button variant="destructive" size="icon" title="Delete Review">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-gray-800">{review.comment}</p>
            <p className="text-yellow-500 font-medium">
              Rating: {review.rating} / 5
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
