import UserProfile from "~/components/UI/UserProfile";
import { useAuth } from "~/context/AuthProvider";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import Loader from "~/components/UI/Loader";
import { getMeStats } from "~/apis/questionsAPI";
import { json } from "@remix-run/node";


const LINKS = [
  {
    title: "About",
    slug: "/profile",
    key: ""
  }, {
    title: "Answers",
    slug: "/profile/answers",
    key: "answers_count"
  }, {
    title: "Questions",
    slug: "/profile/questions",
    key: "questions_count"
  }
];

export function shouldRevalidate() {
  return false;
}

export const clientLoader = async () => {
  try {
    return await getMeStats();
  } catch (e) {
    return json({
      answers_count: 0,
      questions_count: 0
    });
  }

};

export function HydrateFallback() {

  //TODO: Fix loading
  return <p>Loading Game...</p>;
}

export default function UserProfilePage() {
  const data = useLoaderData<typeof clientLoader>();
  const { user } = useAuth();
  if (!user) {
    //ToDo: Add Loading skeleton
    return <div className="container flex justify-center mt-20">
      <Loader />
    </div>;
  }
  return <div className="container flex md:space-x-12 md:space-y-0 space-y-4 pt-10 flex-col md:flex-row lg:px-4 pb-44">
    <div className="items-center p-4 sticky h-max top-24">
      <div className="md:space-y-4 md:space-x-0 space-x-4 flex md:block items-center">
        <UserProfile user={user} className="md:w-36 md:h-36 border-0 shadow-md" />
        <p className="capitalize text-black font-bold text-2xl text-center">
          {user.view_name}
        </p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-1 gap-4 mt-4">
        {LINKS.map(({ title, slug, key }) => {
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
                {title} {key && key in data && (<span>({data[key]})</span>)}
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
