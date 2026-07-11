//user opens app
//we need restaurant data from Backend
//API call happens
//data stored in redux
//UI updates automatically

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

//get all restaurants
export const getRestaurants = createAsyncThunk(
    "restaurants/getRestaurants",async(keyword ="",{rejectWithValue}) =>{
       try{
        //API call
        const {data} = await api.get(`/v1/eats/stores?keyword=${keyword}`);
        console.log("Fetched restaurants",data);
        return {
            restaurants : data.restaurants,
            count : data.count,
        }
       }catch(error){
         return rejectWithValue(error.response?.data?.message || error.message);
       }
    })

 //create restaurant - admin
 
 export const createRestaurant = createAsyncThunk(
  "restaurants/createRestaurant", async(restaurantData,{rejectWithValue}) =>{
    try{
      const {data} = await api.post("/v1/eats/stores", restaurantData);
      return data;
    }catch(error){
        return rejectWithValue(error.response?.data?.message || error.message)
    }

  }
 )

 //delete restaurant

  export const deleteRestaurant = createAsyncThunk(
  "restaurants/deleteRestaurant", async(id,{rejectWithValue}) =>{
    try{
      const {data} = await api.delete(`/v1/eats/stores/${id}`);
      return {
        id,
        message:data.message
      };
    }catch(error){
        return rejectWithValue(error.response?.data?.message || error.message)
    }

  }
 )

 export const analyzeReviews = createAsyncThunk(
  "restuarants/analyzeReviews", async(id, {rejectWithValue}) =>{
    try{
      const {data} = await api.put(`/v1/ai/admin/restaurants/${id}/analyze`)

      return{
        restaurantId: id,
        aiData:data.aiData
      }

    }catch(error){
      return rejectWithValue(error.response?.data?.message || "AI failed")

    }
  }
 )

// get all reviews for a restaurant
export const getReviews = createAsyncThunk(
  "restaurants/getReviews", async (storeId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/v1/eats/stores/${storeId}/reviews`);
      return {
        storeId,
        reviews: data.reviews,
        ratings: data.ratings,
        numOfReviews: data.numOfReviews,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// submit or update the logged-in user's review
export const submitReview = createAsyncThunk(
  "restaurants/submitReview",
  async ({ storeId, rating, comment }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/v1/eats/stores/${storeId}/reviews`, {
        rating,
        comment,
      });
      return {
        storeId,
        reviews: data.reviews,
        ratings: data.ratings,
        numOfReviews: data.numOfReviews,
        message: data.message,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// delete a review
export const deleteReview = createAsyncThunk(
  "restaurants/deleteReview",
  async ({ storeId, reviewId }, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(
        `/v1/eats/stores/${storeId}/reviews/${reviewId}`
      );
      return {
        storeId,
        reviews: data.reviews,
        ratings: data.ratings,
        numOfReviews: data.numOfReviews,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);