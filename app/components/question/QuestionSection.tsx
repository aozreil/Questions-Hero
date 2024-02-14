import { ReactNode, useState } from "react";

interface Props {
    title: string;
    content: ReactNode;
    defaultExpanded?: boolean;
    className?: string;
}

export default function QuestionSection({title, content, defaultExpanded, className}: Props) {
    const [expanded, setExpanded] = useState<boolean>(defaultExpanded || true);

    return (
        <div className={`w-full flex flex-col p-4 border-t-[3px] border-[#ebf2f6] py-[15px] ${className ?? ''}`}>
            <div className='cursor-pointer w-full flex justify-between items-center' onClick={() => setExpanded(!expanded)}>
                <h2 className='text-[17px] font-medium mb-1'>{title}</h2>
                <img
                    src='/assets/images/drop-down.svg'
                    alt='arrow-down'
                    className={`w-[15px] mr-2 ${expanded ? '-rotate-90' : 'rotate-90'}`}
                />
            </div>
            {expanded && content}
        </div>
    )
}