import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import MainDocente from "./pages/MainDocente";
import MainAdmin from "./pages/MainAdmin";
import PaginaPrueba from "./pages/PaginaPrueba";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/docente" element={<MainDocente />} />
        <Route path="/admin" element={<MainAdmin />} />
        <Route path="/pruebas" element={<PaginaPrueba />} />
      </Routes>
    </Router>
  );
}

export default App;