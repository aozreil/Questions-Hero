import PostedByUser from "~/components/question/PostedByUser";
import QuestionType from "~/components/question/QuestionType";
import { AnswerStatus, IUser } from "~/models/questionModel";
import { Link } from "@remix-run/react";

interface Props {
  questionBody: string;
  user?: IUser;
  createdAt?: string;
  slug?: string;
  isLoggedIn?: boolean;
  answerStatuses?: AnswerStatus[];
  answerCount?: number;
}

export default function Question({
  user, questionBody, createdAt, slug, isLoggedIn, answerStatuses, answerCount
}: Props) {
  return (
    <div className='w-full h-fit border border-[#99a7af] rounded-lg p-3.5 bg-white'>
      <div className='flex items-center justify-between'>
        {user && <PostedByUser user={user} createdAt={createdAt} />}
        {isLoggedIn && <Link to={`/question/${slug}`} target='_blank' className='btn-black'>Answer</Link>}
      </div>
      <hr className='my-2.5' />

      <Link to={`/question/${slug}`} target='_blank' dangerouslySetInnerHTML={{ __html: questionBody }} />
      {(answerStatuses?.length && answerCount) && (
        <>
          <hr className='my-2.5' />
          <div className='flex items-center justify-end'>
            <QuestionType
              answerCount={answerCount}
              answerStatuses={answerStatuses}
            />
          </div>
        </>
      )}
    </div>
  )
}
