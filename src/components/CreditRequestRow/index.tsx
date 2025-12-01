import styles from "./style.module.css";

type Props = {
  user_id: number;
  amount: number;
  note: string;
  onApprove: () => void;
  onDeny: () => void;
};

export default function CreditRequestRow({
  user_id,
  amount,
  note,
  onApprove,
  onDeny,
}: Props) {
  return (
    <div className={styles.row}>
      <p>{user_id}</p>
      <p>${amount}</p>
      <p>${note}</p>

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
