import axios from "axios"; 

const DocenteService = {
  async obtenerDocentes() {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3001/api/docentes", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
    });
    return response.data;
  },
};


export default DocenteService;
