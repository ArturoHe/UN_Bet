import { useEffect, useState } from "react";
import CreditRequestRow from "../../components/CreditRequestRow";
import styles from "./style.module.css";
import axios, { head } from "axios";
import api from "../../api/axiosConfig";

interface CreditRequest {
  id: number;
  user_id: number;
  amount: number;
  note: string;
}

type Props = {
  title: string;
};

export default function CreditRequestsPage({}: Props) {
  const [requests, setRequests] = useState<CreditRequest[]>([]);

  useEffect(() => {
    document.title = "Solicitudes de Créditos";

    // TEMPORAL: Datos mock mientras se conecta al backend
    const mockData: CreditRequest[] = [
      {
        id: 1,
        user_id: 1,
        amount: 10500,
        note: "5000",
      },
      {
        id: 2,
        user_id: 1,
        amount: 10500,
        note: "5000",
      },
      {
        id: 3,
        user_id: 1,
        amount: 10500,
        note: "5000",
      },
      {
        id: 4,
        user_id: 1,
        amount: 10500,
        note: "5000",
      },
    ];

    setRequests(mockData);

    const token = sessionStorage.getItem("jwtToken");

    api
      .get<CreditRequest[]>("/v1/admin/credits", {
        headers: { Authorization: `bearer ${token}` },
      })
      .then((res) => {
        setRequests(res.data);
        console.log("Solicitudes obtenidas:", res.data);
      });
  }, []);

  const approveRequest = (id: number) => {
    console.log("Aprobando solicitud id:", id);
    const token = sessionStorage.getItem("jwtToken");

    api.post(
      `/v1/admin/credits/${id}/approve`,
      {},
      {
        headers: { Authorization: `bearer ${token}` },
      }
    );
    console.log("Aprobando solicitud id:", id);
  };

  const denyRequest = (id: number) => {
    console.log("Denegando solicitud id:", id);
    const token = sessionStorage.getItem("jwtToken");

    api.post(
      `/v1/admin/credits/${id}/deny`,
      {},
      {
        headers: { Authorization: `bearer ${token}` },
      }
    );
    console.log("Denegando solicitud id:", id);
  };

  return (
    <div className={styles.background}>
      <h1 className={styles.title}>SOLICITUDES DE CRÉDITOS</h1>

      <div className={styles.headers}>
        <div className={styles.headerItem}>Usuario</div>
        <div className={styles.headerItem}>Saldo actual</div>
        <div className={styles.headerItem}>Cantidad solicitada</div>
        <div></div> {/* columna de acciones */}
      </div>

      <div className={styles.list}>
        {requests.map((req) => (
          <CreditRequestRow
            key={req.id}
            user_id={req.user_id}
            amount={req.amount}
            note={req.note}
            onApprove={() => approveRequest(req.id)}
            onDeny={() => denyRequest(req.id)}
          />
        ))}
      </div>
    </div>
  );
}
