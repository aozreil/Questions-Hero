import { getMyAnswersForQuestions, getQuestionsById } from "~/apis/questionsAPI";
import {
  ClientLoaderFunctionArgs,
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
  useSearchParams
} from "@remix-run/react";
import MyAnswers from "~/components/question/MyAnswers";
import { useAuth } from "~/context/AuthProvider";
import Loader from "~/components/UI/Loader";
import { Pagination } from "~/components/UI/Pagination";
import { LinksFunction } from "@remix-run/node";
import { getKatexLink } from "~/utils/external-links";
import { QuestionClass } from "~/models/questionModel";

const PAGE_SIZE = 10;

export const links: LinksFunction = () => {
  return [
    ...getKatexLink()
  ];
};

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "0");
  const answers = await getMyAnswersForQuestions({
    params: {
      page: page,
      size: PAGE_SIZE
    }
  });
  const questionIds = answers.data.map(el => el.question_id).filter(el => !!el);

  const questions = await getQuestionsById({
    params: {
      ids: questionIds
    }
  });

  return {
    ...answers,
    data: answers.data.map(el => {
      let q = questions.find(q => q.id === el.question_id);
      if (q) {
        q = QuestionClass.questionExtraction(q);
      }
      return {
        ...el,
        question: q
      };
    })
  };
};

export default function UserProfileAnswersPage() {
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
    <div className={"grid grid-cols-1 gap-4"}>
      {data.map((el) => {
        return <MyAnswers key={el.text} answer={el} user={user} question={el.question} />;
      })}
      <Pagination page={currentPage}
                  size={PAGE_SIZE}
                  total={count}
                  previous={`/profile/answers?page=${currentPage - 1}`}
                  next={`/profile/answers?page=${currentPage + 1}`} />
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
