import styles from "./style.module.css";
import Card from "../CardLogin";

const LogBackground = () => {
  return (
    <div className={`container-fluid ${styles.background}`}>
      <div className="row" style={{ height: "100vh" }}>
        <div className={"col col-lg-6 p-0 d-none d-lg-block"}>
          <div className="d-flex justify-content-center align-items-center h-100">
            <img src="\ruleta.png" alt="Imagen Ruleta" />
          </div>
        </div>

        <div className={"col col-lg-6 p-0 d-none d-lg-block"}>
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="m-5">
              <Card />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogBackground;
