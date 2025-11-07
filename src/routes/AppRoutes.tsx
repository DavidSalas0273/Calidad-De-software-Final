import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../modules/auth/LoginPage";
import RegisterPage from "../modules/auth/RegisterPage";
import Math3DPage from "../modules/math3d/Math3DPage";
import SolarPage from "../modules/solar/SolarPage";
import Geo3DPage from "../modules/geo/Geo3DPage";
import PlaceholderPage from "../pages/PlaceholderPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="matematicas" element={<Math3DPage />} />
        <Route path="sistema-solar" element={<SolarPage />} />
        <Route path="mapa-3d" element={<Geo3DPage />} />
        <Route
          path="evaluaciones"
          element={<PlaceholderPage title="Evaluaciones" description="El motor de cuestionarios adaptativos se añadirá en el siguiente bloque de trabajo." />}
        />
        <Route
          path="dashboard"
          element={<PlaceholderPage title="Dashboard Docente" description="Estamos construyendo analíticas para docentes. Próximamente podrás ver promedios y progreso." />}
        />
      </Route>
    </Routes>
  );
}
