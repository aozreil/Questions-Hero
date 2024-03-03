import { Link, useLocation } from "@remix-run/react";
import HeaderSearch from "~/components/UI/HeaderSearch";
import { useAuth } from "~/context/AuthProvider";

export default function Header() {
  const location = useLocation();
  const { openLoginModal, openSignUpModal } = useAuth();
  return (
    <header className={`sticky top-0 z-40 w-full bg-[#f7f8fa] border-t-[3px] border-t-[#070707] max-sm:px-4 pt-7 pb-6
     ${location?.pathname?.includes("question") ? "bg-white border-b-[3px] border-[#ebf2f6]" : ""}`}>
      <div className={`container flex items-center justify-between`}>
        <div className='flex items-center'>
          <Link to="/" className="block w-fit mr-6">
            <img src="/assets/images/logo.svg" alt="logo" className="h-5 sm:h-7" />
          </Link>
          <HeaderSearch />
        </div>
        <section className="text-[#1a384b] max-sm:text-sm font-medium flex items-center gap-3 sm:gap-5">
          <button onClick={openLoginModal} className="hidden sm:block">Log in</button>
          <button onClick={openSignUpModal} className="text-white px-5 py-2 rounded-2xl bg-[#070707]">
            Join for free
          </button>
        </section>
      </div>
    </header>
  );
}