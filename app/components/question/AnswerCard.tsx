import { AnswerStatus, IAnswer, IUser } from "~/models/questionModel";
import {useState} from "react";
import UserProfile from "~/components/UI/UserProfile";
import { getCreatedAt } from "~/utils";
import clsx from "clsx";

interface Props {
    answer?: IAnswer;
    user?: IUser;
}

export default function AnswerCard({ answer, user }: Props) {
    const [createdAt] = useState(() => getCreatedAt(answer?.created_at));
    const isVerified = answer?.answer_status === AnswerStatus.VERIFIED;
    return (
        <div
          id={isVerified ? 'acceptedAnswer' : 'userAnswer'}
          className={
            clsx(`w-full rounded-xl border overflow-hidden`,
            isVerified ? 'bg-[#f4fbf8] border-[#aedbc8]' : 'bg-white border-[#e0e0e0]'
          )}
        >
          {isVerified && (
            <div className='flex items-center justify-center py-2 bg-[#25b680] font-bold text-white gap-1.5'>
              <img src='/assets/images/verified-white.svg' alt='verifed' />
              <p>Verified Answer</p>
            </div>
          )}
          <div className='flex gap-3 w-full p-5 mt-3'>
            <UserProfile user={user} />
            <div className='flex flex-col text-sm text-black'>
              <p className='text-sm font-bold'>{user?.view_name ?? 'Answered By Askgram User'}</p>
              {!!createdAt && <p className='mt-1 mb-4 text-xs'>{createdAt}</p>}
              {answer?.text && (
                <p>
                  <span className='font-medium'>Final Answer : </span>
                  <span dangerouslySetInnerHTML={{ __html: answer?.text }} />
                </p>
              )}
              {!!answer?.answer_steps?.length && (
                answer.answer_steps.map((step, index) => (
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
          </div>
        </div>
    )
}