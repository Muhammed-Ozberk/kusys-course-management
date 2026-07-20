// Configuration object containing the base URL for API requests.
const config = {
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8080",
};

export default config; // Export the configuration object.
