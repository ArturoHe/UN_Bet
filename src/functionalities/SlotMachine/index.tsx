import { useEffect } from "react";

type Props = {
  title: string;
};

function SlotMachine({ title }: Props) {
  useEffect(() => {
    document.title = title;
  });
  return <div></div> ;
}

export default SlotMachine;
