import { getMyAnswersForQuestions } from "~/apis/questionsAPI";
import { isRouteErrorResponse, Link, useLoaderData, useRouteError } from "@remix-run/react";
import MyAnswers from "~/components/question/MyAnswers";
import { useAuth } from "~/context/AuthProvider";
import Loader from "~/components/UI/Loader";


export const clientLoader = async () => {

  return await getMyAnswersForQuestions();
};

export default function UserProfileAnswersPage() {
  const { data, count } = useLoaderData<typeof clientLoader>();
  const {user} = useAuth();
  if (!user) {
    return <div className="w-full h-full flex justify-center items-center">
      <Loader className="fill-[#5fc9a2] w-12 h-12" />
    </div>;
  }
  return <div>
    <p className="font-bold text-4xl text-black mb-10">
      Answers ({count})
    </p>
    {data.length === 0 && (
      <div className="text-center space-y-4">
        <p>
          You haven’t answered any questions yet!
        </p>
        <Link className="btn-primary" to="/search">
          Search for Questions to answer
        </Link>
      </div>
    )}
    <div className={'grid grid-cols-1 gap-4'}>
      {data.map((el)=>{
        return <MyAnswers key={el.text} answer={el} user={user} />
      })}
    </div>

  </div>;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}