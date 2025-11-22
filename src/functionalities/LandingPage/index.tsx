import { useEffect } from "react";

import LandingPageFirst from "../../components/LandingPageFirst";

type Props = { title: string };

function LandingPage({ title }: Props) {
  useEffect(() => {
    document.title = title;
  });

  return (
    <>
      <LandingPageFirst />
    </>
  );
}

export default LandingPage;
