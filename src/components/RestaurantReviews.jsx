import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getReviews,
  submitReview,
  deleteReview,
} from "../redux/actions/restaurantAction";
import { clearReviewStatus } from "../redux/slices/restaurantSlice";
import { toast } from "react-toastify";

const StarInput = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="star-input">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star-input-icon ${
            star <= (hovered || value) ? "filled" : ""
          }`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const StarDisplay = ({ rating }) => (
  <div className="star-display">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`star-display-icon ${star <= Math.round(rating) ? "filled" : ""}`}
      >
        ★
      </span>
    ))}
  </div>
);

const RestaurantReviews = ({ restaurantId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const {
    reviews,
    reviewsLoading,
    submittingReview,
    submitReviewError,
    submitReviewSuccess,
  } = useSelector((state) => state.restaurants);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (restaurantId) {
      dispatch(getReviews(restaurantId));
    }
  }, [dispatch, restaurantId]);

  const myReview = reviews?.find((r) => r.user === user?._id);

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setComment(myReview.Comment);
    }
  }, [myReview]);

  useEffect(() => {
    if (submitReviewSuccess) {
      toast.success(myReview ? "Review updated" : "Thanks for your review!");
      setShowForm(false);
      dispatch(clearReviewStatus());
    }
    if (submitReviewError) {
      toast.error(submitReviewError);
      dispatch(clearReviewStatus());
    }
  }, [submitReviewSuccess, submitReviewError, dispatch]);

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      return navigate("/users/login");
    }
    setShowForm(true);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a short comment");
      return;
    }

    dispatch(submitReview({ storeId: restaurantId, rating, comment }));
  };

  const handleDelete = (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    dispatch(deleteReview({ storeId: restaurantId, reviewId }));
  };

  return (
    <div className="reviews-section">
      <div className="reviews-heading-row">
        <h3 className="reviews-heading">What people are saying</h3>

        {!myReview && (
          <button className="write-review-btn" onClick={handleWriteReview}>
            ✍️ Write a Review
          </button>
        )}
        {myReview && !showForm && (
          <button className="write-review-btn" onClick={() => setShowForm(true)}>
            Edit your review
          </button>
        )}
      </div>

      {showForm && (
        <form className="review-form" onSubmit={submitHandler}>
          <label>Your rating</label>
          <StarInput value={rating} onChange={setRating} />

          <label htmlFor="review-comment">Your review</label>
          <textarea
            id="review-comment"
            rows={3}
            placeholder="How was the food, delivery time, and packaging?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
          />
          <span className="char-count">{comment.length}/500</span>

          <div className="review-form-actions">
            <button
              type="submit"
              className="write-review-btn"
              disabled={submittingReview}
            >
              {submittingReview
                ? "Submitting..."
                : myReview
                ? "Update Review"
                : "Submit Review"}
            </button>
            <button
              type="button"
              className="cancel-review-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {reviewsLoading ? (
        <p className="reviews-empty">Loading reviews...</p>
      ) : reviews && reviews.length > 0 ? (
        <div className="reviews-list">
          {reviews
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((r) => (
              <div className="review-card" key={r._id}>
                <div className="review-card-top">
                  <div className="reviewer-avatar">
                    {r.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="reviewer-name">{r.name}</p>
                    <StarDisplay rating={r.rating} />
                  </div>

                  {(user?._id === r.user || user?.role === "admin") && (
                    <button
                      className="delete-review-btn"
                      onClick={() => handleDelete(r._id)}
                      title="Delete review"
                    >
                      🗑
                    </button>
                  )}
                </div>
                <p className="review-comment">{r.Comment}</p>
                {r.createdAt && (
                  <p className="review-date">
                    {new Date(r.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            ))}
        </div>
      ) : (
        <p className="reviews-empty">
          No reviews yet — be the first to share your experience!
        </p>
      )}
    </div>
  );
};

export default RestaurantReviews;