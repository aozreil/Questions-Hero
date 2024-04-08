import UserProfile from "~/components/UI/UserProfile";
import { useAuth } from "~/context/AuthProvider";
import { NavLink, Outlet } from "@remix-run/react";
import clsx from "clsx";


const LINKS = [{
  title: "About",
  slug: "/profile"
}, {
  title: "Answers",
  slug: "/profile/answers"
}, {
  title: "Questions",
  slug: "/profile/questions"
}
];

export default function UserProfilePage() {
  const { user } = useAuth();
  if (!user) {
    return <div>Loading...</div>;
  }
  return <div className="container flex md:space-x-12 md:space-y-0 space-y-4 pt-10 flex-col md:flex-row lg:px-4">
    <div className="items-center p-4">
      <div className="md:space-y-4 md:space-x-0 space-x-4 flex md:block items-center">
        <UserProfile user={user} className="md:w-36 md:h-36 border-0 shadow-md" />
        <p className="capitalize text-black font-bold text-2xl text-center">
          {user.view_name}
        </p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-1 gap-4 mt-4">
        {LINKS.map(({ title, slug }) => {
          return <NavLink className={({ isActive }) => {
            return clsx("text-xl relative text-center md:text-left", {
              "text-black font-medium	": isActive,
              "text-[#99a7af] hover:text-[#070707]": !isActive
            });
          }} to={slug} key={slug} end>
            {({ isActive }) => {
              return <>
                {isActive && <div
                  className="absolute bottom-0 h-1.5 -mb-2 md:mb-0 w-full md:w-2 md:h-full md:left-0 md:-ml-4 bg-black"></div>}
                {title}
              </>;
            }}

          </NavLink>;
        })}
      </div>
    </div>
    <div className="p-10 bg-white rounded-lg shadow-md w-full">
      <Outlet />
    </div>
  </div>;
}