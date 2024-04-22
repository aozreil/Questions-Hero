import {
  ClientLoaderFunctionArgs,
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useOutletContext,
  useParams,
  useRouteError,
  useSearchParams
} from "@remix-run/react";
import { getAskedQuestionsByUserId } from "~/apis/questionsAPI";
import MyAskedQuestions from "~/components/question/MyAskedQuestions";
import { Pagination } from "~/components/UI/Pagination";
import { LinksFunction } from "@remix-run/node";
import { getKatexLink } from "~/utils/external-links";
import { IUser } from "~/models/questionModel";
import invariant from "tiny-invariant";

const PAGE_SIZE = 10;

export const links: LinksFunction = () => {
  return [
    ...getKatexLink()
  ];
};

export const clientLoader = async ({ request, params }: ClientLoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const slug = params.slug;
  invariant(slug, "User Not Found");
  const userId = parseInt(slug.split("-").pop() || slug);
  invariant(!isNaN(userId), "Invalid User Id");
  const page = parseInt(searchParams.get("page") ?? "0");
  return await getAskedQuestionsByUserId(userId, {
    params: {
      page: page,
      size: PAGE_SIZE
    }
  });
};


export default function UserProfileQuestionsPage() {
  const { data, count } = useLoaderData<typeof clientLoader>();
  const { user } = useOutletContext<{ user: IUser }>();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") ?? "0");
  const params = useParams();
  const slug = params.slug;

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
        return <MyAskedQuestions key={el.text} question={el} user={user} />;
      })}
      {count > 0 &&
        <Pagination page={currentPage}
                    size={PAGE_SIZE}
                    total={count}
                    previous={`/user/${slug}/questions?page=${currentPage - 1}`}
                    next={`/user/${slug}/questions?page=${currentPage + 1}`} />}
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
