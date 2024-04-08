import Header from "~/components/UI/Header";
import { Outlet, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { useAuth } from "~/context/AuthProvider";

export default function PrivatePage() {
  const { user, isLoadingUserData } = useAuth();
  const navigator = useNavigate();
  useEffect(() => {
    if (!user && !isLoadingUserData) {
      //TODO: Need to check expected in this case
      navigator("/");
    }
  }, [navigator, user, isLoadingUserData]);
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}