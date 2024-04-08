import { isRouteErrorResponse, Link, useLoaderData, useRouteError } from "@remix-run/react";
import { getMyAskedQuestions } from "~/apis/questionsAPI";


export const clientLoader = async () => {
  return [];
};


export default function UserProfileQuestionsPage() {
  const data = useLoaderData<typeof clientLoader>();
  const questionsList = data;
  return <div>
    <p className="font-bold text-4xl text-black mb-10">
      Questions ({questionsList.length})
    </p>
    {questionsList.length === 0 && (
      <div className="text-center space-y-4">
        <p>
          You haven’t asked any questions yet!
        </p>
        <Link className="btn-primary" to="/ask-question">
          Ask Question
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