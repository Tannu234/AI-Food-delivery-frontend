import { createSlice } from "@reduxjs/toolkit";
import {
    getRestaurants,
    createRestaurant,
    deleteRestaurant,
    analyzeReviews,
    getReviews,
    submitReview,
    deleteReview,
} from "../actions/restaurantAction";

const initialState = {
    restaurants : [],
    count : 0,
    loading : false,
    error : null,
    showVegOnly : false,
    pureVegRestaurantsCount : 0,
    creating: false,      
    createError: null,
    deleting: false,
    deleteError: null,

    // reviews (for the restaurant currently being viewed)
    reviews: [],
    reviewsLoading: false,
    reviewsError: null,
    submittingReview: false,
    submitReviewError: null,
    submitReviewSuccess: false,
}

const restaurantSlice = createSlice({
    name: "restaurants",
    initialState,
    reducers : {
        sortByRatings:(state) =>{
            state.restaurants.sort((a,b) => b.ratings - a.ratings);
        },
      sortByReviews: (state) => {
    state.restaurants.sort(
        (a, b) => b.numOfReviews - a.numOfReviews
    );
},
        toggleVegOnly:(state) =>{
            state.showVegOnly = !state.showVegOnly;
            state.pureVegRestaurantsCount = calculatePureVegCount(state.restaurants,state.showVegOnly);
        },
        clearError:(state) =>{
            state.error = null;
        },
        clearReviewStatus:(state) =>{
            state.submitReviewError = null;
            state.submitReviewSuccess = false;
        }
    },

    extraReducers : (builder) =>{
        builder
        //GET
        .addCase(getRestaurants.pending,(state) =>{
            state.loading = true;
        })
        .addCase(getRestaurants.fulfilled,(state,action) =>{
            state.loading = false;
            state.restaurants = action.payload.restaurants;
            state.count = action.payload.count;
           
        })
        .addCase(getRestaurants.rejected,(state,action) =>{
            state.loading = false;
            state.error = action.payload || "Failed to fetch restaurants";
        })

        // CREATE
        // CREATE
.addCase(createRestaurant.pending, (state) => {
    state.creating = true;
    state.createError = null;
})

.addCase(createRestaurant.fulfilled, (state, action) => {
    state.creating = false;

    state.restaurants.push(action.payload.data);
    state.count += 1;
})

.addCase(createRestaurant.rejected, (state, action) => {
    state.creating = false;
    state.createError = action.payload;
})

// DELETE
.addCase(deleteRestaurant.pending, (state) => {
    state.deleting = true;
    state.deleteError = null;
})

.addCase(deleteRestaurant.fulfilled, (state, action) => {
    state.deleting = false;

    // remove restaurant from state
    state.restaurants = state.restaurants.filter(
        (rest) => rest._id !== action.payload.id
    );

    state.count -= 1;
})

.addCase(deleteRestaurant.rejected, (state, action) => {
    state.deleting = false;
    state.deleteError = action.payload;
})


// ANALYZE REVIEWS
      .addCase(analyzeReviews.pending, (state) => {
        state.loading = true;
      })

      .addCase(analyzeReviews.fulfilled, (state, action) => {
        state.loading = false;

        const { restaurantId, aiData } = action.payload;

        const restaurant = state.restaurants.find(
          (r) => r._id === restaurantId
        );

        if (restaurant) {
          restaurant.reviewSentiment = aiData.sentiment;
          restaurant.reviewSummaryBullets =
            aiData.summaryBullets;
          restaurant.reviewTopMentions =
            aiData.topMentions;
        }
      })

      .addCase(analyzeReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

// GET REVIEWS
      .addCase(getReviews.pending, (state) => {
        state.reviewsLoading = true;
        state.reviewsError = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.reviews = action.payload.reviews;

        const restaurant = state.restaurants.find(
          (r) => r._id === action.payload.storeId
        );
        if (restaurant) {
          restaurant.ratings = action.payload.ratings;
          restaurant.numOfReviews = action.payload.numOfReviews;
        }
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.reviewsError = action.payload;
      })

// SUBMIT REVIEW
      .addCase(submitReview.pending, (state) => {
        state.submittingReview = true;
        state.submitReviewError = null;
        state.submitReviewSuccess = false;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.submittingReview = false;
        state.submitReviewSuccess = true;
        state.reviews = action.payload.reviews;

        const restaurant = state.restaurants.find(
          (r) => r._id === action.payload.storeId
        );
        if (restaurant) {
          restaurant.ratings = action.payload.ratings;
          restaurant.numOfReviews = action.payload.numOfReviews;
        }
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.submittingReview = false;
        state.submitReviewError = action.payload;
      })

// DELETE REVIEW
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = action.payload.reviews;

        const restaurant = state.restaurants.find(
          (r) => r._id === action.payload.storeId
        );
        if (restaurant) {
          restaurant.ratings = action.payload.ratings;
          restaurant.numOfReviews = action.payload.numOfReviews;
        }
      });
  
     }

})

export const {
    sortByRatings,
    sortByReviews,
    toggleVegOnly,
    clearError,
    clearReviewStatus,
    
} = restaurantSlice.actions;

export default restaurantSlice.reducer;

//helper 
const calculatePureVegCount = (restaurants,showVegOnly) =>{

    if(!showVegOnly)return restaurants.length;

    return restaurants.filter(restaurant => restaurant.isVeg).length;
}