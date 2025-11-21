import { useState } from "react";
import ButtonAction from "../ButtonAction";
import styles from "./style.module.css";
import api from "../../api/axiosConfig";
import Button from "../Button";

function EditUserForm() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      alert("Por favor selecciona un archivo");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      await api.put("/profile/image", formData, {
        headers: {
          Authorization: sessionStorage.getItem("jwtToken"),
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Imagen de perfil actualizada");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete("/eliminarperfil", {
        headers: { Authorization: sessionStorage.getItem("jwtToken") },
      });

      alert("Usuario eliminado");
      sessionStorage.clear();
      window.location.href = "/home";
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitPass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const verify = {
      password: formData.get("password"),
      password2: formData.get("password2"),
    };

    if (verify.password !== verify.password2) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const payload = {
      token: sessionStorage.getItem("jwtToken"),
      newPassword: verify.password,
    };

    try {
      await api.post("/update-password", payload);
      alert("Cambio de contraseña exitoso");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.page}>

      {/* Título principal */}
      <h1 className={styles.mainTitle}>Editar Perfil</h1>

      {/* CAMBIO DE CONTRASEÑA */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Cambiar contraseña</h2>
        <form onSubmit={handleSubmitPass} className={styles.form}>
          <input
            required
            name="password"
            type="password"
            className={styles.input}
            placeholder="Nueva contraseña"
          />

          <input
            required
            name="password2"
            type="password"
            className={styles.input}
            placeholder="Repetir contraseña"
          />

          <ButtonAction text="Cambiar" type="submit" />
        </form>
      </section>

      {/* CAMBIO DE FOTO */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Imagen de perfil</h2>

        <form onSubmit={handleUpload} className={styles.form}>
          <input
            type="file"
            name="myImage"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
          />

          <ButtonAction text="Cambiar" type="submit" />
        </form>
      </section>

      {/* ELIMINAR CUENTA */}
      <div className={styles.deleteContainer}>
        <Button text="Eliminar cuenta" onClick={handleDelete} />
      </div>
    </div>
  );
}

export default EditUserForm;
