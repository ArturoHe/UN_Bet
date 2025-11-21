import { useEffect } from "react";
import styles from "./style.module.css";

import EditUserForm from "../../components/EditUserForm";

type Props = { title: string };

function UserConfig({ title }: Props) {
  useEffect(() => {
    document.title = title;
  });
  return ( 
      <div className={styles.background}>
        <div className="mt-4">
          <EditUserForm />
        </div>
      </div>
    
  );
}

export default UserConfig;
