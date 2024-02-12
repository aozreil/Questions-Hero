import {IAnswer} from "~/models/questionModel";
import {getTimesAgo} from "~/utils";
import {useState} from "react";

interface Props {
    answer?: IAnswer;
    userName?: string;
}

export default function AnswerCard({ answer, userName }: Props) {
    const [createdAt] = useState(() => getCreatedAt(answer));
    return (
        <div className='w-full rounded-xl my-3 border border-[#aedbc8] bg-[#f4fbf8] overflow-hidden'>
            <div className='flex items-center justify-center py-2 bg-[#25b680] font-bold text-white text-[15px] gap-[6px]'>
                <img src='/assets/images/verified-white.svg' alt='verifed' />
                <p>Verified Answer</p>
            </div>
            <div className='flex gap-3 w-full p-5 mt-3'>
                <div className='h-[44px] w-[44px] bg-[#f1f5fb] rounded-full border-2 border-[#5dc9a1] flex-shrink-0' />
                <div className='flex flex-col text-[13px] text-black'>
                    {!!userName && <p className='text-[13px] font-bold'>{userName}</p>}
                    {!!createdAt && <p className='mt-[5px] mb-[15px] text-xs'>{createdAt}</p>}
                    <p className='text-[17px] font-medium'>
                        {answer?.text}
                    </p>
                </div>
            </div>
        </div>
    )
}

const getCreatedAt = (answer?: IAnswer) => (
    answer?.created_at ? getTimesAgo(answer.created_at) : undefined
)