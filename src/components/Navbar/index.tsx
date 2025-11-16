import { Link } from "react-router-dom";
import Button from "../Button";
import ButtonAction from "../ButtonAction";
import styles from "./style.module.css";
import { IoIosSearch } from "react-icons/io";

type Props = {};

function index({}: Props) {
  return (
    <nav className={`navbar bg-body-tertiary ${styles.navColor}`}>
      <div className="container-fluid">
        <div>
          <a className="navbar-brand ms-5" href="#">
            <img src="UNBetLogo.svg" alt="Bootstrap" width={100} />
          </a>
        </div>

        <div className="col-6 d-flex justify-content-center align-items-center">
          <a className="nav-link me-5 w-5" href="#">
            Quienes somos
          </a>

          <a className="nav-link me-5 w-5" href="#">
            Juegos
          </a>

          <a className="nav-link me-5 w-5" href="#">
            Cómo Funciona?
          </a>

          <div className="me-2" style={{ width: "10rem" }}>
            <a href="/login">
              <ButtonAction text="Ingresar" />
            </a>
          </div>

          <div style={{ width: "10rem" }}>
            <a href="/login">
              <Button text="Registrarse" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default index;
