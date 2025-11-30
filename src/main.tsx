import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap";

createRoot(document.getElementById("root")!).render(
  // StrictMode deshabilitado temporalmente para evitar doble montaje en ruleta
  // <StrictMode>
  <App />
  // </StrictMode>
);
