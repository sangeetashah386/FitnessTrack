import api from "./api";

// Fetch logged-in user's profile
export const getUserProfile = async (username) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

// Optionally: Update user profile
export const updateUserProfile = (profileData) =>
  api.put("/user/profile", profileData);