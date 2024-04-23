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
import { LinksFunction, MetaFunction } from "@remix-run/node";
import { getKatexLink } from "~/utils/external-links";
import { IUser, QuestionClass } from "~/models/questionModel";
import invariant from "tiny-invariant";
import { getSeoMeta } from "~/utils/seo";

const PAGE_SIZE = 10;
export const meta: MetaFunction<typeof clientLoader> = ({ location, matches }) => {
  const match = matches.find(el => el.id === "routes/_main.user.$slug");
  let title = "Not found";
  if (match && match?.data && "user" in match.data) {
    const user = match.data?.user as IUser;
    if (user) {
      title = user.view_name + " Questions";
    }
  }
  return [
    ...getSeoMeta({
      title: title,
      canonical: location.pathname
    })
  ];
};

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
  const answers = await getAskedQuestionsByUserId(userId, {
    params: {
      page: page,
      size: PAGE_SIZE
    }
  });

  return {
    ...answers, data: answers.data.map((el) => {
      return {
        ...el,
        ...QuestionClass.questionExtraction(el)

      };
    })
  };
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
          The user haven’t asked any questions yet!
        </p>
        <Link className="btn-primary" to="/ask-question">
          Ask Question
        </Link>

      </div>
    )}
    <div className={"grid grid-cols-1 gap-4"}>
      {data.map((el, index) => {
        return <MyAskedQuestions key={`${el.id}-${index}`} question={el} user={user} text={"Asked"} />;
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
