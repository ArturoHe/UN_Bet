import { useEffect } from "react";
import UserProfileCard from "../../components/UserProfileCard";
import styles from "./style.module.css";

type Props = { title: string };

function UserProfile({ title }: Props) {

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className={styles.background}>
      <UserProfileCard />
    </div>
  );
}

export default UserProfile;
