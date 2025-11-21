import styles from "./style.module.css";
import ButtonAction from "../ButtonAction";
import api from "../../api/axiosConfig";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function UserProfileCard() {
  const { username } = useParams();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/user/${username}`, {
          headers: { Authorization: sessionStorage.getItem("jwtToken") }
        });

        setUser(response.data);
      } catch (error) {
        console.log("ERROR en backend, usando datos temporales...");

        // -------- DATOS TEMPORALES PARA DESARROLLO --------
        setUser({
          nombre: "Ana",
          apellidos: "González",
          username: username,
          email: "ana@example.com",
          phone: "3001234567",
          fechaNacimiento: "2002-05-10",
          cc: "1023456789",
          saldo: 85000,
          ganancias: 154000,
          perdidas: 20000,
          imageUrl: "/parmero.jpeg"
        });
      }
    };

    fetchUser();
  }, [username]);

  if (!user) return <p>Cargando...</p>;

  const handleEdit = () => {
    window.location.href = "/userconfig";
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.mainTitle}>Mi Perfil</h1>

      <div className={styles.container}>
        {/* IZQUIERDA */}
        <div className={styles.left}>
          <img
            src={user.imageUrl ?? "/parmero.jpeg"}
            alt="Foto de perfil"
            className={styles.avatar}
          />

          <div className={styles.dataList}>
            <p><span>Nombre(s):</span> {user.nombre}</p>
            <p><span>Apellidos:</span> {user.apellidos}</p>
            <p><span>Usuario:</span> {user.username}</p>
            <p><span>Correo Electrónico:</span> {user.email}</p>
            <p><span>Teléfono:</span> {user.phone}</p>
            <p><span>Fecha de Nacimiento:</span> {user.fechaNacimiento}</p>
            <p><span>Cédula:</span> {user.cc}</p>
          </div>

          <ButtonAction text="Editar" onClick={handleEdit} />
        </div>
        <div className={styles.divider}></div>
        {/* DERECHA — SALDOS */}
        <div className={styles.right}>
          <div className={styles.itemCard}>
            <p className={styles.label}>SALDO</p>
            <div className={styles.diamondWrapper}>
               <img src="/box.png" className={styles.diamondBox} />
               <span className={styles.amount}>${user.saldo}</span>
            </div>
          </div>


          <div className={styles.itemCard}>
            <p className={styles.label}>GANANCIAS TOTALES</p>
            <div className={styles.diamondWrapper}>
               <img src="/box.png" className={styles.diamondBox} />
               <span className={styles.amount}>${user.ganancias}</span>
            </div>
          </div>

          <div className={styles.itemCard}>
            <p className={styles.label}>PERDIDAS TOTALES</p>
            <div className={styles.diamondWrapper}>
               <img src="/box.png" className={styles.diamondBox} />
               <span className={styles.amount}>${user.perdidas}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileCard;
