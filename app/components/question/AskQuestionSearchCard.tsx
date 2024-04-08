import clsx from "clsx";
import { Link } from "@remix-run/react";
import React, { useState } from "react";
import { getTextFormatted } from "~/utils/text-formatting-utils";
import { AnswerStatus, IQuestionInfo } from "~/models/questionModel";
import QuestionType from "~/components/question/QuestionType";

interface Props {
  text: string;
  questionId: string;
  slug?: string;
  questionInfo?: IQuestionInfo;
}

export default function AskQuestionSearchCard({ questionId, slug, text, questionInfo }: Props) {
  const [formattedText] = useState(() => getTextFormatted(text));
  const hasVerifiedAnswer = questionInfo?.answers_statuses?.includes(AnswerStatus.VERIFIED);

  return (
    <Link
      className={clsx(
        "thin-scrollbar block border-2 rounded-xl p-4 bg-white border-gray-300 shadow w-full flex-shrink-0 h-fit",
        slug && 'cursor-pointer',
      )}
      to={slug? `/question/${slug}` : `/question/${questionId}`}
      prefetch={'intent'}
      target='_blank'
    >
      <div className="flex justify-between pb-4">
        <QuestionType
          answerCount={questionInfo?.answers_count ?? 0}
          hasVerifiedAnswer={hasVerifiedAnswer}
        />
        <button
          className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2 px-4 rounded-xl"
        >
          {'Open'}
          <img src='/assets/images/related-arrow.svg' alt='arrow' className={`w-4 h-4 ml-1 mt-0.5`} />
        </button>
      </div>
      <hr className="mb-4" />
      <div className='line-clamp-3 relative' dangerouslySetInnerHTML={{ __html: formattedText }} />
    </Link>
  )
}