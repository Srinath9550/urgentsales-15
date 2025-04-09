import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  initialRating?: number;
  totalStars?: number;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  showRatingValue?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
  inputName?: string;
  feedback?: boolean;
  onFeedbackSubmit?: (rating: number, feedback: string) => void;
}

export default function StarRating({
  initialRating = 0,
  totalStars = 5,
  size = "md",
  disabled = false,
  showRatingValue = false,
  onChange,
  className,
  inputName,
  feedback = false,
  onFeedbackSubmit
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  // Define size classes
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const starSize = sizeClasses[size];

  const handleClick = (selectedRating: number) => {
    if (disabled) return;
    
    setRating(selectedRating);
    
    if (onChange) {
      onChange(selectedRating);
    }
    
    if (feedback && selectedRating > 0) {
      setShowFeedback(true);
    }
  };

  const handleMouseEnter = (hoveredRating: number) => {
    if (disabled) return;
    setHoverRating(hoveredRating);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setHoverRating(0);
  };

  const handleFeedbackSubmit = () => {
    if (onFeedbackSubmit && rating > 0) {
      onFeedbackSubmit(rating, feedbackText);
      setFeedbackText("");
      setShowFeedback(false);
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center">
        {[...Array(totalStars)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = (hoverRating || rating) >= starValue;
          
          return (
            <span
              key={index}
              className={cn(
                "cursor-pointer transition-transform duration-100 transform",
                disabled ? "cursor-default opacity-60" : "hover:scale-110",
                "mx-0.5"
              )}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              aria-label={`Rate ${starValue} out of ${totalStars}`}
            >
              <Star
                className={cn(
                  starSize,
                  isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                )}
              />

              {inputName && (
                <input
                  type="radio"
                  name={inputName}
                  value={starValue}
                  checked={rating === starValue}
                  onChange={() => {}}
                  className="sr-only"
                />
              )}
            </span>
          );
        })}

        {showRatingValue && (
          <span className="ml-2 text-gray-600 font-medium">
            {rating.toFixed(1)}
          </span>
        )}
      </div>

      {feedback && showFeedback && (
        <div className="mt-3 space-y-3">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            placeholder="Please tell us about your experience..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={3}
          />
          <button
            className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
            onClick={handleFeedbackSubmit}
          >
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
}