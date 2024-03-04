import { Link, useLocation } from "@remix-run/react";
import HeaderSearch from "~/components/UI/HeaderSearch";
import { useAuth } from "~/context/AuthProvider";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

export default function Header() {
    const location = useLocation();
    const { openLoginModal, openSignUpModal, logout, user, isLoadingUserData } = useAuth();
    const shouldHideShowSearch = location?.pathname?.includes('landing');
    return (
      <header className={`sticky top-0 z-40 h-24  px-4 md:px-10 w-full bg-[#f7f8fa] border-t-[3px] border-t-[#070707] max-sm:px-4 pt-7 pb-6
     ${location?.pathname?.includes("question") ? "bg-white border-b-[3px] border-[#ebf2f6]" : ""}`}>
        <div className={`container flex items-center justify-between`}>
          <div className='flex items-center'>
            <Link to='/' className='block w-fit mr-6'>
                <img src='/assets/images/logo.svg' alt='logo' className='h-5 sm:h-7' />
            </Link>
            {!shouldHideShowSearch && <HeaderSearch className='max-md:hidden' />}
          </div>
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
                      <p className='truncate'>{user?.view_name}</p>
                      <p
                        className='cursor-pointer font-semibold'
                        onClick={logout}
                      >
                        Logout
                      </p>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )
            }
        </div>
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