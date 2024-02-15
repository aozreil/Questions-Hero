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
        <div id='acceptedAnswer' className='w-full rounded-xl my-3 border border-[#aedbc8] bg-[#f4fbf8] overflow-hidden'>
            <div className='flex items-center justify-center py-2 bg-[#25b680] font-bold text-white gap-1.5'>
                <img src='/assets/images/verified-white.svg' alt='verifed' />
                <p>Verified Answer</p>
            </div>
            <div className='flex gap-3 w-full p-5 mt-3'>
                <div className='h-11 w-11 bg-[#002237] text-white twxt-xl flex items-center justify-center rounded-full border-2 border-[#5dc9a1] flex-shrink-0 font-semibold'>
                    {getUserInitials(userName)}
                </div>
                <div className='flex flex-col text-sm text-black'>
                    <p className='text-sm font-bold'>{userName ?? 'Answered By User'}</p>
                    {!!createdAt && <p className='mt-1 mb-4 text-xs'>{createdAt}</p>}
                    {answer?.text && (
                      <p className='font-medium' dangerouslySetInnerHTML={{ __html: answer?.text }} />
                    )}
                    {!!answer?.answer_steps?.length && (
                      answer.answer_steps.map((step, index) => (
                        step?.text ? (
                          <p
                              className='font-medium mt-2'
                              key={index}
                              dangerouslySetInnerHTML={{ __html: step?.text }}
                          />
                        ) :null
                      ))
                    )}
                </div>
            </div>
        </div>
    )
}

const getCreatedAt = (answer?: IAnswer) => (
    answer?.created_at ? getTimesAgo(answer.created_at) : undefined
)

const getUserInitials = (userName?: string) => {
    if (!userName) return 'A';
    const nameFields = userName?.split(' ');
    const firstInitial = nameFields?.[0]?.charAt(0)?.toUpperCase() ?? '';
    const secondInitial = nameFields?.[1]?.charAt(0)?.toUpperCase() ?? '';

    return `${firstInitial}${secondInitial}`
}