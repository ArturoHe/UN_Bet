import { useState, useEffect, useCallback, useRef } from "react";
import BetSelector from "../../components/BetSelector";
import BetModal from "../../components/BetModal";
import LeftPanel from "../../components/LeftPanel";
import styles from "./styles.module.css";
import SlotMachine, { SYMBOLS, SYMBOL_VALUES } from "../../components/SlotMachine";

type Props = { title: string };

export default function SlotMachinePage({ title }: Props) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  const [winnings, setWinnings] = useState(0);
  const [balance, setBalance] = useState(10000);
  const [selectedBet, setSelectedBet] = useState(20);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [result, setResult] = useState<number[] | null>(null);
  const [lastWin, setLastWin] = useState<number>(0);
  
  const pendingWinRef = useRef<number>(0);

  // Función para calcular las ganancias basado en los símbolos
  const calculateWinnings = useCallback((symbols: string[], betAmount: number): number => {
    // Tres símbolos iguales - gran premio
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
      const multiplier = SYMBOL_VALUES[symbols[0]] || 2;
      return betAmount * multiplier;
    }
    
    // Dos símbolos iguales - premio menor
    if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) {
      return Math.floor(betAmount * 1.5);
    }
    
    return 0;
  }, []);

  const handleSpin = useCallback(() => {
    if (isSpinning) return;
    
    // Verificar saldo
    if (balance < selectedBet) {
      alert("Saldo insuficiente para realizar esta apuesta");
      return;
    }

    // Descontar apuesta
    setBalance(prev => prev - selectedBet);
    setIsSpinning(true);
    setLastWin(0);
    pendingWinRef.current = 0;
    
    // Generar resultado aleatorio
    const newResult = [
      Math.floor(Math.random() * SYMBOLS.length),
      Math.floor(Math.random() * SYMBOLS.length),
      Math.floor(Math.random() * SYMBOLS.length),
    ];
    
    setTimeout(() => {
      setResult(newResult);
    }, 100);
  }, [isSpinning, balance, selectedBet]);

  const handleSpinComplete = useCallback((symbols: string[]) => {
    // Validar que symbols tenga contenido válido
    if (!symbols || symbols.length !== 3 || symbols.some(s => !s)) {
      console.warn('Símbolos inválidos recibidos:', symbols);
      setIsSpinning(false);
      setResult(null);
      return;
    }

    // Calcular ganancias
    const win = calculateWinnings(symbols, selectedBet);
    
    if (win > 0) {
      setWinnings(prev => prev + win);
      setBalance(prev => prev + win);
      setLastWin(win);
    }
    
    // Resetear estado
    setIsSpinning(false);
    setResult(null);
  }, [selectedBet, calculateWinnings]);

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
          <span>Apuesta actual: <strong>${selectedBet}</strong></span>
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
            <button className={styles.winPopupButton} onClick={() => setLastWin(0)}>
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
