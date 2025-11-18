import GameCard from "../../components/GameCard";
import { useEffect } from "react";
import styles from "./style.module.css";
import { useNavigate } from "react-router-dom";



type Props = {
  title: string;
};

export default function GameSelector({ title }: Props) {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = title;
      }, [title]);
  return (
    <div className={styles.background}>
        <div className={styles.container}>
            <GameCard
                title="Ruleta"
                image="ruleta.png"
                onClick={() => navigate("/ruleta")}
            />

            <GameCard
                title="Tragamonedas"
                image="tragamonedas.png"
                onClick={() => navigate("/tragamonedas")}
            />
        </div>
      
    </div>
  );
}
