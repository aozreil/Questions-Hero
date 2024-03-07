import { getCreatedAt, getUserInitials } from "~/utils";
import ContentLoader from "~/components/UI/ContentLoader";
import { Link } from "@remix-run/react";
import Loader from "~/components/UI/Loader";
import React, { useEffect } from "react";
import { IAnswer, IUser } from "~/models/questionModel";

interface Props {
  answers?: IAnswer[];
  askedBy?: IUser;
  slug?: string;
  close: () => void;
  handleAnswerOpen?: () => void;
}

export default function SearchAnswer({ answers, askedBy, slug, close, handleAnswerOpen }: Props) {
  const verifiedAnswer = answers?.[0];
  useEffect(() => {
    handleAnswerOpen && handleAnswerOpen();
  }, []);
  return (
    <div className="flex h-full max-sm:w-full items-end justify-center xl:p-4 xl:pt-0 text-center">
      <div className="border-2 border-[#5fc9a2] p-4 rounded-xl bg-white w-full sm:w-[34rem] xl:max-w-[34rem] z-20">
        {
          !!answers?.length
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
                  ) : <UserContentLoader />}
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
                  <div className="bg-[#d3f0e5] text-left p-4 rounded-xl mb-3">
                    <div className="flex items-center gap-1.5 text-[#25b680] font-bold mb-5 sm:mb-0">
                      <img src="/assets/images/verified.svg" alt="verifed" />
                      <p>Verified Answer</p>
                    </div>
                    {verifiedAnswer?.text && (
                      <p>
                        <span className='font-medium'>Final Answer : </span>
                        <span dangerouslySetInnerHTML={{ __html: verifiedAnswer?.text }} />
                      </p>
                    )}
                    {!!verifiedAnswer?.answer_steps?.length && (
                      verifiedAnswer.answer_steps.map((step, index) => (
                        step?.text ? (
                          <p
                            className='mt-2'
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
                    <Link to={`/question/${slug}`} target='_blank' className="text-sm mt-4 hover:text-[#070707] text-gray-500 text-center">
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