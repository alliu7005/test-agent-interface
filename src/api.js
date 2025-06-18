import axios from 'axios';

const BASE_URL = process.env.REACT_APP_AGENT_URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // If you ever need cookies/session auth:
  // withCredentials: true,
});

export default api;