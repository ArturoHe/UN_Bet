import { useState, useEffect, useCallback, useRef } from "react";
import BetSelector from "../../components/BetSelector";
import BetModal from "../../components/BetModal";
import LeftPanel from "../../components/LeftPanel";
import styles from "./styles.module.css";
import SlotMachine, { SYMBOLS } from "../../components/SlotMachine";
import { slotMachineApi } from "../../api/slotMachineApi";

type Props = { title: string };

export default function SlotMachinePage({ title }: Props) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  const [winnings, setWinnings] = useState(0);
  const [balance, setBalance] = useState(0);
  const [selectedBet, setSelectedBet] = useState(20);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [result, setResult] = useState<number[] | null>(null);
  const [lastWin, setLastWin] = useState<number>(0);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [clientSeed, setClientSeed] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const pendingWinRef = useRef<number>(0);
  const backendWinAmountRef = useRef<number>(0);
  const pendingBalanceRef = useRef<number | null>(null);

  // Generar client seed aleatorio
  const generateClientSeed = useCallback(() => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }, []);

  // Inicializar sesión y obtener saldo
  useEffect(() => {
    const initializeGame = async () => {
      try {
        setIsLoading(true);

        // Crear sesión
        const session = await slotMachineApi.createSession();
        setSessionId(session.session_id);

        // Generar client seed
        const seed = generateClientSeed();
        setClientSeed(seed);

        // Obtener saldo
        const balanceData = await slotMachineApi.getBalance();
        setBalance(balanceData.saldo);
      } catch (error) {
        console.error("Error al inicializar el juego:", error);
        alert(
          "Error al conectar con el servidor. Por favor, intenta más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializeGame();
  }, [generateClientSeed]);

  const handleSpin = useCallback(async () => {
    if (isSpinning || !sessionId || !clientSeed) {
      return;
    }

    // Verificar saldo
    if (balance < selectedBet) {
      alert("Saldo insuficiente para realizar esta apuesta");
      return;
    }

    try {
      setIsSpinning(true);
      setLastWin(0);
      pendingWinRef.current = 0;

      // Realizar la apuesta en el backend usando /bet que actualiza la DB
      const response = await slotMachineApi.placeBet(sessionId, {
        client_seed: clientSeed,
        bet: {
          amount: selectedBet,
        },
      });

      // Verificar que tenemos los datos del spin
      if (!response.spin) {
        throw new Error("Respuesta del backend sin datos del spin");
      }

      // Convertir los símbolos del backend a índices
      const symbolIndices = response.spin.symbols.map((symbol) => {
        const index = SYMBOLS.indexOf(symbol);
        return index !== -1 ? index : 0;
      });

      // Guardar las ganancias del backend para mostrarlas después
      backendWinAmountRef.current = response.spin.win_amount;

      // Guardar el saldo actualizado pero NO mostrarlo todavía
      if (response.balance !== undefined) {
        pendingBalanceRef.current = response.balance;
      } else {
        // Fallback: consultar saldo actualizado de la DB

        const balanceData = await slotMachineApi.getBalance();

        pendingBalanceRef.current = balanceData.saldo;
      }

      // Establecer resultado para la animación
      setTimeout(() => {
        setResult(symbolIndices);
      }, 100);

      // Generar nuevo client seed para la próxima jugada
      setClientSeed(generateClientSeed());
    } catch (error: any) {
      console.error("Error al girar:", error);

      // Si hay error, restaurar el estado
      setIsSpinning(false);
      setResult(null);

      // Mostrar mensaje de error apropiado
      if (error.response?.status === 400) {
        alert(
          error.response.data.detail ||
            "Error en la apuesta. Verifica tu saldo."
        );
      } else if (error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
      } else {
        alert("Error al procesar la apuesta. Por favor, intenta de nuevo.");
      }
    }
  }, [
    isSpinning,
    sessionId,
    clientSeed,
    balance,
    selectedBet,
    generateClientSeed,
  ]);

  const handleSpinComplete = useCallback((symbols: string[]) => {
    // Validar que symbols tenga contenido válido
    if (!symbols || symbols.length !== 3 || symbols.some((s) => !s)) {
      console.warn("Símbolos inválidos recibidos:", symbols);
      setIsSpinning(false);
      setResult(null);
      return;
    }

    // Usar las ganancias del backend (ya fueron aplicadas en la DB)
    const win = backendWinAmountRef.current;

    if (win > 0) {
      setWinnings((prev) => prev + win);
      setLastWin(win);
    }

    // Actualizar el saldo AHORA que terminó la animación
    if (pendingBalanceRef.current !== null) {
      setBalance(pendingBalanceRef.current);
      pendingBalanceRef.current = null;
    }

    // Resetear la ref
    backendWinAmountRef.current = 0;

    // Resetear estado

    setIsSpinning(false);
    setResult(null);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Cargando juego...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <LeftPanel winnings={winnings} balance={balance} />
      </div>

      <div className={styles.content}>
        <div className={styles.centerArea}>
          <SlotMachine
            onSpin={handleSpin}
            isSpinning={isSpinning}
            onOpenModal={() => setIsModalOpen(true)}
            result={result}
            onSpinComplete={handleSpinComplete}
          />
        </div>

        <div className={styles.betInfo}>
          <span>
            Apuesta actual: <strong>${selectedBet}</strong>
          </span>
        </div>

        <BetSelector selectedBet={selectedBet} onBetChange={setSelectedBet} />
      </div>

      {/* Popup de ganancia */}
      {lastWin > 0 && (
        <div className={styles.winPopupOverlay} onClick={() => setLastWin(0)}>
          <div className={styles.winPopup} onClick={(e) => e.stopPropagation()}>
            <div className={styles.winPopupEmoji}>🎉🎰🎉</div>
            <div className={styles.winPopupTitle}>¡Felicidades!</div>
            <div className={styles.winPopupAmount}>+${lastWin}</div>
            <button
              className={styles.winPopupButton}
              onClick={() => setLastWin(0)}
            >
              ¡Continuar!
            </button>
          </div>
        </div>
      )}

      <BetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBetSelect={setSelectedBet}
        selectedBet={selectedBet}
      />
    </div>
  );
}
