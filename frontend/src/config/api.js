const LOCAL_API_URL = "http://localhost:5001";
const PRODUCTION_API_URL = "https://muhammad-rizwan-portfolio.onrender.com";

export const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production" ? PRODUCTION_API_URL : LOCAL_API_URL);

export const getApiUrl = (path) => `${API_BASE_URL}${path}`;
