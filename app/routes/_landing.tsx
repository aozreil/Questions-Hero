import Header from "~/components/UI/Header";
import {Outlet} from "@remix-run/react";

export default function Landing() {
    return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}