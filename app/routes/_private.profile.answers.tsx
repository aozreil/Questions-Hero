import { getMyAnswersForQuestions } from "~/apis/questionsAPI";
import { isRouteErrorResponse, useLoaderData, useRouteError } from "@remix-run/react";


export const clientLoader = async () => {

  return await getMyAnswersForQuestions();
};

export default function UserProfileAnswersPage() {
  const data = useLoaderData<typeof clientLoader>();
  console.log(data);
  return <div>
    Answers pages
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