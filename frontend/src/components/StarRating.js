import React from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, onRate, editable = false, className = "" }) => {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={24}
          className={`cursor-pointer ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => editable && onRate(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;
