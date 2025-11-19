// GameCard.jsx
//import React from "react";
import type { MouseEventHandler } from "react";
import styles from "./style.module.css";

type GameCardProps = {
  title: string;
  image: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function GameCard({ title, image, onClick }: GameCardProps) {
  return (
    <button className={styles.gameCard} onClick={onClick}>
      <img src={image} alt={title} className={styles.gameCardImage} />
      <h2 className={styles.gameCardTitle}>{title}</h2>
    </button>
  );
}
