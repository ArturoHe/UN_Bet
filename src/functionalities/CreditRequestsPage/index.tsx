import { useEffect, useState } from "react";
import CreditRequestRow from "../../components/CreditRequestRow";
import styles from "./style.module.css";

interface CreditRequest {
  id: number;
  username: string;
  currentBalance: number;
  requestedAmount: number;
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
        username: "anago2025",
        currentBalance: 10500,
        requestedAmount: 5000,
      },
      {
        id: 2,
        username: "arturo2025",
        currentBalance: 1100,
        requestedAmount: 100000,
      },
      {
        id: 3,
        username: "manuel2025",
        currentBalance: 0,
        requestedAmount: 8000,
      },
      {
        id: 4,
        username: "daniel2025",
        currentBalance: 85000,
        requestedAmount: 5500,
      },
    ];

    setRequests(mockData);

    /* 
    TO-DO INSERTAR BACKEND REAL 

    api.get("/credits/requests").then((res) => {
      setRequests(res.data);
    });
    */
  }, []);

  const approveRequest = (id: number) => {
    console.log("Aprobando solicitud id:", id);

    /*
    api.post(`/credits/approve/${id}`).then(() => {
      setRequests(prev => prev.filter(r => r.id !== id));
    });
    */
  };

  const denyRequest = (id: number) => {
    console.log("Denegando solicitud id:", id);

    /*
    api.post(`/credits/deny/${id}`).then(() => {
      setRequests(prev => prev.filter(r => r.id !== id));
    });
    */
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
            username={req.username}
            currentBalance={req.currentBalance}
            requested={req.requestedAmount}
            onApprove={() => approveRequest(req.id)}
            onDeny={() => denyRequest(req.id)}
          />
        ))}
      </div>
    </div>
  );
}
