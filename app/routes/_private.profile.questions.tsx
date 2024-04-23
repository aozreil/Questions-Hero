import {
  ClientLoaderFunctionArgs,
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
  useSearchParams
} from "@remix-run/react";
import { getMyAskedQuestions } from "~/apis/questionsAPI";
import { useAuth } from "~/context/AuthProvider";
import Loader from "~/components/UI/Loader";
import MyAskedQuestions from "~/components/question/MyAskedQuestions";
import { Pagination } from "~/components/UI/Pagination";
import { LinksFunction, MetaFunction } from "@remix-run/node";
import { getKatexLink } from "~/utils/external-links";
import { QuestionClass } from "~/models/questionModel";
import { getSeoMeta } from "~/utils/seo";

const PAGE_SIZE = 10;

export const meta: MetaFunction = () => {
  return [
    ...getSeoMeta({
      title: "My Asked Questions"
    })
  ];
};

export const links: LinksFunction = () => {
  return [
    ...getKatexLink()
  ];
};

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") ?? "0");
  const answers = await getMyAskedQuestions({
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
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") ?? "0");

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
      {data.map((el, index) => {
        return <MyAskedQuestions key={`${el.id}-${index}`} question={el} user={user} text={"You asked"} />;
      })}
      <Pagination page={currentPage}
                  size={PAGE_SIZE}
                  total={count}
                  previous={`/profile/question?page=${currentPage - 1}`}
                  next={`/profile/question?page=${currentPage + 1}`} />
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
