import Header from "~/components/UI/Header";
import { Outlet, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { useAuth } from "~/context/AuthProvider";
import Footer from "~/components/UI/Footer";
import { Toaster } from "react-hot-toast";

export default function PrivatePage() {
  const { user, isLoadingUserData } = useAuth();
  const navigator = useNavigate();
  useEffect(() => {
    if (!user && !isLoadingUserData) {
      //TODO: Need to check expected in this case 0r move to loader
      navigator("/");
    }
  }, [navigator, user, isLoadingUserData]);
  return (
    <>
      <Toaster position='bottom-right' />
      <Header />
      <Outlet />
      <div className='flex w-full mt-auto'>
        <Footer />
      </div>
    </>
  );
}
