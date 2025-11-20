import styles from './styles.module.css';

interface LeftPanelProps {
  winnings: number;
  balance: number;
}

export default function LeftPanel({ winnings, balance }: LeftPanelProps) {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.label}>GANANCIAS</div>
        <div className={styles.value}>
          <span className={styles.coin}>🪙</span>${winnings.toFixed(2)}
        </div>
      </div>
      <div className={styles.box}>
        <div className={styles.label}>SALDO</div>
        <div className={styles.value}>
          <span className={styles.heart}>❤️</span>${balance.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
