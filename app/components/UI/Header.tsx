import { Link, useLocation } from "@remix-run/react";
import HeaderSearch from "~/components/UI/HeaderSearch";
import { useAuth } from "~/context/AuthProvider";
import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { useOverlay } from "~/routes/_main";

export default function Header() {
    const location = useLocation();
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const { openLoginModal, openSignUpModal, logout, user, isLoadingUserData } = useAuth();
    const { focusedOverlayStyles } = useOverlay();
    const shouldHideSearch = location?.pathname === '/';
    return (
      <header className={clsx(
        `sticky top-0 z-40 h-24  px-4 md:px-10 w-full bg-[#f7f8fa] border-t-[3px] border-t-[#070707] max-sm:px-4 pt-7 pb-6`,
        location?.pathname !== '/' && "bg-white border-b-[1px] sm:border-b-[2px] border-[#ebf2f6]",
        isSearchExpanded && focusedOverlayStyles,
      )}>
        <div className={`container flex items-center justify-between`}>
          <div className='flex items-center pr-2 flex-1'>
            <Link to='/' className={clsx('block w-fit mr-5 sm:mr-6', isSearchExpanded && 'hidden')}>
                <img src='/assets/images/logo.svg' alt='logo' className='h-6 sm:h-7 w-auto object-contain' height={24} width={112} />
            </Link>
            {!shouldHideSearch && <HeaderSearch setIsSearchExpanded={setIsSearchExpanded} isSearchExpanded={isSearchExpanded} />}
          </div>
          {isLoadingUserData || isSearchExpanded ? null : !user
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
                    <p
                      className='cursor-pointer font-semibold rounded-md mt-2 bg-white py-2 text-sm hover:bg-gray-50 w-full text-left px-4'
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