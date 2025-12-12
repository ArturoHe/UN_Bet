import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./styles.module.css";

// Símbolos del tragamonedas con sus valores
export const SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎", "7️⃣"];
export const SYMBOL_VALUES: Record<string, number> = {
  "🍒": 2,
  "🍋": 3,
  "🍊": 5,
  "🍇": 8,
  "⭐": 15,
  "💎": 25,
  "7️⃣": 50,
};

const VISIBLE_SYMBOLS = 3; // Símbolos visibles en cada carrete
const TOTAL_SYMBOLS = SYMBOLS.length;

interface SlotMachineProps {
  onSpin: () => void;
  isSpinning: boolean;
  onOpenModal?: () => void;
  result?: number[] | null; // Resultado del backend [índice0, índice1, índice2]
  onSpinComplete?: (symbols: string[]) => void;
}

export default function SlotMachine({
  onSpin,
  isSpinning,
  onOpenModal,
  result,
  onSpinComplete,
}: SlotMachineProps) {
  // Cada carrete tiene su propio array de símbolos para mostrar
  const [reelSymbols, setReelSymbols] = useState<string[][]>(() => {
    // Inicializar cada carrete con símbolos aleatorios
    return [0, 1, 2].map(() => {
      const startIdx = Math.floor(Math.random() * TOTAL_SYMBOLS);
      return Array.from(
        { length: VISIBLE_SYMBOLS },
        (_, i) => SYMBOLS[(startIdx + i) % TOTAL_SYMBOLS]
      );
    });
  });

  const [spinningReels, setSpinningReels] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [winLine, setWinLine] = useState<boolean>(false);
  const [hasSpun, setHasSpun] = useState<boolean>(false);

  const animationRef = useRef<number[]>([]);
  const completedReelsRef = useRef<number>(0);
  const finalResultRef = useRef<number[]>([0, 0, 0]);
  const reelIndexRef = useRef<number[]>([0, 0, 0]); // Índice actual de cada carrete

  // Función para animar un carrete cambiando los símbolos
  const animateReel = useCallback(
    (
      reelIndex: number,
      targetIndex: number,
      duration: number,
      onComplete: () => void
    ) => {
      const startTime = performance.now();
      let lastSymbolChange = startTime;
      const symbolChangeInterval = 80; // Cambiar símbolo cada 80ms al inicio
      let currentIdx = reelIndexRef.current[reelIndex];

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Velocidad decrece con el tiempo (ease-out)
        const speedFactor = Math.max(0.1, 1 - Math.pow(progress, 2));
        const currentInterval = symbolChangeInterval / speedFactor;

        // Cambiar símbolos basado en el intervalo actual
        if (currentTime - lastSymbolChange > currentInterval) {
          lastSymbolChange = currentTime;
          currentIdx = (currentIdx + 1) % TOTAL_SYMBOLS;

          // Actualizar los 3 símbolos visibles del carrete
          setReelSymbols((prev) => {
            const newReels = [...prev];
            newReels[reelIndex] = Array.from(
              { length: VISIBLE_SYMBOLS },
              (_, i) => SYMBOLS[(currentIdx + i) % TOTAL_SYMBOLS]
            );
            return newReels;
          });
        }

        if (progress < 1) {
          animationRef.current[reelIndex] = requestAnimationFrame(animate);
        } else {
          // Animación completada - establecer resultado final
          setReelSymbols((prev) => {
            const newReels = [...prev];
            newReels[reelIndex] = Array.from(
              { length: VISIBLE_SYMBOLS },
              (_, i) => SYMBOLS[(targetIndex + i) % TOTAL_SYMBOLS]
            );
            return newReels;
          });

          reelIndexRef.current[reelIndex] = targetIndex;

          setSpinningReels((prev) => {
            const newSpinning = [...prev];
            newSpinning[reelIndex] = false;
            return newSpinning;
          });

          onComplete();
        }
      };

      animationRef.current[reelIndex] = requestAnimationFrame(animate);
    },
    []
  );

  // Función que se llama cuando un carrete termina
  const handleReelComplete = useCallback(() => {
    completedReelsRef.current += 1;

    `Carrete completado. Total: ${completedReelsRef.current}/3`;

    // Cuando todos los carretes terminan
    if (completedReelsRef.current >= 3) {
      // Obtener los símbolos del medio (índice 1) de cada carrete
      const middleSymbols = finalResultRef.current.map((idx) => SYMBOLS[idx]);

      // Verificar si todos los símbolos del medio son iguales (línea ganadora)
      if (
        middleSymbols[0] === middleSymbols[1] &&
        middleSymbols[1] === middleSymbols[2]
      ) {
        setWinLine(true);
      }

      // Llamar callback de completado con los símbolos del medio
      if (onSpinComplete) {
        onSpinComplete(middleSymbols);
      } else {
        console.warn("onSpinComplete no está definido");
      }
    }
  }, [onSpinComplete]);

  // Efecto para manejar el inicio del giro
  useEffect(() => {
    if (isSpinning && result && result.length === 3) {
      setWinLine(false);
      setHasSpun(true);
      completedReelsRef.current = 0;
      finalResultRef.current = [...result]; // Guardar resultado objetivo

      // Duraciones diferentes para cada carrete
      const durations = [1800, 2400, 3000];
      const delays = [0, 200, 400];

      // Iniciar animación para cada carrete con delay
      result.forEach((targetIndex, reelIndex) => {
        setSpinningReels((prev) => {
          const newSpinning = [...prev];
          newSpinning[reelIndex] = true;
          return newSpinning;
        });

        setTimeout(() => {
          animateReel(
            reelIndex,
            targetIndex,
            durations[reelIndex],
            handleReelComplete
          );
        }, delays[reelIndex]);
      });
    }
  }, [isSpinning, result, animateReel, handleReelComplete]);

  // Limpiar animaciones al desmontar
  useEffect(() => {
    return () => {
      animationRef.current.forEach((id) => cancelAnimationFrame(id));
    };
  }, []);

  // Verificar si está girando
  const isCurrentlySpinning = isSpinning || spinningReels.some((s) => s);

  const handleSpinClick = () => {
    if (!isCurrentlySpinning) {
      setWinLine(false);
      completedReelsRef.current = 0;
      onSpin();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.machine}>
        <div className={styles.frame}>
          {/* Luces decorativas superiores */}
          <div className={styles.lights}>
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`${styles.light} ${winLine ? styles.lightWin : ""}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>

          <div className={styles.reelsContainer}>
            {/* Indicador de línea ganadora */}
            <div
              className={`${styles.winIndicator} ${
                winLine ? styles.winIndicatorActive : ""
              }`}
            >
              <span>➤</span>
            </div>

            {[0, 1, 2].map((reelIndex) => (
              <div key={reelIndex} className={styles.reelWrapper}>
                <div
                  className={`${styles.reel} ${
                    spinningReels[reelIndex] ? styles.spinning : ""
                  }`}
                >
                  {reelSymbols[reelIndex].map((symbol, idx) => (
                    <div
                      key={idx}
                      className={`${styles.symbol} ${
                        idx === 1 ? styles.symbolMiddle : ""
                      }`}
                    >
                      {symbol}
                    </div>
                  ))}
                </div>
                {/* Sombras para efecto 3D */}
                <div className={styles.reelShadowTop} />
                <div className={styles.reelShadowBottom} />
              </div>
            ))}

            {/* Indicador de línea ganadora derecho */}
            <div
              className={`${styles.winIndicatorRight} ${
                winLine ? styles.winIndicatorActive : ""
              }`}
            >
              <span>➤</span>
            </div>
          </div>

          {/* Luces decorativas inferiores */}
          <div className={styles.lights}>
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`${styles.light} ${winLine ? styles.lightWin : ""}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        {/* Botón de girar */}
        <button
          className={`${styles.spinButton} ${
            isCurrentlySpinning ? styles.spinButtonActive : ""
          }`}
          onClick={handleSpinClick}
          disabled={isCurrentlySpinning}
        >
          <div className={styles.spinButtonInner}>
            {isCurrentlySpinning ? (
              <div className={styles.spinnerIcon} />
            ) : (
              <span>SPIN</span>
            )}
          </div>
        </button>

        {/* Botón para abrir modal de apuestas */}
        {onOpenModal && (
          <button
            className={styles.coinsButton}
            onClick={onOpenModal}
            aria-label="Abrir selector de apuestas"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Mensaje de victoria - solo mostrar si ya hubo un giro */}
      {winLine && hasSpun && (
        <div className={styles.winMessage}>
          <span>🎉 ¡GANASTE! 🎉</span>
        </div>
      )}
    </div>
  );
}
