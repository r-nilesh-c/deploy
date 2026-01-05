import axios from 'axios';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle different error scenarios
    if (error.response?.status === 404) {
      throw new Error('API endpoint not found');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    } else if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    
    throw error;
  }
);

/**
 * Quiz API Service - Handles all quiz-related API calls
 */
export const quizAPI = {
  /**
   * Fetch randomized quiz questions from the backend
   * @returns {Promise} Promise resolving to quiz questions array
   */
  fetchQuestions: async () => {
    try {
      const response = await api.get('/quiz/questions');
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch questions');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw new Error(error.message || 'Failed to load quiz questions');
    }
  },

  /**
   * Submit quiz answers and get results
   * @param {Object} submissionData - Quiz submission data
   * @param {string} submissionData.userName - User's name
   * @param {Array} submissionData.answers - Array of user answers
   * @param {number} submissionData.timeTaken - Time taken in seconds
   * @returns {Promise} Promise resolving to quiz results
   */
  submitQuiz: async (submissionData) => {
    try {
      // Validate submission data
      if (!submissionData.userName || !submissionData.answers) {
        throw new Error('Invalid submission data');
      }

      if (submissionData.answers.length !== 20) {
        throw new Error('Quiz must have exactly 20 answers');
      }

      const response = await api.post('/quiz/submit', submissionData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to submit quiz');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw new Error(error.message || 'Failed to submit quiz');
    }
  },

  /**
   * Fetch leaderboard data
   * @returns {Promise} Promise resolving to leaderboard array
   */
  fetchLeaderboard: async () => {
    try {
      const response = await api.get('/quiz/leaderboard');
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch leaderboard');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw new Error(error.message || 'Failed to load leaderboard');
    }
  },

  /**
   * Fetch user's quiz history
   * @param {string} userName - User's name
   * @returns {Promise} Promise resolving to user history array
   */
  fetchUserHistory: async (userName) => {
    try {
      if (!userName) {
        throw new Error('Username is required');
      }

      const response = await api.get(`/quiz/history/${encodeURIComponent(userName)}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch user history');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user history:', error);
      throw new Error(error.message || 'Failed to load user history');
    }
  },

  /**
   * Health check - Test API connectivity
   * @returns {Promise} Promise resolving to health status
   */
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('API is not responding');
    }
  }
};

export default api;