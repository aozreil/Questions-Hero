import {Question} from "~/models/questionModel";

interface Props {
    question?: Question;
    userName?: string;
}

export default function QuestionContent({ question, userName }: Props) {
    return (
        <div className='flex flex-col w-full p-4'>
            <div className='w-full flex flex-col-reverse sm:flex-row flex-wrap sm:justify-between sm:items-center mb-3'>
                {(question?.created_at_string || userName) && (
                    <p className='text-[#667a87] text-[13px]'>
                        {`Asked by `}
                        <span className='font-bold'>
                            {getAskedBy(question, userName)}
                        </span>
                    </p>
                )}
                <div className='flex items-center gap-[6px] text-[#25b680] text-[15px] font-bold mb-5 sm:mb-0'>
                    <img src='/assets/images/verified.svg' alt='verifed' />
                    <p>Verified</p>
                </div>
            </div>
            <p className='text-[15px] lg:text-[19px] font-medium mb-3'>
                {question?.text}
            </p>
        </div>
    )
}

const getAskedBy = (question?: Question, userName?: string) => {
    if (question?.created_at_string) {
        return userName ?`${userName} on ${question.created_at_string}` : `User on ${question.created_at_string}`;
    } else {
        return userName;
    }
}