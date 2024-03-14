import { getCreatedAt, getUserInitials } from "~/utils";
import ContentLoader from "~/components/UI/ContentLoader";
import { Link } from "@remix-run/react";
import Loader from "~/components/UI/Loader";
import React, { useEffect } from "react";
import { IAnswer, IUser } from "~/models/questionModel";
import clsx from "clsx";

interface Props {
  answers?: IAnswer[];
  askedBy?: IUser;
  slug?: string;
  close: () => void;
  handleAnswerOpen?: () => void;
  mobileVersion?: boolean;
}

export default function SearchAnswer({ answers, askedBy, slug, close, handleAnswerOpen, mobileVersion }: Props) {
  const verifiedAnswer = answers?.[0];
  useEffect(() => {
    handleAnswerOpen && handleAnswerOpen();
  }, []);
  return (
    <div className="flex h-fit max-sm:w-full items-end justify-center lg:p-4 pr-0 lg:pt-0 text-center">
      <div className={clsx(
        "thin-scrollbar h-fit lg:max-h-[75vh] lg:overflow-y-auto bg-white w-full sm:w-[34rem] lg:w-[28rem] xl:w-[34rem] z-20",
        mobileVersion ? 'px-5' :  'border-2 border-[#5fc9a2] rounded-xl p-4'
      )}>
        {
          !!answers?.length
            ? (
              <>
                <div className='relative'>
                  {!!askedBy ? (
                    <div className='flex space-x-3'>
                      <div className='h-12 w-12 bg-[#002237] text-white flex items-center justify-center rounded-full border-2 border-[#5dc9a1] flex-shrink-0 font-semibold'>
                        {getUserInitials(askedBy?.view_name)}
                      </div>
                      <div className='flex flex-col items-start text-black'>
                        <p className='font-bold'>{askedBy?.view_name ?? 'Answered By Askgram User'}</p>
                        {!!verifiedAnswer?.created_at && <p className='mt-1 text-sm'>{getCreatedAt(verifiedAnswer?.created_at)}</p>}
                      </div>
                    </div>
                  ) : <UserContentLoader />}
                  {!mobileVersion && (
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
                  )}
                </div>
                <hr className="my-3" />
                <div className='w-full'>
                  <div className="bg-[#d3f0e5] text-left p-4 rounded-xl mb-3">
                    <div className="flex items-center gap-1.5 text-[#25b680] font-bold mb-5 sm:mb-0">
                      <img src="/assets/images/verified.svg" alt="verifed" />
                      <p>Verified Answer</p>
                    </div>
                    {verifiedAnswer?.text && (
                      <p className='max-sm:text-lg'>
                        <span className='font-medium'>Final Answer : </span>
                        <span dangerouslySetInnerHTML={{ __html: verifiedAnswer?.text }} />
                      </p>
                    )}
                    {!!verifiedAnswer?.answer_steps?.length && (
                      verifiedAnswer.answer_steps.map((step, index) => (
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
                  {!!slug && (
                    <>
                      <Link to={`/question/${slug}`} target='_blank' className="max-lg:hidden text-sm mt-4 hover:text-[#070707] text-gray-500 text-center">
                        Go to question page for more information
                      </Link>
                      <Link to={`/question/${slug}`} target='_blank' className="lg:hidden outline-none block text-white py-3 bg-[#070707] w-full my-4 rounded-2xl text-center">
                        Go to Question Page
                      </Link>
                    </>
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