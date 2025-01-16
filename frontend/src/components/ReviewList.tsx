import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { AiFillStar } from "react-icons/ai";

type ReviewListProps = {
  hotelId: string;
};

const ReviewList = ({ hotelId }: ReviewListProps) => {
  const { data: reviews, isLoading, isError } = useQuery(
    ["fetchHotelReviews", hotelId],
    () => apiClient.fetchHotelReviews(hotelId)
  );

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  if (isError) {
    return <div>Error loading reviews</div>;
  }

  if (!reviews || reviews.length === 0) {
    return <div>No reviews available</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">User Reviews</h3>
      {reviews.map((review: any) => (
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
  );
};

export default ReviewList;
