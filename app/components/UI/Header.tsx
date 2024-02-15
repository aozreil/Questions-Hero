import {Link, useLocation} from "@remix-run/react";

export default function Header() {
    const location = useLocation();
    return (
        <header className={`sticky top-0 z-50 w-full bg-[#f7f8fa] border-t-[3px] border-t-[#070707] px-4 md:px-14 pt-7 pb-6
         ${location?.pathname?.includes('question') ? 'bg-white  border-b-[3px] border-[#ebf2f6]' : ''}`}>
            <Link to='/'>
                <img src='/assets/images/logo.svg' alt='logo' className='h-7' />
            </Link>
        </header>
    )
}