import axios from "axios";

const API = axios.create({
    baseURL: "https://teamspace-k6wa.onrender.com"
});

export default API;