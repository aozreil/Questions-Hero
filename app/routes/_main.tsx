import Header from "~/components/UI/Header";
import {Outlet} from "@remix-run/react";

export default function Main() {
    return (
        <div className='relative min-h-screen bg-[#f7f8fa]'>
            <Header />
            <div className='w-screen h-full overflow-y-auto overflow-x-hidden'>
                <Outlet />
            </div>
        </div>
    )
}