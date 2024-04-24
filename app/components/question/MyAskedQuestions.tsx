import { IQuestion, IUser } from "~/models/questionModel";
import UserProfile from "~/components/UI/UserProfile";
import { Link } from "@remix-run/react";
import { formatDate } from "date-fns";

interface IProps {
  question: IQuestion;
  user: IUser;
  text: string
}

export default function MyAskedQuestions({ question, user, text }: IProps) {
  return <div className="rounded-md p-4 border border-[#BEC7CC]" data-cy={'MyAskedQuestions'}>
    <div className={"flex justify-between items-center"}>
      <div className="flex space-x-2">
        <UserProfile user={user} className="h-10 w-10" />
        <div>
          <p className="text-[#344f60] line-clamp-1"> {text}
          </p>
          {question.created_at && <p className="text-[#99a7af] text-sm">
            On {formatDate(question.created_at, "MMM dd, yyyy")}
          </p>}
        </div>
      </div>
      <div>
        <Link className={"btn-gray"} to={`/question/${question.slug}`}>
          View Question
        </Link>
      </div>
    </div>
    <hr className="my-3" />

    <p className='line-clamp-3' dangerouslySetInnerHTML={{ __html: question.text }}>

    </p>

  </div>;
}
