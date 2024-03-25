import { getCreatedAt } from "~/utils";
import ContentLoader from "~/components/UI/ContentLoader";
import { Link } from "@remix-run/react";
import Loader from "~/components/UI/Loader";
import React, { Fragment, useEffect } from "react";
import { AnswerStatus, IAnswer, IUser, IUsers } from "~/models/questionModel";
import clsx from "clsx";
import UserProfile from "~/components/UI/UserProfile";

interface Props {
  answers?: IAnswer[];
  userProfiles?: IUsers;
  slug?: string;
  close: () => void;
  handleAnswerOpen?: () => void;
  mobileVersion?: boolean;
}

export default function SearchAnswer({ answers, userProfiles, slug, close, handleAnswerOpen, mobileVersion }: Props) {
  const verifiedAnswer = answers?.[0];
  useEffect(() => {
    handleAnswerOpen && handleAnswerOpen();
  }, []);
  return (
    <div className="relative flex h-fit max-sm:w-full items-end justify-center lg:p-4 pr-0 lg:pt-0 text-center">
      <div className={clsx(
        "thin-scrollbar h-fit lg:max-h-[83vh] lg:overflow-y-auto bg-white w-full lg:w-[28rem] 2xl:w-[34rem] z-20",
        mobileVersion ? 'px-0' :  'border-2 border-[#5fc9a2] rounded-xl pb-4'
      )}>
        {
          !!answers?.length
            ? (
              <>
                {!mobileVersion && (
                  <button
                    onClick={close}
                    className="absolute z-10 top-4 right-8"
                  >
                    <span className="sr-only">Dismiss</span>
                    <img
                      src="/assets/images/search-answer-cancel.svg"
                      alt="close"
                      className="cursor-pointer w-7 h-7"
                    />
                  </button>
                )}
                {answers?.map((answer, index) => (
                  <Fragment key={answer?.created_at}>
                    {!!index && <div className='w-full border-t border-t-0.5 border-t-[#c4c5c5] mb-2' />}
                    <Answer
                      answer={answer}
                      askedBy={userProfiles?.[answer?.user_id ?? 0]}
                    />
                  </Fragment>
                ))}
                {!!slug && (
                  <>
                    <Link to={`/question/${slug}`} target='_blank' className="max-lg:hidden p-4 pt-0 text-sm mt-4 hover:text-[#070707] text-gray-500 text-center">
                      Go to question page for more information
                    </Link>
                    <Link to={`/question/${slug}`} target='_blank' className="lg:hidden outline-none block text-white py-3 bg-[#070707] w-[90%] my-4 max-sm:-mt-3 mx-auto rounded-2xl text-center">
                      Go to Question Page
                    </Link>
                  </>
                )}
              </>
            ) : (
              <section className='w-full h-64 flex items-center justify-center'>
                <Loader className='fill-[#5fc9a2] w-12 h-12' />
              </section>
            )
        }
      </div>
    </div>
  )
}

const Answer = ({ askedBy, answer }: {
  askedBy?: IUser;
  answer: IAnswer;
}) => {
  const isVerified = answer?.answer_status === AnswerStatus.VERIFIED;
  return (
    <div className='flex flex-col space-y-4 p-4 pb-2'>
      <div className='relative'>
        {!!askedBy ? (
          <div className='flex space-x-3'>
            <UserProfile user={askedBy} className='h-12 w-12' />
            <div className='flex flex-col items-start text-black'>
              <p className='font-bold'>{askedBy?.view_name ?? 'Answered By Askgram User'}</p>
              {!!answer?.created_at && <p className='text-xs'>{getCreatedAt(answer?.created_at)}</p>}
            </div>
          </div>
        ) : <UserContentLoader />}
      </div>
      <hr className="my-3 border-t border-t-[#f4f4f4] opacity-75" />
      <div className='w-full max-sm:pb-5'>
        <div className={
          clsx("f2f4f5 text-left p-4 rounded-xl mb-3", isVerified ? 'bg-[#d3f0e5]' : 'bg-[#f2f4f5]')}
        >
          {isVerified && (
            <div className="flex items-center gap-1.5 text-[#25b680] font-bold mb-5 sm:mb-0">
              <img src="/assets/images/verified.svg" alt="verifed" />
              <p>Verified Answer</p>
            </div>
          )}
          {answer?.text && (
            <p className='max-sm:text-lg'>
              <span className='font-medium'>Final Answer : </span>
              <span dangerouslySetInnerHTML={{ __html: answer?.text }} />
            </p>
          )}
          {!!answer?.answer_steps?.length && (
            answer.answer_steps.map((step, index) => (
              step?.text ? (
                <p
                  className='mt-2 max-sm:text-lg'
                  key={index}
                >
                  <span className='font-medium'>Explanation : </span>
                  <span dangerouslySetInnerHTML={{ __html: step?.text }} />
                </p>
              ) :null
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const UserContentLoader = () => (
  <div className='flex space-x-3'>
    <ContentLoader tailwindStyles='h-11 w-11 rounded-full' />
    <div className='flex flex-col items-start text-sm text-black'>
      <ContentLoader tailwindStyles='w-20 h-5 mb-1 rounded-md' />
      <ContentLoader tailwindStyles='w-5 h-5 rounded-md' />
    </div>
  </div>
)