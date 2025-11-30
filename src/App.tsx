import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./functionalities/Login";
import UserConfig from "./functionalities/UserConfig";
import LandingPage from "./functionalities/LandingPage";
import Layout from "./components/Layout";
import ErrorPage from "./functionalities/ErrorPage";
import RecoverPass from "./functionalities/RecoverPass";
import CreditsPage from "./functionalities/CreditsPage";
import CreditRequestsPage from "./functionalities/CreditRequestsPage";
import SlotMachinePage from "./functionalities/SlotMachinePage";
import GameSelector from "./functionalities/GameSelector";
import UserProfile from "./functionalities/UserProfile";
import Ruleta from "./functionalities/Roulette";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública sin layout */}

        <Route path="/login" element={<Login title="UN Bet | Login" />} />
        <Route
          path="/actualizarcontrasena"
          element={<RecoverPass title="UN Bet | Recover" />}
        />

        {/* Rutas con Layout */}
        <Route element={<Layout />}>
          <Route
            path="/credits"
            element={<CreditsPage title="UN Bet|Credits" />}
          />{" "}
          {/* Ana- Ruta de creditos de user*/}
          <Route
            path="/credit-requests"
            element={<CreditRequestsPage title="UN Bet | Solicitudes" />}
          />{" "}
          {/* Ana- Ruta de solicitudes de creditos para admin */}
          <Route
            path="/profile/:username"
            element={<UserProfile title="UNBet | Perfil" />}
          />{" "}
          {/* Ana- Ruta de perfil de usuario */}
          <Route
            path="/editprofile"
            element={<UserConfig title="UN Bet | Editar perfil" />}
          />{" "}
          {/* Ana- Ruta de editar perfil */}
          <Route
            path="/slotmachine"
            element={<SlotMachinePage title="UN Bet | Tragamonedas" />}
          />{" "}
          {/* Ana- Ruta de tragamonedas */}
          <Route
            path="/roulette"
            element={<Ruleta title="UN Bet | Ruleta" />}
          />{" "}
          {/* Ana- Ruta de tragamonedas */}
          <Route
            path="/home"
            element={<GameSelector title="UN Bet | Selección de Juegos" />}
          />{" "}
          {/* Ana- Ruta de selección de juegos */}
          <Route path="/" element={<LandingPage title="UN Bet" />} />
          <Route path="/landing" element={<LandingPage title="UN Bet" />} />
        </Route>

        <Route path="*" element={<ErrorPage title="UN Bet | 404" />} />
      </Routes>
    </Router>
  );
}

export default App;
