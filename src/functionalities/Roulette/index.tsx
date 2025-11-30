import { useEffect } from "react";
import RouletteWrapper from "../../ruleta/RouletteWrapper";
import "../../ruleta/styles.css";

type Props = {
  title: string;
};

export default function Roulette({ title }: Props) {
  useEffect(() => {
    document.title = title;
  });
  return (
    <>
      <RouletteWrapper username={"TEST"} />
    </>
  );
}
