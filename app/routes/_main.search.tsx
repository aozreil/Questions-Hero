import { defer, LoaderFunctionArgs, useLoaderData, useNavigation } from "react-router";
import { json } from "@remix-run/node";
import { SearchQuestionResponse, searchQuestionsAPI } from "~/apis/searchAPI.service";
import SuccessAlert from "~/components/UI/SuccessAlert";
import { useCallback, useEffect, useState } from "react";
import SearchQuestion from "~/components/question/SearchQuestion";
import { getQuestionsById } from "~/apis/questionsAPI.server";
import Loader from "~/components/UI/Loader";
import CloseModal from "~/components/icons/CloseModal";

interface QuestionsMapper {
  [questionId: string]: {
    slug: string
  }
}

interface LoaderData {
  list: SearchQuestionResponse[],
  count: number,
  questions: Promise<QuestionsMapper>;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("term");
  if (!query) {
    return json({ list: [], count: 0 });
  }

  let list: SearchQuestionResponse[] = [];
  let count = 0;
  try {
    const searchRes = await searchQuestionsAPI(query);
    list = searchRes?.data?.data;
    count = searchRes?.data?.count;
  } catch (e) {
    console.error(e);
  }

  const questionIDs = list?.map(question => question?.id);
  const questions = getQuestionsById(questionIDs?.join()).then((questionsRes) => {
    if (questionsRes?.length) {
      let questionsObj: { [questionId: string]: { slug?: string } } = {};
      for (const question of questionsRes) {
        if (question.id) {
          questionsObj[question.id] = { slug: question.slug }
        }
      }
      return questionsObj;
    }
    return {};
  }, err => console.error(err));

  return defer({
    list,
    count,
    questions,
  });
}

export default function SearchPage() {
  const { list, count, questions } = useLoaderData() as LoaderData;
  const [questionsMapper, setQuestionsMapper] = useState<QuestionsMapper | undefined>(undefined);
  const [showVerifiedAnswer, setShowVerifiedAnswer] = useState(true);
  const navigation = useNavigation();

  const getQuestionSlug = useCallback((questionId?: string) => {
    if (questionId && questionsMapper?.hasOwnProperty(questionId)) return questionsMapper[questionId]?.slug;
    return undefined;
  }, [questionsMapper]);

  useEffect(() => {
    questions?.then(data => !!data && setQuestionsMapper(data))
  }, [questions]);

  if (navigation.state === 'loading') {
    return (
      <section className="w-full h-64 flex items-center justify-center">
        <Loader className="fill-[#5fc9a2] w-12 h-12" />
      </section>
    );
  }

  return (
    <section className="pt-2 pb-40">
      {list.length === 0 && <>
        <div
          className="container shadow bg-white p-16 text-center max-w-prose h-full flex items-center flex-col rounded-md">
          <div className="w-48 h-48 bg-red-300 m-8"></div>
          <h2 className="text-3xl font-bold mb-3">
            No matching results
          </h2>
          <p className="text-lg">
            There weren’t any answers, recent queriers, or sources matching your search
          </p>
          <p className="text-lg">
            <span className="text-blue-500 font-semibold">Ask community</span> or <span
            className="text-blue-500 font-semibold">Search again</span>
          </p>
        </div>

      </>}

      {list.length > 0 && <>
        {showVerifiedAnswer &&
          <SuccessAlert>
            <section className='container max-md:px-4 lg:pl-52 flex items-center'>
              <img src="/assets/images/verified.svg" alt="verifed" className="mr-3" />
              <p>Verified Answers: Curated by experts, our search results highlight accurate and detailed information.</p>
              <button
                onClick={() => setShowVerifiedAnswer(false)}
                className="ml-auto">
                <span className="sr-only">Dismiss</span>
                <CloseModal fillColor='#667a87' className='w-4 h-4 cursor-pointer' />
              </button>
            </section>
          </SuccessAlert>
        }
        <div className="container w-full mt-4 max-md:px-4 lg:pl-52">
          <p>
            {count} <span className="font-bold">Result{count > 1 ? "s" : ""} found</span>
          </p>
          <div className="pt-4 space-y-4">
            {list.map((el) => {
              return <SearchQuestion
                key={el.id}
                text={el.text}
                questionId={el?.id}
                slug={getQuestionSlug(el?.id)}
              />
            })}
          </div>
        </div>
      </>}
    </section>
  );
}
