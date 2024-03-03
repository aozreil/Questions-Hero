import { Popover } from "@headlessui/react";
import { IAnswer, IUser } from "~/models/questionModel";
import React, { useCallback, useState } from "react";
import Loader from "~/components/UI/Loader";
import { getCreatedAt, getUserInitials } from "~/utils";
import { clientGetAnswer, clientGetUsers } from "~/apis/questionsAPI";
import { Link } from "@remix-run/react";
import ContentLoader from "~/components/UI/ContentLoader";

interface IProps {
  text: string;
  questionId: string;
  slug?: string;
}

export default function SearchQuestion({ text, questionId, slug }: IProps) {
  const [answer, setAnswer] = useState<IAnswer[] | undefined>(undefined);
  const [askedBy, setAskedBy] = useState<IUser | undefined>(undefined);
  const verifiedAnswer = answer?.[0];

  const getAnswer = useCallback(() => {
    clientGetAnswer(questionId).then((answer) => {
      if (answer?.length) {
        if (answer?.[0]?.user_id) clientGetUsers([answer?.[0]?.user_id]).then((users) => users?.[0]?.view_name && setAskedBy(users[0]))
        setAnswer(answer);
      }
    });
  }, [])

  return <>
    <Popover className="relative flex space-x-2">
      <div className="border-2 rounded-xl p-4 bg-white border-gray-300 shadow w-full sm:w-[34rem] flex-shrink-0 h-fit">
        <div className="flex justify-between pb-4">
          <div className="flex items-center space-x-2 text-[#25b680] font-bold">
            <img src="/assets/images/verified.svg" alt="verifed" />
            <p>Has Verified Answer</p>
          </div>
          <Popover.Button
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2 px-4 rounded-xl"
            onClick={getAnswer}
          >
            Show Answer
          </Popover.Button>
        </div>
        <hr className="mb-4" />
        {text}
      </div>
      <Popover.Panel className="absolute left-[33.5rem] top-0 z-10 overflow-y-auto">
        {({ close }) => (
          <div className="flex h-full items-end justify-center p-4 pt-0 text-center">
            <div className="border-2 border-[#5fc9a2] p-4 rounded-xl bg-white sm:w-[34rem]">
              {
                !!answer?.length
                ? (
                  <>
                      <div className='relative'>
                        {!!askedBy ? (
                          <div className='flex space-x-3'>
                            <div className='h-11 w-11 bg-[#002237] text-white twxt-xl flex items-center justify-center rounded-full border-2 border-[#5dc9a1] flex-shrink-0 font-semibold'>
                              {getUserInitials(askedBy?.view_name)}
                            </div>
                            <div className='flex flex-col items-start text-sm text-black'>
                              <p className='text-sm font-bold'>{askedBy?.view_name ?? 'Answered By Askgram User'}</p>
                              {!!verifiedAnswer?.created_at && <p className='mt-1 text-xs'>{getCreatedAt(verifiedAnswer?.created_at)}</p>}
                            </div>
                          </div>
                        ) : (
                          <div className='flex space-x-3'>
                            <ContentLoader tailwindStyles='h-11 w-11 rounded-full' />
                            <div className='flex flex-col items-start text-sm text-black'>
                              <ContentLoader tailwindStyles='w-20 h-5 mb-1 rounded-md' />
                              <ContentLoader tailwindStyles='w-5 h-5 rounded-md' />
                            </div>
                          </div>
                        )}
                        <button
                          onClick={() => close()}
                          className="absolute top-0 right-0"
                        >
                          <span className="sr-only">Dismiss</span>
                          <img
                            src="/assets/images/search-answer-cancel.svg"
                            alt="close"
                            className="cursor-pointer w-7 h-7"
                          />
                        </button>
                      </div>
                      <hr className="my-3" />
                      <div>
                        <div className="bg-[#d3f0e5] text-left p-4 rounded-xl">
                          <div className="flex items-center gap-1.5 text-[#25b680] font-bold mb-5 sm:mb-0">
                            <img src="/assets/images/verified.svg" alt="verifed" />
                            <p>Verified Answer</p>
                          </div>
                          {verifiedAnswer?.text && (
                            <p className='font-medium' dangerouslySetInnerHTML={{ __html: verifiedAnswer?.text }} />
                          )}
                          {!!verifiedAnswer?.answer_steps?.length && (
                            verifiedAnswer.answer_steps.map((step, index) => (
                              step?.text ? (
                                <p
                                  className='font-medium mt-2'
                                  key={index}
                                  dangerouslySetInnerHTML={{ __html: step?.text }}
                                />
                              ) :null
                            ))
                          )}
                        </div>
                        {slug && (
                          <Link to={`/question/${slug}`} target='_blank' className="text-sm mt-4 text-gray-500 text-center">
                            Go to question page for more information
                          </Link>
                        )}
                      </div>
                  </>
                ) : (
                  <section className='w-full h-64 flex items-center justify-center'>
                    <Loader className='fill-[#5fc9a2] w-12 h-12' />
                  </section>
                )
              }
            </div>
          </div>
        )}
      </Popover.Panel>
    </Popover>
  </>
}