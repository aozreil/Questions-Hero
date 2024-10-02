import React from "react";
import { AnswerStatus } from "~/models/questionModel";
import { PRODUCT_NAME } from "~/config/enviromenet";

interface Props {
  answerCount: number;
  hasAiAnswer?: boolean;
  hasVerifiedAnswer?: boolean;
  answerStatus?: AnswerStatus;
  answerStatuses?: AnswerStatus[];
}

export default function QuestionType({ answerCount, hasAiAnswer, hasVerifiedAnswer, answerStatus, answerStatuses }: Props) {
  const getType = (): AnswerStatus => {
    if (answerStatus) return answerStatus;
    if (answerStatuses) {
      if (answerStatuses.includes(AnswerStatus.VERIFIED)) return AnswerStatus.VERIFIED;
      if (answerStatuses.includes(AnswerStatus.AI_ANSWER)) return AnswerStatus.AI_ANSWER;
      if (answerStatuses.includes(AnswerStatus.USER_ANSWER)) return AnswerStatus.USER_ANSWER;
    }
    if (hasVerifiedAnswer) return AnswerStatus.VERIFIED;
    if (hasAiAnswer) return AnswerStatus.AI_ANSWER;
    return AnswerStatus.USER_ANSWER;
  }

  const getQuestionBadge = () => {
    switch (getType()) {
      case AnswerStatus.VERIFIED: return (
        <div className="flex items-center space-x-2 text-[#25b680] font-bold">
          <img src="/assets/images/verified.svg" alt="verifed" />
          <p>Has Verified Answer</p>
        </div>
        );
      case AnswerStatus.AI_ANSWER: return (
        <div className="flex items-center space-x-2 text-[#ff9700] font-bold">
            <img src="/assets/images/ai-answered.svg" alt="verifed" />
            <p>Verified by {PRODUCT_NAME} AI</p>
          </div>
          )
      default: return ( <p className='text-[#99a7af] font-medium'>{`${answerCount} ${answerCount === 1 ? 'Answer' : 'Answers'}`}</p>
      )
    }
  }

  return (
    <div>
      {answerCount > 0
        ? getQuestionBadge()
        : <p data-cy="question-type" className='text-[#99a7af] font-medium'>Not answered yet</p>
      }
    </div>
  )
}