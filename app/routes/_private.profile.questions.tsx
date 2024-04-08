import { isRouteErrorResponse, useLoaderData, useRouteError } from "@remix-run/react";
import { getMyAskedQuestions } from "~/apis/questionsAPI";


export const clientLoader = async () => {
  return await getMyAskedQuestions();
};


export default function UserProfileQuestionsPage() {
  const data = useLoaderData<typeof clientLoader>();
  console.log(data);
  return <div>
    Questions pages
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