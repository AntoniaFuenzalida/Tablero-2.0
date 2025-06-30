import axios from "axios"; 
import { API_BASE_URL } from "../config/api";

const DocenteService = {
  async obtenerDocentes() {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/api/docentes`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
    });
    return response.data;
  },
};


export default DocenteService;
