import { Navigate } from "react-router-dom";

const RutaProtegida = ({ children, rolPermitido }) => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if (!token) return <Navigate to="/login" replace />;

  if (rol !== rolPermitido) return <Navigate to="/403" replace />;

  return children;
};

export default RutaProtegida;
