import { Popover } from "@headlessui/react";
import { IAnswer, IQuestion } from "~/models/questionModel";
import { Await } from "react-router";
import { Suspense } from "react";
import { Link } from "@remix-run/react";

interface IProps {
  text: string;
  answer: Promise<IAnswer[]>;
  question: Promise<IQuestion>;
}

export default function SearchQuestion({ text, answer, question }: IProps) {
  return <>
    <Popover className="flex space-x-2">
      <div className="border-2 rounded-xl p-4 bg-white border-gray-300 shadow max-w-prose flex-shrink-0 h-fit">

        <div className="flex justify-between pb-4">
          <div className="flex items-center space-x-2 text-[#25b680] font-bold">
            <img src="/assets/images/verified.svg" alt="verifed" />
            <p>Has Verified Answer</p>
          </div>

          <Popover.Button className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2 px-4 rounded-xl">
            Show Answer
          </Popover.Button>
        </div>
        <hr className="mb-4" />
        {text}
      </div>


      <Popover.Panel className={"z-10 w-screen overflow-y-auto h-screen"}>
        {({ close }) => (
          <div className="flex h-full items-end justify-center p-4 text-center">

            <div className="border-2 border-[#5fc9a2] p-4 rounded-xl bg-white  max-w-prose">
              <div>
                User Info

                <button
                  onClick={() => close()}
                  className="bg-transparent ml-auto border-0 inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50">
                  <span className="sr-only">Dismiss</span>
                  <img
                    src="/assets/images/close-button.svg"
                    alt="close"
                    className="cursor-pointer"
                  />
                </button>
              </div>
              <hr className="my-4" />
              <div>
                <div className="bg-[#d3f0e5] p-4 rounded-xl">
                  <div className="flex items-center gap-1.5 text-[#25b680] font-bold mb-5 sm:mb-0">
                    <img src="/assets/images/verified.svg" alt="verifed" />
                    <p>Verified Answer</p>
                  </div>
                  <Suspense>
                    <Await resolve={answer}>
                      {(answer) => (
                        answer?.[0]?.text
                        ? <p dangerouslySetInnerHTML={{ __html: answer?.[0]?.text }} />
                        : null
                      )}
                    </Await>
                  </Suspense>
                  <p>

                    Comparing poverty across racial lines, which of the following groups has the lowest percentage of
                    individuals who are poor? Generally speaking, which of the following groups come to the U.S. with
                    relatively high class privileges and tend to work as professionals and managers?
                  </p>
                </div>
                <Suspense>
                  <Await resolve={question}>
                    {(question: IQuestion) => (
                      question?.slug
                        ? <Link to={`/question/${question.slug}`} className="text-sm mt-4 text-gray-500 text-center">
                          Go to question page for more information
                        </Link>
                        : null
                    )}
                  </Await>
                </Suspense>

              </div>
            </div>
          </div>
        )}
      </Popover.Panel>
    </Popover>
  </>;

}