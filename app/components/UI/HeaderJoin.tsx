import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useAuth } from "~/context/AuthProvider";
import { getUserInitials } from "~/utils";
import { Link } from "@remix-run/react";

export default function HeaderJoin() {
  const { openLoginModal, openSignUpModal, logout, user, isLoadingUserData } = useAuth();
  return (
    !user
      ? (
        <>
          <div className="bg-[#dfe4ea] h-5 w-0.5 max-lg:hidden" />
          <button data-cy="header-login" onClick={openLoginModal} className={"hidden sm:block"}>Log in</button>
          <button data-cy="header-join" onClick={openSignUpModal} className="text-white px-5 py-2 rounded-2xl bg-[#070707]">
            <span className='max-sm:hidden'>Join for free</span>
            <span className='sm:hidden whitespace-nowrap'>Join Us</span>
          </button>
        </>
      ) : (
        <>
          <div className="bg-[#dfe4ea] h-5 w-0.5 max-sm:hidden" />
          <Menu data-cy="header-user" as="div" className="relative">
            <Menu.Button
              className="cursor-pointer overflow-hidden h-9 w-9 bg-[#002237] text-white text-sm flex items-center justify-center
                        rounded-full border border-[#070707] flex-shrink-0 font-semibold"
            >
              {user?.picture
                ? <img src={user.picture} alt="user-profile" className="w-full h-full" />
                : getUserInitials(user?.view_name)
              }
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
              <Menu.Items
                className="absolute -right-2 top-10 w-44 p-3 text-[#4d6473] bg-white border border-[#e8e8e8] rounded-md space-y-2">
                <p className="truncate capitalize px-4">{user?.view_name}</p>
                <Link to="/profile"
                      className="block w-full font-semibold rounded-md bg-white py-2 text-sm hover:bg-gray-50 text-left px-4">
                  Profile
                </Link>
                <button
                  className="cursor-pointer font-semibold rounded-md bg-white py-2 text-sm hover:bg-gray-50 w-full text-left px-4"
                  data-cy='user-menu-logout'
                  onClick={logout}
                >
                  Logout
                </button>
              </Menu.Items>
            </Transition>
          </Menu>
        </>
      )
  );
}
