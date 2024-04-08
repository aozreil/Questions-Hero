// import { getMyAnswersForQuestions } from "~/apis/questionsAPI";
import { isRouteErrorResponse, Link, useLoaderData, useRouteError } from "@remix-run/react";


export const clientLoader = async () => {

  return [] //await getMyAnswersForQuestions();
};

export default function UserProfileAnswersPage() {
  const data = useLoaderData<typeof clientLoader>();
  const answersList = data;
  return <div>
    <p className="font-bold text-4xl text-black mb-10">
      Answers ({answersList.length})
    </p>
    {answersList.length === 0 && (
      <div className="text-center space-y-4">
        <p>
          You haven’t answered any questions yet!
        </p>
        <Link className="btn-primary" to="/search">
          Search for Questions to answer
        </Link>

      </div>
    )}
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