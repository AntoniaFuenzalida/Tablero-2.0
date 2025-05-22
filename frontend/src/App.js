import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import MainDocente from "./pages/MainDocente";
import MainAdmin from "./pages/MainAdmin";
import { UserProvider } from "./context/UserContext";
import RutaProtegida from "./components/RutaProtegida"; 

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route
            path="/docente"
            element={
              <RutaProtegida rolPermitido="docente">
                <MainDocente />
              </RutaProtegida>
            }
          />
          <Route
            path="/admin"
            element={
              <RutaProtegida rolPermitido="admin">
                <MainAdmin />
              </RutaProtegida>
            }
          />
          <Route
            path="/403"
            element={
              <div className="flex items-center justify-center min-h-screen text-center text-red-600 text-xl font-semibold">
                ❌ Acceso denegado — No tienes permisos para ver esta página.
              </div>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
