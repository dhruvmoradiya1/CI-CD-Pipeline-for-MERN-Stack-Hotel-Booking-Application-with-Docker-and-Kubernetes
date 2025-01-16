import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

type ReviewFormProps = {
  hotelId: string;
};

const ReviewForm = ({ hotelId }: ReviewFormProps) => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [reviews, setReviews] = useState<any[]>([]); // P627d

  const mutation = useMutation(
    () => apiClient.submitHotelReview(hotelId, { rating, comment }),
    {
      onSuccess: (newReview) => {
        showToast({ message: "Review submitted successfully!", type: "SUCCESS" });
        setReviews((prevReviews) => [newReview, ...prevReviews]); // Pa96f
        setRating(0);
        setComment("");
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || error.message || "An error occurred";
        showToast({ message: errorMessage, type: "ERROR" });
      },
    }
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value={0}>Select a rating</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} Star{star > 1 && "s"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows={4}
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={mutation.isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium ${mutation.isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300`}
          >
            {mutation.isLoading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
      <div className="space-y-4 mt-6">
        {reviews.map((review) => (
          <div key={review._id} className="border border-slate-300 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="flex">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <AiFillStar key={index} className="fill-yellow-400" />
                ))}
              </span>
              <span className="text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="mt-2 text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewForm;
