import styles from "./style.module.css";
import Button from "../../components/Button";
import ButtonAction from "../ButtonAction";

type Props = {};

function LandingPage({}: Props) {
  const handleHome = () => {
    window.location.href = "/home";
  };
  return (
    <>
      <div className={`container-fluid ${styles.LandingBackground}`}>
        <div className="col-xs-12 col-lg-5">
          <div className="pt-5">
            <h1 style={{ fontSize: "4rem", fontWeight: "800 !important" }}>
              <span>Juega </span>
              <span>y </span>
              <span>Gana! </span>
              <span>en</span>
              <br />
              <span>UN Bet</span>
            </h1>
          </div>

          <div className="mt-5 pt-2 d-none d-sm-block">
            <h2 style={{ fontSize: "1.5rem" }}>
              Te regalamos 500 Coins con tu registro**{" "}
            </h2>
          </div>

          <div className="d-flex justify-content-center">
            <div className="p-3" style={{ width: "10rem" }}>
              <ButtonAction text="Registrarse" onClick={handleHome} />
            </div>
            <div className="p-3" style={{ width: "10rem" }}>
              <Button text="Ingresar" onClick={handleHome} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
