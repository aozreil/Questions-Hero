import clsx from "clsx";
import { Link } from "@remix-run/react";
import React, { useCallback, useState } from "react";
import { getTextFormatted } from "~/utils/text-formatting-utils";
import { AnswerStatus, IQuestionInfo } from "~/models/questionModel";
import QuestionType from "~/components/question/QuestionType";
import { useAnalytics } from "~/hooks/useAnalytics";
import SanitizedText from "~/components/question/SanitizedText";

interface Props {
  text: string;
  questionId: string;
  slug?: string;
  questionInfo?: IQuestionInfo;
}

export default function AskQuestionSearchCard({ questionId, slug, text, questionInfo }: Props) {
  const [formattedText] = useState(() => getTextFormatted(text));
  const hasVerifiedAnswer = questionInfo?.answers_statuses?.includes(AnswerStatus.VERIFIED);
  const { trackEvent } = useAnalytics();

  const onQuestionClick = useCallback(() => {
    trackEvent("ask-question-similar-question click");
  }, []);

  return (
    <Link
      className={clsx(
        "thin-scrollbar block border-2 rounded-xl p-4 bg-white border-gray-300 shadow w-full flex-shrink-0 h-fit",
        slug && 'cursor-pointer',
      )}
      to={slug? `/question/${slug}` : `/question/${questionId}`}
      prefetch={'intent'}
      target='_blank'
      onClick={onQuestionClick}
      data-cy="search-card"
    >
      <div className="flex justify-between pb-4">
        <QuestionType
          answerCount={questionInfo?.answers_count ?? 0}
          hasVerifiedAnswer={hasVerifiedAnswer}
        />
        <button
          className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2 px-4 rounded-xl"
          onClick={onQuestionClick}
        >
          {'Open'}
          <img src='/assets/images/related-arrow.svg' alt='arrow' className={`w-4 h-4 ml-1 mt-0.5`} />
        </button>
      </div>
      <hr className="mb-4" />
      <SanitizedText className='line-clamp-3 relative' html={formattedText} />
    </Link>
  )
}