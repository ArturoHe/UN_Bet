import { useEffect } from "react";

type Props = {
  title: string;
};

export default function Roulette({ title }: Props) {
  useEffect(() => {
    document.title = title;
  });
  return <div></div> ;
}

