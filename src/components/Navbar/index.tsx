import Button from "../Button";
import ButtonAction from "../ButtonAction";
import styles from "./style.module.css";
import { CgProfile } from "react-icons/cg";

type Props = {};

function index({}: Props) {
  const logged = sessionStorage.getItem("username");

  const handleProfile = () => {
    window.location.href = `/profile/${logged}`;
  };

  const handleLogout = () => {
    window.location.href = "/landing";
    sessionStorage.clear();
  };

  return (
    <>
      <nav className={`navbar bg-body-tertiary ${styles.navColor}`}>
        <div className="container-fluid">
          <div>
            <a className="navbar-brand ms-5" href="/">
              <img
                src="logos/logoCompletoRectangular.webp"
                alt="Logo"
                width={60}
              />
            </a>
          </div>

          <div className="col-6 d-flex justify-content-end align-items-center me-5">
            <a className="nav-link me-5 w-5" href="/home">
              Juegos
            </a>

            {!logged ? (
              <>
                <a className="nav-link me-5 w-5" href="#">
                  ¿Quienes somos?
                </a>

                <a className="nav-link me-5 w-5" href="#">
                  Cómo Funciona?
                </a>
                <div className="me-3" style={{ width: "8rem" }}>
                  <a href="/login">
                    <ButtonAction text="Ingresar" />
                  </a>
                </div>

                <div style={{ width: "8rem" }}>
                  <a href="/login">
                    <Button text="Registrarse" />
                  </a>
                </div>
              </>
            ) : (
              <>
                <div className="btn-group">
                  <button className="btn btn-secondary btn-sm" type="button">
                    {logged}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="visually-hidden">Toggle Dropdown</span>
                  </button>
                  <ul className="dropdown-menu">...</ul>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default index;
