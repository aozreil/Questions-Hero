import React from "react";

interface Props {
  answerCount: number;
  hasAiAnswer?: boolean;
  hasVerifiedAnswer?: boolean;
}

export default function QuestionType({ answerCount, hasAiAnswer, hasVerifiedAnswer }: Props) {
  return (
    answerCount > 0
    ? hasAiAnswer && !hasVerifiedAnswer
        ? <div className="flex items-center space-x-2 text-[#ff9700] font-bold">
            <img src="/assets/images/ai-answered.svg" alt="verifed" />
            <p>Verified by Askgram AI</p>
          </div>
        : hasVerifiedAnswer
          ? <div className="flex items-center space-x-2 text-[#25b680] font-bold">
              <img src="/assets/images/verified.svg" alt="verifed" />
              <p>Has Verified Answer</p>
            </div>
          : <p className='text-[#99a7af] font-medium'>{`${answerCount} ${answerCount === 1 ? 'Answer' : 'Answers'}`}</p>
    : <p className='text-[#99a7af] font-medium'>Not answered yet</p>
  )
}