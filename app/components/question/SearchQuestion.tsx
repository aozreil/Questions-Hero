import { Popover } from "@headlessui/react";
import { IAnswer, IUser, QuestionClass } from "~/models/questionModel";
import React, { useCallback, useEffect, useState } from "react";
import { clientGetAnswer, clientGetUsers } from "~/apis/questionsAPI";
import SearchAnswer from "~/components/question/SearchAnswer";
import { useOverlay } from "~/routes/_main";
import clsx from "clsx";
import { useNavigate } from "@remix-run/react";

interface IProps {
  text: string;
  questionId: string;
  slug?: string;
}

export default function SearchQuestion({ text, questionId, slug }: IProps) {
  const [answers, setAnswers] = useState<IAnswer[] | undefined>(undefined);
  const [askedBy, setAskedBy] = useState<IUser | undefined>(undefined);
  const { focusedOverlayStyles, overlayVisible } = useOverlay();
  const navigate = useNavigate();

  const getAnswer = useCallback(() => {
    if (answers?.length)  return;
    clientGetAnswer(questionId).then((answers) => {
      if (answers?.length) {
        const verifiedAnswer = answers?.[0];
        if (verifiedAnswer?.user_id) {
          clientGetUsers([verifiedAnswer.user_id]).then((users) =>
            users?.[0]?.view_name && setAskedBy(users[0]));
        }
        setAnswers(answers?.map(answer => QuestionClass.answerExtraction(answer)));
      }
    });
  }, [answers])

  return <>
    <Popover>
      {({ open }) => (
        <div className={clsx("relative flex max-xl:flex-col max-xl:space-y-4 max-xl:items-baseline xl:space-x-2", open ? focusedOverlayStyles : '')}>
          <PopoverOverlayController open={open} />
          <div
            className={clsx("border-2 rounded-xl p-4 bg-white border-gray-300 shadow w-full sm:w-[34rem] flex-shrink-0 h-fit", slug && 'cursor-pointer')}
            onClick={() => { slug && !overlayVisible && navigate(`/question/${slug}`) }}
          >
            <div className="flex justify-between pb-4">
              <div className="flex items-center space-x-2 text-[#25b680] font-bold">
                <img src="/assets/images/verified.svg" alt="verifed" />
                <p>Has Verified Answer</p>
              </div>
              <Popover.Button
                className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2 px-4 rounded-xl"
                onClick={getAnswer}
              >
                {open ? 'Hide' : 'Show Answer'}
                <img src='/assets/images/related-arrow.svg' alt='arrow' className={`w-4 h-4 ml-1 mt-0.5 ${open ? 'rotate-180' : ''}`} />
              </Popover.Button>
            </div>
            <hr className="mb-4" />
            <p dangerouslySetInnerHTML={{ __html: text }} />
          </div>
          <Popover.Panel className="xl:absolute xl:left-[33.5rem] xl:top-0 z- max-sm:w-full overflow-y-auto">
            {({ close }) => <SearchAnswer
              answers={answers}
              askedBy={askedBy}
              slug={slug}
              close={close}
            />}
          </Popover.Panel>
        </div>
      )}
    </Popover>
  </>
}

const PopoverOverlayController = React.memo(({ open } : { open: boolean }) => {
  const { setOverlayVisible, overlayVisible } = useOverlay();

  useEffect(() => {
    if (open && !overlayVisible) {
      setOverlayVisible(true);
    } else if (!open && overlayVisible) setOverlayVisible(false);
  }, [open]);

  return null;
});