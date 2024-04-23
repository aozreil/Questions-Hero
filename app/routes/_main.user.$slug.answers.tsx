import { getQuestionsById, getUserAnswersForQuestionsByUserId } from "~/apis/questionsAPI";
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
import MyAnswers from "~/components/question/MyAnswers";
import { Pagination } from "~/components/UI/Pagination";
import { LinksFunction } from "@remix-run/node";
import { getKatexLink } from "~/utils/external-links";
import invariant from "tiny-invariant";
import { IUser, QuestionClass } from "~/models/questionModel";

const PAGE_SIZE = 10;

export const links: LinksFunction = () => {
  return [
    ...getKatexLink()
  ];
};

export const clientLoader = async ({ request, params }: ClientLoaderFunctionArgs) => {
  const slug = params.slug;
  invariant(slug, "User Not Found");
  const userId = parseInt(slug.split("-").pop() || slug);
  invariant(!isNaN(userId), "Invalid User Id");
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "0");

  const answers = await getUserAnswersForQuestionsByUserId(userId, {
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
        question: q,
        ...QuestionClass.answerExtraction(el)
      };
    })
  };
};

export default function PublicUserProfileAnswersPage() {
  const { data, count } = useLoaderData<typeof clientLoader>();
  const { user } = useOutletContext<{ user: IUser }>();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") ?? "0");
  const params = useParams();
  const slug = params.slug;

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
      {data.map((el, index) => {
        return <MyAnswers key={`${el.question_id}-${index}`} answer={el} user={user} question={el.question} />;
      })}
      {count > 0 &&
        <Pagination page={currentPage}
                    size={PAGE_SIZE}
                    total={count}
                    previous={`/user/${slug}/answers?page=${currentPage - 1}`}
                    next={`/user/${slug}/answers?page=${currentPage + 1}`} />
      }
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
