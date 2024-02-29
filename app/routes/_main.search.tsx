import { defer, LoaderFunctionArgs, useLoaderData } from "react-router";
import { json } from "@remix-run/node";
import { SearchQuestionResponse, searchQuestionsAPI } from "~/apis/searchAPI.service";
import SuccessAlert from "~/components/UI/SuccessAlert";
import { useState } from "react";
import SearchQuestion from "~/components/question/SearchQuestion";
import { getAnswerById, getQuestionById } from "~/apis/questionsAPI.server";
import { IAnswer, QuestionClass } from "~/models/questionModel";

interface LoaderData {
  list: SearchQuestionResponse[],
  count: number,
  questions: any;
  answers: any;
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
    console.log(e);
    list = [{
      "id": "01HPYFXGA83R128HARX4VW42C4",
      "text": "Suppose a six-year-old girl wants to buy a $30 Hello Kitty doll. The money she received for her birthday to buy the doll Hello be used for which of the following purposes?",
      "user_id": 5,
    }, {
      "id": "01HPYFXGA857M2QJ9V5RCJ4XPN",
      "text": "Suppose a six-year-old girl wants to buy a $30 Hello Kitty doll. The money she received for her birthday to buy the doll Hello be used for which of the following purposes?",
      "user_id": 5,
    }, {
      "id": "01HPYFXGA81R18VGRY072ES1FJ",
      "text": "Suppose a six-year-old girl wants to buy a $30 Hello Kitty doll. The money she received for her birthday to buy the doll Hello be used for which of the following purposes?",
      "user_id": 5,
    }, {
      "id": "01HPYFXGA8MVKQRAM1H1NT6ZC0",
      "text": "Suppose a six-year-old girl wants to buy a $30 Hello Kitty doll. The money she received for her birthday to buy the doll Hello be used for which of the following purposes?",
      "user_id": 5,
    }, {
      "id": "01HPYFXGA85NMWN6J27K1FY9BM",
      "text": "Suppose a six-year-old girl wants to buy a $30 Hello Kitty doll. The money she received for her birthday to buy the doll Hello be used for which of the following purposes?",
      "user_id": 5,
    }, {
      "id": "01HPYFXGA8QFVYWFQXMMETDRFW",
      "text": "Suppose a six-year-old girl wants to buy a $30 Hello Kitty doll. The money she received for her birthday to buy the doll Hello be used for which of the following purposes?",
      "user_id": 5,
    }];
    count = 6;
  }

  const questionIDs = list?.map(question => question?.id);
  const questions = getQuestionById(questionIDs?.[0]).then((questionsRes) => {
    if (questionsRes) {
      return QuestionClass.questionExtraction(questionsRes);
    }
    return {};
  }, err => console.log(err));

  const answers = getAnswerById(questionIDs?.[0]).then((answersRes) => {
    if (answersRes) {
      return answersRes?.map((answer: IAnswer | undefined) => QuestionClass.answerExtraction(answer));
    }
    return [];
  }, err => console.log(err));

  return defer({
    list,
    count,
    questions,
    answers,
  });
}

export default function SearchPage() {
  const { list, count, questions, answers } = useLoaderData() as LoaderData;
  const [showVerifiedAnswer, setshowVerifiedAnswer] = useState(true);

  return (
    <section className={"pt-2"}>
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
        {showVerifiedAnswer && <SuccessAlert>
          <img src="/assets/images/verified.svg" alt="verifed" className="mr-3" />
          <p>Verified Answers: Curated by experts, our search results highlight accurate and detailed information.</p>
          <button
            onClick={() => setshowVerifiedAnswer(false)}
            className="bg-transparent ml-auto border-0 inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50">
            <span className="sr-only">Dismiss</span>
            <img
              src="/assets/images/close-button.svg"
              alt="close"
              className="cursor-pointer"
            />
          </button>
        </SuccessAlert>}
        <div className="container mt-4">
          <p>
            {count} <span className="font-bold">Result{count > 1 ? "s" : ""} found</span>
          </p>
          <div className="pt-4 space-y-4">
            {list.map((el) => {
              return <SearchQuestion
                key={el.id}
                text={el.text}
                answer={answers}
                question={questions}
              />;
            })}
          </div>
        </div>


      </>}

    </section>
  );
}
