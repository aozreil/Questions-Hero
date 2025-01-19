import Header from "~/components/UI/Header";
import { Outlet } from "@remix-run/react";
import { Toaster } from "react-hot-toast";

export default function Main() {
  return (
    <>
      {/*<Toaster position='bottom-right' />*/}
      <Header />
      <Outlet />
    </>
  );
}
