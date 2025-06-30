import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUsuario(null);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setUsuario(data);
      } else {
        setUsuario(null);
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      setUsuario(null);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ usuario, setUsuario, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};
