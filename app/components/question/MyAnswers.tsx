import { IAnswer, IQuestion, IUser } from "~/models/questionModel";
import UserProfile from "~/components/UI/UserProfile";
import { Link } from "@remix-run/react";
import { formatDate } from "date-fns";

interface IProps {
  answer: IAnswer;
  user: IUser;
  question: IQuestion | undefined;
}

export default function MyAnswers({ answer, user, question }: IProps) {
  return <div className="rounded-md p-4 border border-[#BEC7CC]">
    <div className={"flex justify-between items-center"}>
      <div className="flex space-x-2">
        <UserProfile user={user} className="h-10 w-10" />
        <div>
          <p className="text-[#344f60] line-clamp-1">You answered {" "}
            <span className="font-bold text-black " dangerouslySetInnerHTML={{ __html: question?.text ?? "" }}></span>
          </p>
          {answer.created_at && <p className="text-[#99a7af] text-sm">
            On {formatDate(answer.created_at, "MMM dd, yyyy")}
          </p>}
        </div>
      </div>
      <div>
        <Link className={"btn-gray"} to={`/question/${answer.question_id}`}>
          View Question
        </Link>
      </div>
    </div>


    <hr className="my-3" />
    <p className="line-clamp-3" dangerouslySetInnerHTML={{ __html: answer.text ?? "" }}>

    </p>

  </div>;
}
