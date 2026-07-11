import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteRestaurant } from "../redux/actions/restaurantAction";

const Restaurant = ({ restaurant }) => {
  const dispatch = useDispatch();
  const [showAI, setShowAI] = useState(false);

  const { isAuthenticated, user } = useSelector(
    (state) => state.user || {}
  );

  //DELETE
  const handleDelete = () => {
    if (!window.confirm("Delete this restaurant?")) return;

    dispatch(deleteRestaurant(restaurant._id)).catch(() => {
      alert("Unable to delete");
    });
  };
  return (
    <div className="col-sm-6 col-md-4 col-lg-3 my-3">
      <div className="restaurant-card">
        <Link to={`/eats/stores/${restaurant._id}/menus`} className="restaurant-image-link">
          <div className="restaurant-image-wrap">
            <img
              className="restaurant-image"
              src={restaurant.images?.[0]?.url}
              alt={restaurant.name}
            />
            <span className="rating-badge">
              ★ {restaurant.ratings ? restaurant.ratings.toFixed(1) : "New"}
            </span>
            {restaurant.isVeg && <span className="veg-dot" title="Pure Veg" />}
          </div>
        </Link>

        <div className="restaurant-info">
          <h4>{restaurant.name}</h4>

          <p className="rest_address">{restaurant.address}</p>

          <p className="rest-meta">
            {restaurant.numOfReviews} {restaurant.numOfReviews === 1 ? "review" : "reviews"}
          </p>

          {restaurant.reviewSentiment && (
            <button className="ai-btn" onClick={() => setShowAI(!showAI)}>
              {showAI ? "➖ Hide Summary" : "💬 View Review Summary"}
            </button>
          )}

          {showAI && (
            <div className="ai-insights-box">
              <div className="ai-status">
                Review Summary: 😊 <strong>{restaurant.reviewSentiment}</strong>
              </div>

              <ul>
                {(restaurant.reviewSummaryBullets || []).map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>

              <div className="mentions">
                {(restaurant.reviewTopMentions || []).map((item, index) => (
                  <span key={index} className="mention-tag">
                    #{item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {isAuthenticated && user && user.role === "admin" && (
            <button className="btn btn-danger btn-sm mt-2" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;