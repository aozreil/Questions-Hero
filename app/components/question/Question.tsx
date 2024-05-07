import PostedByUser from "~/components/question/PostedByUser";
import QuestionType from "~/components/question/QuestionType";
import { AnswerStatus, IUser } from "~/models/questionModel";
import { Link } from "@remix-run/react";

interface Props {
  questionBody: string;
  user?: IUser;
  createdAt?: string;
  slug?: string;
}

export default function Question({ user, questionBody, createdAt, slug }: Props) {
  return (
    <div className='flex-1 h-fit border border-[#99a7af] rounded-lg p-3.5'>
      <div className='flex items-center justify-between'>
        {user && <PostedByUser user={user} createdAt={createdAt} />}
        <Link to={`/question/${slug}`} className='btn-black'>Answer</Link>
      </div>
      <hr className='my-2.5' />

      <Link to={`/question/${slug}`} dangerouslySetInnerHTML={{ __html: questionBody }} />
      {/*<hr className='my-2.5' />*/}
      {/*<div className='flex items-center justify-between'>*/}
      {/*  <p className='text-sm'>Answered by <span className='font-bold'>Emad Wahbeh</span></p>*/}
      {/*  <QuestionType answerCount={2} answerStatus={AnswerStatus.VERIFIED} />*/}
      {/*</div>*/}
    </div>
  )
}
