import Header from "~/components/UI/Header";
import { Outlet } from "@remix-run/react";
import SlidesProvider from "~/context/SlidesProvider";

export default function Landing() {
  return (
    <SlidesProvider>
      <Header />
      <Outlet />
    </SlidesProvider>
  );
}