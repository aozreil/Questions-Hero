import {Link, useLocation} from "@remix-run/react";
import HeaderSearch from "~/components/UI/HeaderSearch";
import { useAuth } from "~/context/AuthProvider";

export default function Header() {
    const location = useLocation();
    const { openLoginModal, openSignUpModal } = useAuth();
    return (
        <header className={`sticky flex items-center justify-between top-0 z-40 w-full bg-[#f7f8fa] border-t-[3px] border-t-[#070707] px-4 md:px-14 pt-7 pb-6
         ${location?.pathname?.includes('question') ? 'bg-white  border-b-[3px] border-[#ebf2f6]' : ''}`}>
            <Link to='/' className='block w-fit'>
                <img src='/assets/images/logo.svg' alt='logo' className='h-5 sm:h-7' />
            </Link>
          {location?.pathname?.includes('question') && <HeaderSearch />}
          <section className='text-[#1a384b] max-sm:text-sm font-medium flex items-center gap-3 sm:gap-5'>
            <button onClick={openLoginModal}>Log in</button>
            <button onClick={openSignUpModal} className='text-white px-5 py-2 rounded-2xl bg-[#070707]'>
              Join for free
            </button>
          </section>
        </header>
    )
}