import { X } from "lucide-react";
import styles from "./styles.module.css";

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBetSelect: (bet: number) => void;
  selectedBet: number;
}

const BET_OPTIONS = [
  [1, 2, 3, 4, 5, 6, 7, 8],
  [9, 10, 12, 14, 16, 18, 20, 25],
  [30, 35, 40, 45, 50, 55, 60, 65],
  [70, 75, 80, 85, 90, 95, 100, 125],
  [150, 175, 200, 250, 300, 350, 400, 500],
];

export default function BetModal({
  isOpen,
  onClose,
  onBetSelect,
  selectedBet,
}: BetModalProps) {
  if (!isOpen) return null;

  const handleBetClick = (bet: number) => {
    onBetSelect(bet);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>OPCIONES DE APUESTA</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.grid}>
          {BET_OPTIONS.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              {row.map((bet) => (
                <button
                  key={bet}
                  className={`${styles.betOption} ${
                    selectedBet === bet ? styles.selected : ""
                  }`}
                  onClick={() => handleBetClick(bet)}
                >
                  ${bet}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
