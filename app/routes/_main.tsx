import Header from "~/components/UI/Header";
import { Outlet } from "@remix-run/react";

export default function Main() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}