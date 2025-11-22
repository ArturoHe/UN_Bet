import { useEffect } from "react";
import CreditsCard from "../../components/CreditsCard";

type Props = {
  title: string;
};

export default function CreditsPage({ title }: Props) {
  useEffect(() => {
    document.title = title;
  }, []);

  return <CreditsCard />;
}
