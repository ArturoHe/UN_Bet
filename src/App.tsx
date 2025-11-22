import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./functionalities/HomePage";
import Login from "./functionalities/Login";
import UserConfig from "./functionalities/UserConfig";
import User from "./functionalities/User";
import NewProduct from "./functionalities/ProductCreation";
import Product from "./functionalities/Product";
import LandingPage from "./functionalities/LandingPage";
import Search from "./functionalities/ProductSearch";
import Layout from "./components/Layout";
import ErrorPage from "./functionalities/ErrorPage";
import PrivateRoute from "./components/PrivateRoute";
import ProductEdit from "./components/ProductFormEdit";
import History from "./functionalities/History";
import RecoverPass from "./functionalities/RecoverPass";
import CartFail from "./functionalities/CartFail";
import CartPending from "./functionalities/CartPending";
import CartSuccess from "./functionalities/CartSuccess";
import CreditsPage from "./functionalities/CreditsPage";
import CreditRequestsPage from "./functionalities/CreditRequestsPage";
import SlotMachinePage from "./functionalities/SlotMachinePage";
import GameSelector from "./functionalities/GameSelector";
import UserProfile from "./functionalities/UserProfile";

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
          {/* Ana- Ruta de eeditar perfil */}
          <Route
            path="/slotmachine"
            element={<SlotMachinePage title="UN Bet | Tragamonedas" />}
          />{" "}
          {/* Ana- Ruta de tragamonedas */}
          <Route
            path="/home"
            element={<GameSelector title="UN Bet | Selección de Juegos" />}
          />{" "}
          {/* Ana- Ruta de selección de juegos */}
          <Route path="/" element={<LandingPage title="UN Bet" />} />
          <Route path="/landing" element={<LandingPage title="UN Bet" />} />
          <Route
            path="/user/:username"
            element={<User title="ReWear | User" />}
          />
          <Route element={<PrivateRoute />}>
            <Route
              path="/newproduct"
              element={<NewProduct title="ReWear | Product" />}
            />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route
              path="/editproduct/:id"
              element={<ProductEdit title="ReWear | Edit" />}
            />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route
              path="/success"
              element={<CartSuccess title="ReWear | Edit" />}
            />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route
              path="/failure"
              element={<CartFail title="ReWear | Edit" />}
            />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route
              path="/pending"
              element={<CartPending title="ReWear | Edit" />}
            />
          </Route>
          <Route
            path="/product/:id"
            element={<Product title="ReWear | Product" />}
          />
          <Route
            path="/search/:filter"
            element={<Search title="ReWear | Search" />}
          />
          <Route
            path="/history"
            element={<History title="ReWear | Configuración" />}
          />
          <Route path="*" element={<ErrorPage title="UN Bet | 404" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
