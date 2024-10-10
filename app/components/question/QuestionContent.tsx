import { getQuestionBody, IQuestion, IUser } from "~/models/questionModel";
import {format} from "date-fns";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import SanitizedText from "~/components/question/SanitizedText";
import { PRODUCT_NAME } from "~/config/enviromenet";
import { getUserSlug } from "~/utils";
import { Link } from "@remix-run/react";

interface Props {
    question?: IQuestion;
    user?: IUser;
    isVerified: boolean;
}

export default function QuestionContent({ question, user, isVerified }: Props) {
    const createdAt = useMemo(() => getCreatedAtDate(question), [question]);
    const { t } = useTranslation();
    return (
        <div data-cy="question-content" className='flex flex-col w-full p-4'>
            <div className='w-full flex flex-col-reverse sm:flex-row flex-wrap sm:justify-between sm:items-center mb-3'>
                {(question?.created_at || user) && (
                    <AskedBy
                      user={user}
                      createdAt={createdAt}
                    />
                )}
                {isVerified && (
                  <div className='flex items-center gap-1.5 text-[#25b680] font-bold mb-5 sm:mb-0'>
                      <img src='/assets/images/verified.svg' alt='verifed' />
                      <p>{t('Verified')}</p>
                  </div>
                )}
            </div>
            {question?.text && (
              <SanitizedText
                className='lg:text-xl font-medium mb-3'
                html={getQuestionBody(question)}
                tag='h1'
              />
            )}
        </div>
    )
}

const AskedBy = ({ user, createdAt } :{
    user?: IUser, createdAt?: string
}) => {
    const userName = user?.view_name ? user?.view_name : `${PRODUCT_NAME} User`;
    
    return (
      <p className='text-[#667a87] text-sm'>
          {`Asked by `}
          {user?.user_id
            ? (
              <Link className='font-bold' to={`/user/${getUserSlug(user)}`}>
                {userName}
              </Link>
            ) : (
              <span className='font-bold'>
                {userName}
              </span>
            )
          }
          {` on ${createdAt}`}
      </p>
    );
}

const getCreatedAtDate = (question?: IQuestion) => (
    question?.created_at ? format(question.created_at, 'MMM dd, y') : undefined
)