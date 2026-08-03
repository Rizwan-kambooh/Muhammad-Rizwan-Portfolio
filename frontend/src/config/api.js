export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export const getApiUrl = (path) => `${API_BASE_URL}${path}`;
