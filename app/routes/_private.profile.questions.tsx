import { isRouteErrorResponse, Link, useLoaderData, useRouteError } from "@remix-run/react";
import { getMyAskedQuestions } from "~/apis/questionsAPI";


export const clientLoader = async () => {
  return await getMyAskedQuestions();
};


export default function UserProfileQuestionsPage() {
  const { data, count } = useLoaderData<typeof clientLoader>();
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
    {data.length > 0 && (
      <>

      </>
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