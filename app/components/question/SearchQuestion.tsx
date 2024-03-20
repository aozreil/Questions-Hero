import { IAnswer, IUser, IQuestion, QuestionClass } from "~/models/questionModel";
import React, { useCallback, useEffect, useState } from "react";
import { clientGetAnswer, clientGetUsers } from "~/apis/questionsAPI";
import SearchAnswer from "~/components/question/SearchAnswer";
import { useOverlay } from "~/context/OverlayProvider";
import clsx from "clsx";
import { Link } from "@remix-run/react";
import { getTextFormatted } from "~/utils/text-formatting-utils";

interface IProps {
  handleAnswerOpen?: (questionId: string) => void;
  question: IQuestion;
}

export default function SearchQuestion({ handleAnswerOpen, question }: IProps) {
  const [answers, setAnswers] = useState<IAnswer[] | undefined>(undefined);
  const { text, id, slug, answerCount } = question;
  const [isOpen, setIsOpen] = useState(false);
  const [askedBy, setAskedBy] = useState<IUser | undefined>(undefined);
  const [formattedText] = useState(() => getTextFormatted(text))
  const { focusedOverlayStyles, overlayVisible, setOverlayVisible } = useOverlay();

  useEffect(() => {
    if (window.innerWidth > 1024 && !overlayVisible && isOpen) {
      setIsOpen(false);
    }
  }, [overlayVisible, isOpen]);

  const handleShowAnswer = useCallback((e: any) => {
    e.preventDefault();
    setIsOpen(!isOpen);
    window.innerWidth > 1024 && setOverlayVisible(!isOpen);
    getAnswer();
  }, [isOpen]);

  const getAnswer = useCallback(() => {
    if (answers?.length)  return;
    clientGetAnswer(id).then((answers) => {
      if (answers?.length) {
        const verifiedAnswer = answers?.[0];
        if (verifiedAnswer?.user_id) {
          clientGetUsers([verifiedAnswer.user_id]).then((users) =>
            users?.[0]?.view_name && setAskedBy(users[0]));
        }
        setAnswers(answers?.map(answer => QuestionClass.answerExtraction(answer)));
      }
    });
  }, [answers]);

  const close = useCallback(() => {
    setIsOpen(false);
    window.innerWidth > 1024 && setOverlayVisible(false);
  }, []);

  return <>
    <div>
      <div id={`q-${id}`} className={clsx("relative sm:w-fit flex lg:items-baseline lg:space-x-2", isOpen ? focusedOverlayStyles : '')}>
        <Link
          className={clsx(
            "thin-scrollbar border-2 rounded-xl p-4 bg-white border-gray-300 shadow w-full sm:w-[34rem] flex-shrink-0 h-fit",
            slug && 'cursor-pointer',
            isOpen && 'lg:max-h-[75vh] lg:overflow-y-auto',
          )}
          to={slug? `/question/${slug}` : `/question/${id}`}
          prefetch={'intent'}
          target='_blank'
        >
          <div className="flex items-center justify-between pb-4">
            {answerCount && answerCount > 0
              ? <>
                <div className="flex items-center space-x-2 text-[#25b680] font-bold">
                  <img src="/assets/images/verified.svg" alt="verifed" />
                  <p>Has Verified Answer</p>
                </div>
                <button
                  className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2 px-4 rounded-xl"
                  onClick={handleShowAnswer}
                >
                  {isOpen ? 'Hide' : 'Show Answer'}
                  <img src='/assets/images/related-arrow.svg' alt='arrow' className={`w-4 h-4 ml-1 mt-0.5 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              </>
              : <p className='text-[#99a7af] font-medium'>Not answered yet</p>
            }
          </div>
          <hr className="mb-4" />
          <p dangerouslySetInnerHTML={{ __html: formattedText }} />
        </Link>
        {isOpen && (
          <div className="max-lg:hidden lg:absolute lg:left-[33.5rem] lg:top-0 max-sm:w-full overflow-y-auto">
            <SearchAnswer
              answers={answers}
              askedBy={askedBy}
              slug={slug}
              close={close}
              handleAnswerOpen={() => handleAnswerOpen && handleAnswerOpen(id)}
            />
          </div>
        )}
        {isOpen && (
          <div className='lg:hidden w-screen h-screen overflow-hidden fixed bg-transparent z-50 bottom-0 left-0'>
            <div
              className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm"
              aria-hidden="true"
              onClick={close}
            />
            <div className='absolute sm:top-0 sm:m-auto sm:w-[70%] sm:min-h-[50vh] right-0 left-0 bottom-0 w-full h-fit rounded-t-[26px] sm:rounded-b-[26px] bg-white max-h-[80vh] overflow-y-auto'>
              <div onClick={close} className='flex justify-end p-5 pb-0'>
                <img src='/assets/images/close-button.svg' alt='close' className='w-9 h-9' />
              </div>
              <SearchAnswer
                answers={answers}
                askedBy={askedBy}
                slug={slug}
                close={close}
                handleAnswerOpen={() => handleAnswerOpen && handleAnswerOpen(id)}
                mobileVersion={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  </>
}