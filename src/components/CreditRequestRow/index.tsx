import styles from "./style.module.css";

type Props = {
  username: string;
  currentBalance: number;
  requested: number;
  onApprove: () => void;
  onDeny: () => void;
};

export default function CreditRequestRow({
  username,
  currentBalance,
  requested,
  onApprove,
  onDeny,
}: Props) {
  return (
    <div className={styles.row}>
      <p>{username}</p>
      <p>${currentBalance}</p>
      <p>${requested}</p>

      <div className={styles.buttons}>
        <button className={styles.approve} onClick={onApprove}>
          Aprobar
        </button>

        <button className={styles.deny} onClick={onDeny}>
          Denegar
        </button>
      </div>
    </div>
  );
}
