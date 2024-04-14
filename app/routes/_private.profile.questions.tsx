import { isRouteErrorResponse, Link, useLoaderData, useRouteError } from "@remix-run/react";
import { getMyAskedQuestions } from "~/apis/questionsAPI";
import { useAuth } from "~/context/AuthProvider";
import Loader from "~/components/UI/Loader";
import AskQuestionSearchCard from "~/components/question/AskQuestionSearchCard";


export const clientLoader = async () => {
  return await getMyAskedQuestions();
};


export default function UserProfileQuestionsPage() {
  const { data, count } = useLoaderData<typeof clientLoader>();
  const { user } = useAuth();
  if (!user) {
    return <div className="w-full h-full flex justify-center items-center">
      <Loader className="fill-[#5fc9a2] w-12 h-12" />
    </div>;
  }
  return <div>
    <p className="font-bold text-4xl text-black mb-10">
      Questions ({count})
    </p>
    {data.length === 0 && (
      <div className="text-center space-y-4">
        <p>
          You haven’t asked any questions yet!
        </p>
        <Link className="btn-primary" to="/ask-question">
          Ask Question
        </Link>

      </div>
    )}
    <div className={"grid grid-cols-1 gap-4"}>
      {data.map((el) => {
        return <AskQuestionSearchCard key={el.text} questionId={el.id} text={el.text} slug={el.slug}  />;
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