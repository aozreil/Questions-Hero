import UserProfile from "~/components/UI/UserProfile";
import { NavLink } from "@remix-run/react";
import clsx from "clsx";
import { IMeUser, IUser } from "~/models/questionModel";


interface IProps {
  user: IUser | IMeUser,
  links: { title: string, slug: string, value?: number }[]
}

export function UserProfileInfo({ user, links }: IProps) {
  return <div className="items-center p-4 sticky h-max top-24 -mt-1 bg-[#F7F8FA] z-10">
    <div className="md:space-y-4 md:space-x-0 space-x-4 flex md:block items-center">
      <UserProfile user={user} className="md:w-36 md:h-36 border-0 shadow-md" />
      <p className="capitalize text-black font-bold text-2xl text-center">
        {user.view_name}
      </p>
    </div>

    <div className="grid grid-cols-3 md:grid-cols-1 gap-4 mt-4">
      {links.map(({ title, slug, value }) => {
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
              {title} {value !== undefined && (<span>({value})</span>)}
            </>;
          }}
        </NavLink>;
      })}
    </div>
  </div>;
}
