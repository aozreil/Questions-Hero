import {PRODUCT_LOGO_IMAGE} from "~/config/enviromenet";
import {Link, useNavigate, useLocation} from "@remix-run/react";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const isLandingPage = location.pathname === '/';

    return (
        <header className={
            `sticky top-0 z-40 h-fit  w-full bg-[#f7f8fa] flex items-center justify-start border-t-[3px] border-t-[#070707] max-sm:px-4 pt-3 pb-3`
        }>
            <Link to={"/"}>
                <img src={"/assets/images/prepida-logo.svg"} width={100} height={50} alt={"prepida-log"}/>
            </Link>
            {!isLandingPage && (
                <form
                    className="relative ml-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        const term = (event.target as HTMLFormElement).input?.value;
                        navigate(`/search?term=${term}`);
                    }}
                >
                    <img
                        src="/assets/images/search-icon.svg"
                        className="cursor-pointer absolute top-[6px] left-2 flex-shrink-0 w-5 h-5"
                    />
                    <input
                        name="input"
                        placeholder="Search for Academic solutions"
                        className="border border-black rounded-2xl md:min-w-72 pl-9 py-1 placeholder:text-gray-500 placeholder:text-sm"
                    />
                </form>
            )}
        </header>
    )
}