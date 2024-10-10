import { getAnswerBody, IAnswer, IQuestion, IUser } from "~/models/questionModel";
import UserProfile from "~/components/UI/UserProfile";
import { Link } from "@remix-run/react";
import { formatDate } from "date-fns";
import SanitizedText from "~/components/question/SanitizedText";

interface IProps {
  answer: IAnswer;
  user: IUser;
  question: IQuestion | undefined;
  text: string;
}

export default function MyAnswers({ answer, user, question, text }: IProps) {
  return <div data-cy={"MyAnswers"} className="rounded-md p-4 border border-[#BEC7CC]">
    <div className={"flex justify-between items-center w-100"}>
      <div className="flex space-x-2 overflow-hidden">
        <UserProfile user={user} className="h-10 w-10" />
        <div className='overflow-hidden pe-5'>
          <p className="text-[#344f60] h-6 flex gap-x-1.5">
            <span className='whitespace-nowrap'>{text}</span>
            <SanitizedText className="font-bold text-black overflow-hidden truncate" html={question?.text ?? ""} />
          </p>
          {answer.created_at && <p className="text-[#99a7af] text-sm">
            On {formatDate(answer.created_at, "MMM dd, yyyy")}
          </p>}
        </div>
      </div>
      <div>
        <Link className={"btn-gray text-[#4d6473]"} to={`/question/${answer.question_id}`}>
          View Question
        </Link>
      </div>
    </div>


    <hr className="my-3" />
     <div data-cy="final-answer">
       {!!answer?.answer_steps?.length && (
         <span className='font-medium inline'>Final Answer : </span>
       )}
      <SanitizedText html={getAnswerBody(answer)} className='inline' />
    </div>

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
  </div>;
}
