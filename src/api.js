import axios from "axios";
// import Cookies from "js-cookie";


const api = axios.create({
  baseURL: "https://abkcharity.duckdns.org", //base url
});

//axios interceptor (docs)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//handling expiration
api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    //401 unauthorized err
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if(!refreshToken){
        throw new Error("No refresh token found");
      }
      
      try {
        
        //requesting new access token using the refresh token
        const response = await axios.post("https://abkcharity.duckdns.org/api/token/refresh/", {
          refresh: refreshToken, 
        });

        
        localStorage.setItem("accessToken", response.data.access);

        //updating authorization headers with new token received
        api.defaults.headers.Authorization = `Bearer ${data.access}`;
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        
        return api(originalRequest); //Retry original request with new token
      } catch (err) {
        console.error("Token refresh failed:", err.response?.data || err.message);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // window.location.href = "/"; 
      }
    }

    return Promise.reject(error);
  }
);

export default api;
