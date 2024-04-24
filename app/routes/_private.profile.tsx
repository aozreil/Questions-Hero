import { useAuth } from "~/context/AuthProvider";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getMeStats } from "~/apis/questionsAPI";
import { json } from "@remix-run/node";
import { Skeleton } from "~/components/UI/Skeleton";
import { UserProfileInfo } from "~/components/widgets/UserProfileInfo";

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
  return <LoadingContent />;
}

export default function UserProfilePage() {
  const data = useLoaderData<typeof clientLoader>();
  const { user } = useAuth();
  if (!user) {
    return <LoadingContent />;
  }
  return <>
    <div className="container flex md:space-x-12 md:space-y-0 space-y-4 pt-10 flex-col md:flex-row lg:px-4 pb-44">
      <UserProfileInfo user={user} links={
        [
          {
            title: "About",
            slug: "/profile"
          }, {
          title: "Answers",
          slug: "/profile/answers",
          value: data.answers_count
        }, {
          title: "Questions",
          slug: "/profile/questions",
          value: data.questions_count
        }
        ]
      } />
      <div className="px-2 md:px-0 w-full">
        <div className="p-4 md:p-10 bg-white rounded-lg shadow-md w-full">
          <Outlet />
        </div>
      </div>
    </div>
  </>;
}

function LoadingContent() {
  return <div data-cy={'LoadingContent'} className="container flex md:space-x-12 md:space-y-0 space-y-4 pt-10 flex-col md:flex-row lg:px-4 pb-44">
    <Skeleton className="w-full bg-white min-w-[176px] md:w-auto min-h-[90px] items-center top-24">
      <div className="w-full h-full bg-slate-200"></div>
    </Skeleton>
    <Skeleton className="h-[452px] md:h-[573px] bg-white rounded-lg shadow-md w-full">
      <div className="w-full h-full bg-slate-200"></div>
    </Skeleton>
  </div>;
}
