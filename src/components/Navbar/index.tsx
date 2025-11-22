import Button from "../Button";
import ButtonAction from "../ButtonAction";
import styles from "./style.module.css";
import { CgProfile } from "react-icons/cg";
import "bootstrap/js/dist/dropdown";
import "bootstrap/dist/css/bootstrap.min.css";

type Props = {};

function index({}: Props) {
  const logged = sessionStorage.getItem("username");

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
                <div className={`dropdown`}>
                  <a
                    className={`btn btn-secondary dropdown-toggle ${styles.baseProfileBtn}`}
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {logged}
                    <CgProfile size={"1.5rem"} className="ms-2" />
                  </a>

                  <ul className={`dropdown-menu ${styles.menuProfile}`}>
                    <li>
                      <a
                        className={`dropdown-item ${styles.optionMenuProfile}`}
                        href={`/profile/${logged}`}
                      >
                        Perfil
                      </a>
                    </li>
                    <li>
                      <a
                        className={`dropdown-item ${styles.optionMenuProfile}`}
                        href="/credits"
                      >
                        Solicitar Créditos
                      </a>
                    </li>
                    <li>
                      <a
                        className={`dropdown-item ${styles.optionMenuProfile}`}
                        href="/landing"
                        onClick={handleLogout}
                      >
                        Cerrar Sesión
                      </a>
                    </li>
                  </ul>
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
