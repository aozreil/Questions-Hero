import { ClientLoaderFunctionArgs, Outlet, useLoaderData, useParams } from "@remix-run/react";
import { Skeleton } from "~/components/UI/Skeleton";
import invariant from "tiny-invariant";
import { getPublicUserProfile } from "~/apis/userAPI";
import { getUSerStatsByUserId } from "~/apis/questionsAPI";
import NotFoundPage from "~/components/UI/NotFoundPage";
import { UserProfileInfo } from "~/components/widgets/UserProfileInfo";


export function shouldRevalidate() {
  return false;
}

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const slug = params.slug;
  invariant(slug, "User Not Found");
  const userId = parseInt(slug.split("-").pop() || slug);
  invariant(!isNaN(userId), "Invalid User Id");
  return await Promise.all([
    getPublicUserProfile(userId),
    getUSerStatsByUserId(userId)
  ]);
};

export function HydrateFallback() {
  return <LoadingContent />;
}

export default function PublicUserProfilePage() {
  const [user, data] = useLoaderData<typeof clientLoader>();
  const params = useParams();
  const slug = params.slug;
  return <>
    <div className="container flex md:space-x-12 md:space-y-0 space-y-4 pt-10 flex-col md:flex-row lg:px-4 pb-44">
      <UserProfileInfo user={user} links={
        [{
          title: "About",
          slug: `/user/${slug}`
        }, {
          title: "Answers",
          slug: `/user/${slug}/answers`,
          value: data.answers_count
        }, {
          title: "Questions",
          slug: `/user/${slug}/questions`,
          value: data.questions_count
        }
        ]
      } />
      <div className="px-2 md:px-0 w-full">
        <div className="p-4 md:p-10 bg-white rounded-lg shadow-md w-full">
          <Outlet context={{ user }} />
        </div>
      </div>
    </div>
  </>;
}

function LoadingContent() {
  return <div className="container flex md:space-x-12 md:space-y-0 space-y-4 pt-10 flex-col md:flex-row lg:px-4 pb-44">
    <Skeleton className="w-full bg-white min-w-[176px] md:w-auto min-h-[90px] items-center top-24">
      <div className="w-full h-full bg-slate-200"></div>
    </Skeleton>
    <Skeleton className="h-[452px] md:h-[573px] bg-white rounded-lg shadow-md w-full">
      <div className="w-full h-full bg-slate-200"></div>
    </Skeleton>
  </div>;
}


export function ErrorBoundary() {
  return <NotFoundPage />;
}
