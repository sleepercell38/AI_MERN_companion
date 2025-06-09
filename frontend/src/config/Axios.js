import axios from 'axios';

const axiosInstance = axios.create({
    baseURL : import.meta.env.VITE_API_URL,

    //here we have to pass the header property for the axios instance because we are using the token for authentication
      
    headers:{
       "Authorization" : `Bearer ${localStorage.getItem("token")}`
    }

})

export default axiosInstance;
// This axios instance can be used throughout the application to make API requests.