import styles from "./style.module.css";
import Button from "../../components/Button";
import ButtonAction from "../ButtonAction";

type Props = {};

function LandingPage({}: Props) {
  const logged = sessionStorage.getItem("username");

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleLogout = () => {
    window.location.href = "/";
    sessionStorage.clear();
  };
  return (
    <>
      <div className={`container-fluid ${styles.LandingBackground}`}>
        <div className=" container-fluid row p-0 m-0">
          <div className="col-6 ">
            <div className="ms-5 mt-5 pt-5">
              <div className="pt-5">
                <h1
                  style={{
                    fontSize: "3rem",
                    fontWeight: "800",
                    color: "white",
                  }}
                >
                  <span style={{ color: "rgba(255, 210, 28, 1)" }}>Juega </span>
                  <span>y </span>
                  <span style={{ color: "rgba(8, 156, 0, 1)" }}>Gana! </span>
                  <span>en</span>
                  <br />
                  <span>UN Bet</span>
                </h1>
              </div>
              <div className="mt-3 d-none d-sm-block">
                <h2 style={{ fontSize: "1rem", color: "white" }}>
                  Te regalamos 500 Coins con tu registro**{" "}
                </h2>
              </div>

              {logged ? (
                <>
                  <div className="mt-5" style={{ width: "10rem" }}>
                    <ButtonAction text="Cerrar Sesión" onClick={handleLogout} />
                  </div>
                </>
              ) : (
                <>
                  <div className="d-flex mt-5">
                    <div className="p-3" style={{ width: "10rem" }}>
                      <ButtonAction text="Ingresar" onClick={handleLogin} />
                    </div>
                    <div className="p-3" style={{ width: "10rem" }}>
                      <Button text="Registrarse" onClick={handleLogin} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div
            className="col-6 justify-content-center d-flex align-items-center"
            style={{ height: "86vh" }}
          >
            <img src="ruleta.webp" alt="" width={"60%"} />
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
