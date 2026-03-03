import axios from "axios";
import { store } from '../store/store'

//const API_URL = 'http://localhost:8080/api';
const API_URL = 'https://api.fitnesstrackapp.click/api';


const api = axios.create({
    baseURL:API_URL
});

api.interceptors.request.use((config) => {
   // const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const state = store.getState();
    const userId = state.auth.userId;

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (userId) {
        config.headers['X-User-ID'] = userId;
    }
    return config;
}
);

// ---------- USERS ----------
export const validateUser = (userId) =>
  api.get(`/users/${userId}/validate`);
export const registerUser = (payload) =>
  api.post("/users/register", payload);
export const getUserProfile = (userId) => api.get(`/users/${userId}`);

// ---------- ACTIVITIES ----------
export const getActivities = () => api.get("/activities");
export const addActivity = (activity) => api.post("/activities", activity);
export const getActivityDetail = (id) => api.get(`/activities/${id}`);
export const getUserActivities = (userId) => api.get(`/activities/user/${userId}`);
export const deleteActivity = (activityId) =>
  api.delete(`/activities/${activityId}`);



// ---------- NUTRITION ----------
export const createNutritionPlan = (plan) => api.post("/nutrition/create", plan);
export const getAllNutritionPlans = () => api.get("/nutrition/all");
export const getNutritionPlanById = (id) => api.get(`/nutrition/${id}`);
export const getNutritionPlansByUser = (userId) =>
  api.get(`/nutrition/users/${userId}`);
export const updateNutritionPlan = (id, plan) =>
  api.put(`/nutrition/${id}`, plan);
export const deleteNutritionPlan = (id) => api.delete(`/nutrition/${id}`);

// ---------- NUTRITION PLANNING ----------
export const getAiNutritionRecommendationsByUser = (userId) =>
  api.get(`/nutritionRecommendations/user/${userId}`);

export const getAiNutritionRecommendationById = (id) =>
  api.get(`/nutritionRecommendations/${id}`);

export const regenerateAiNutritionRecommendation = (nutritionId) =>
  api.post(`/nutritionRecommendations/generate/${nutritionId}`);

export const deleteAiRecommendation = (id) =>
  api.delete(`/nutritionRecommendations/${id}`);

export const deleteByNutritionId = (nutritionId) =>
  api.delete(`/nutritionRecommendations/nutrition/${nutritionId}`);

// ---------- RECOMMENDATIONS ----------
export const getActivityRecommendations = (userId) =>
  api.get(`/recommendations/user/${userId}`);
export const getActivityRecommendation = (activityId) =>
  api.get(`/recommendations/activity/${activityId}`);
  export const deleteRecommendationByActivityId = (activityId) =>
  api.delete(`/recommendations/activity/${activityId}`);

 



export default api;

