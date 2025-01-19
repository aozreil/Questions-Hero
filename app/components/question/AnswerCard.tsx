import { AnswerStatus, getAnswerBody, IAnswer, IUser } from "~/models/questionModel";
import {useState} from "react";
import UserProfile from "~/components/UI/UserProfile";
import { getCreatedAt } from "~/utils";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import SanitizedText from "~/components/question/SanitizedText";
import { UserNameLink } from "~/components/UI/UserNameLink";

interface Props {
    answer?: IAnswer;
    user?: IUser;
}

export default function AnswerCard({ answer, user }: Props) {
    const [createdAt] = useState(() => getCreatedAt(answer?.created_at));
    const isVerified = answer?.answer_status === AnswerStatus.VERIFIED;
    const { t } = useTranslation();
    return (
        <div
          id={isVerified ? 'acceptedAnswer' : 'userAnswer'}
          className={
            clsx(`w-full rounded-xl border overflow-hidden`,
            isVerified ? 'bg-[#f4fbf8] border-[#aedbc8]' : 'bg-white border-[#e0e0e0]'
          )}
          data-cy="answer-card"
        >
          {isVerified && (
            <div className='flex items-center justify-center py-2 bg-[#25b680] font-bold text-white gap-1.5'>
              <img src='/assets/images/verified-white.svg' alt='verifed' />
              <p>{t("Verified Answer")}</p>
            </div>
          )}
          <div className='flex gap-3 w-full p-5 mt-3'>
            <UserProfile user={user} />
            <div className='flex flex-col text-sm text-black pr-2 h-auto w-full overflow-hidden'>
              <UserNameLink user={user} className="text-sm font-bold capitalize"/>
              {!!createdAt && <span className='mt-1 mb-4 text-xs'>{createdAt}</span>}
              {answer?.text && (
                <div data-cy="final-answer">
                  {!!answer?.answer_steps?.length && (
                    <span className='font-medium inline'>Final Answer : </span>
                  )}
                  <SanitizedText html={getAnswerBody(answer)} className='inline' />
                </div>
              )}
              {!!answer?.answer_steps?.length && (
                answer.answer_steps.map((step, index) => (
                  step?.text ? (
                    <div
                        className='mt-2'
                        key={index}
                        data-cy="explanation"
                    >
                      <span className='font-medium inline'>Explanation : </span>
                      <SanitizedText html={step?.text} className='inline' />
                    </div>
                  ) :null
                ))
              )}
            </div>
          </div>
        </div>
    )
}
