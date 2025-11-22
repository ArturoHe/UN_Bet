import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

type Props = {};

function index({}: Props) {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default index;
