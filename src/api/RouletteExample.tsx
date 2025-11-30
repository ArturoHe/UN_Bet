import { useState, useEffect } from "react";
import rouletteApi from "../api/rouletteApi";

/**
 * Ejemplo de cómo usar la API de ruleta desde un componente funcional
 */
export default function RouletteExample() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [clientSeed, setClientSeed] = useState("");
  const [lastResult, setLastResult] = useState<any>(null);

  // Generar semilla de cliente
  const generateClientSeed = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  // Crear sesión al montar el componente
  useEffect(() => {
    const initSession = async () => {
      try {
        const session = await rouletteApi.createSession();
        setSessionId(session.session_id);
        setClientSeed(generateClientSeed());
        console.log("Sesión creada:", session);
      } catch (error) {
        console.error("Error al crear sesión:", error);
      }
    };

    initSession();
  }, []);

  // Función para realizar una apuesta y girar
  const handleBetAndSpin = async () => {
    if (!sessionId) return;

    try {
      // 1. Realizar apuesta
      const betResponse = await rouletteApi.placeBet(sessionId, {
        client_seed: clientSeed,
        bet: {
          type: "color",
          side: "red", // Apostar al rojo
          amount: 10,
        },
      });

      console.log("Apuesta realizada:", betResponse);

      // 2. Girar la ruleta
      const spinResult = await rouletteApi.spin(sessionId, clientSeed);
      console.log("Resultado:", spinResult);

      setLastResult(spinResult);
      setClientSeed(generateClientSeed()); // Nueva semilla para el próximo giro
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Función para solo girar (sin apuesta)
  const handleSpinOnly = async () => {
    if (!sessionId) return;

    try {
      const spinResult = await rouletteApi.spin(sessionId, clientSeed);
      console.log("Resultado:", spinResult);

      setLastResult(spinResult);
      setClientSeed(generateClientSeed());
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Función para obtener el hash de la sesión
  const getSessionHash = async () => {
    if (!sessionId) return;

    try {
      const hashData = await rouletteApi.getSessionHash(sessionId);
      console.log("Hash de sesión:", hashData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Ejemplo de API de Ruleta</h2>

      <div>
        <p>Session ID: {sessionId || "Cargando..."}</p>
        <p>Client Seed: {clientSeed.substring(0, 20)}...</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleBetAndSpin}>Apostar al Rojo y Girar</button>
        <button onClick={handleSpinOnly} style={{ marginLeft: "10px" }}>
          Solo Girar
        </button>
        <button onClick={getSessionHash} style={{ marginLeft: "10px" }}>
          Obtener Hash
        </button>
      </div>

      {lastResult && (
        <div
          style={{ marginTop: "20px", padding: "10px", background: "#f0f0f0" }}
        >
          <h3>Último Resultado:</h3>
          <p>Número: {lastResult.pocket}</p>
          <p>Color: {lastResult.color}</p>
          <p>Nonce: {lastResult.nonce}</p>
          <p>HMAC: {lastResult.hmac_hex.substring(0, 20)}...</p>
        </div>
      )}
    </div>
  );
}
