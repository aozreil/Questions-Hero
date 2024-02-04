import {Link} from "@remix-run/react";

interface Props {
    className?: string;
}

export default function Header({ className }: Props) {
    return (
        <header className={`w-full border-t-[3px] border-t-[#070707] px-4 md:px-[55px] pt-[27px] pb-[24px] ${className}`}>
            <Link to='/'>
                <img src='/assets/images/logo.svg' alt='logo' className='h-7' />
            </Link>
        </header>
    )
}