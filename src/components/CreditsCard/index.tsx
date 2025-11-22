import { useEffect, useState } from "react";
import styles from "./style.module.css";
import api from "../../api/axiosConfig";
import { BalanceResponse } from "../../api/types";

export default function CreditsCard() {
  const [credits, setCredits] = useState<number | "">("");
  const [balance, setBalance] = useState<number>(0);

  //TO-DO: Revisar fetch balance del backend
  const fetchBalance = async () => {
    try {
      const token = sessionStorage.getItem("jwtToken");

      const response = await api.get<BalanceResponse>("/credits/balance", {
        headers: {
          Authorization: `${token}`,
        },
      });

      setBalance(response.data.balance);
    } catch (error) {
      console.error("Error obteniendo balance:", error);
      alert("No se pudo obtener el saldo");
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleSubmit = async () => {
    if (!credits || credits <= 0) {
      alert("Por favor ingresa una cantidad válida.");
      return;
    }

    try {
      const token = sessionStorage.getItem("jwtToken");
      console.log("Solicitud de créditos:", credits);
      console.log("Token:", token);

      /*const response = await api.post(
        "/credits/request",
        { amount: credits },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );*/ alert("Solicitud enviada con éxito");
      setCredits("");
    } catch (error) {
      console.error("Error enviando solicitud:", error);
      alert("No se pudo enviar la solicitud");
    }
  };

  return (
    <div className={styles.background}>
      <h1 className={styles.balanceTitle}>${balance}</h1>

      <p className={styles.subtitle}>Solicitar más monedas</p>

      <div className={styles.inputContainer}>
        <span className={styles.symbol}>$</span>

        <input
          type="number"
          className={styles.input}
          value={credits}
          onChange={(e) => {
            const v = Number(e.target.value);
            setCredits(v < 0 ? "" : v);
          }}
          placeholder="ej. 100"
        />
      </div>

      <button onClick={handleSubmit} className={styles.button}>
        Solicitar
      </button>
    </div>
  );
}
