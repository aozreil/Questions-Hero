import { IQuestion, IUser } from "~/models/questionModel";
import {format} from "date-fns";
import {useState} from "react";

interface Props {
    question?: IQuestion;
    user?: IUser;
}

export default function QuestionContent({ question, user }: Props) {
    const [createdAt] = useState(() => getCreatedAtDate(question));
    return (
        <div className='flex flex-col w-full p-4'>
            <div className='w-full flex flex-col-reverse sm:flex-row flex-wrap sm:justify-between sm:items-center mb-3'>
                {(question?.created_at || user) && (
                    <p className='text-[#667a87] text-sm'>
                        {`Asked by `}
                        <span className='font-bold'>
                            {getAskedBy(createdAt, user?.view_name)}
                        </span>
                    </p>
                )}
                <div className='flex items-center gap-1.5 text-[#25b680] font-bold mb-5 sm:mb-0'>
                    <img src='/assets/images/verified.svg' alt='verifed' />
                    <p>Verified</p>
                </div>
            </div>
            {question?.text && (
                <h1
                    className='lg:text-xl font-medium mb-3'
                    dangerouslySetInnerHTML={{ __html: question.text }}
                />
            )}
        </div>
    )
}

const getAskedBy = (createdAt?: string, userName?: string) => {
    if (createdAt) {
        return userName ?`${userName} on ${createdAt}` : `Askgram User on ${createdAt}`;
    } else {
        return userName;
    }
}

const getCreatedAtDate = (question?: IQuestion) => (
    question?.created_at ? format(question.created_at, 'MMM dd, y') : undefined
)