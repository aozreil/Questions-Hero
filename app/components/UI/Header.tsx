import {Link, useLocation} from "@remix-run/react";
import { useAuth } from "~/context/AuthProvider";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

export default function Header() {
    const location = useLocation();
    const { openLoginModal, openSignUpModal, logout, user, isLoadingUserData } = useAuth();
    return (
        <header className={`sticky flex items-center justify-between top-0 z-40 h-24 w-full bg-[#f7f8fa] border-t-[3px] border-t-[#070707] px-4 md:px-14 pt-7 pb-6
         ${location?.pathname?.includes('question') ? 'bg-white  border-b-[3px] border-[#ebf2f6]' : ''}`}>
            <Link to='/' className='block w-fit'>
                <img src='/assets/images/logo.svg' alt='logo' className='h-5 sm:h-7' />
            </Link>
            {isLoadingUserData ? null : !user
              ? (
                <section className='text-[#1a384b] max-sm:text-sm font-medium flex items-center gap-3 sm:gap-5'>
                  <button onClick={openLoginModal} className={'hidden sm:block'}>Log in</button>
                  <button onClick={openSignUpModal} className='text-white px-5 py-2 rounded-2xl bg-[#070707]'>
                    Join for free
                  </button>
                </section>
              ) : (
                <Menu as='div' className='relative'>
                  <Menu.Button
                    className='cursor-pointer h-9 w-9 bg-[#002237] text-white text-sm flex items-center justify-center
                        rounded-full border-2 border-[#5dc9a1] flex-shrink-0 font-semibold'
                  >
                    {getUserInitials(user?.view_name)}
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className='absolute -right-2 top-10 w-44 p-3 text-[#4d6473] bg-white border border-[#e8e8e8] rounded-md'>
                      <p className='truncate capitalize px-4'>{user?.view_name}</p>
                      <button
                        className='font-semibold rounded-md mt-2 bg-white py-2 text-sm hover:bg-gray-50 w-full text-left px-4'
                        onClick={logout}
                      >
                        Logout
                      </button>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )
            }
        </header>
    )
}

const getUserInitials = (userName?: string) => {
  if (!userName) return 'A';
  const nameFields = userName?.split(' ');
  const firstInitial = nameFields?.[0]?.charAt(0)?.toUpperCase() ?? '';
  const secondInitial = nameFields?.[1]?.charAt(0)?.toUpperCase() ?? '';

  return `${firstInitial}${secondInitial}`
}