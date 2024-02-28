import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { json } from "@remix-run/node";
import { SearchQuestionResponse, searchQuestionsAPI } from "~/apis/searchAPI.service";
import SuccessAlert from "~/components/UI/SuccessAlert";
import { useState } from "react";
import SearchQuestion from "~/components/question/SearchQuestion";

interface LoaderData {
  list: SearchQuestionResponse[],
  count: number,
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("term");
  if (!query) {
    return json({ list: [], count: 0 });
  }
  try {
    const list = await searchQuestionsAPI(query);
    console.log(list);
    return json({ list: list.data.data, count: list.data.count });
  } catch (e) {
    console.log(e);
    return json({
      list: [{
        "id": "string",
        "text": "Suppose a six-year-old girl wants to buy a $30 Hello Kitty doll. The money she received for her birthday to buy the doll Hello be used for which of the following purposes?",
        "user_id": "number"
      }, {
        "id": "string2",
        "text": "Suppose a six-year-old girl wants to buy a $30 Hello Kitty doll. The money she received for her birthday to buy the doll Hello be used for which of the following purposes?",
        "user_id": "number"
      }, {
        "id": "strin3g",
        "text": "Suppose a six-year-old girl wants to buy a $30 Hello Kitty doll. The money she received for her birthday to buy the doll Hello be used for which of the following purposes?",
        "user_id": "number"
      }, {
        "id": "st23ring",
        "text": "Suppose a six-year-old girl wants to buy a $30 Hello Kitty doll. The money she received for her birthday to buy the doll Hello be used for which of the following purposes?",
        "user_id": "number"
      }, {
        "id": "23234234",
        "text": "Suppose a six-year-old girl wants to buy a $30 Hello Kitty doll. The money she received for her birthday to buy the doll Hello be used for which of the following purposes?",
        "user_id": "number"
      }, {
        "id": "stri234234n3g",
        "text": "Suppose a six-year-old girl wants to buy a $30 Hello Kitty doll. The money she received for her birthday to buy the doll Hello be used for which of the following purposes?",
        "user_id": "number"
      }], count: 1
    });
  }
}


export default function SearchPage() {
  const { list, count } = useLoaderData() as LoaderData;
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
              return <SearchQuestion key={el.id} text={el.text} />;
            })}
          </div>
        </div>


      </>}

    </section>
  );
}
