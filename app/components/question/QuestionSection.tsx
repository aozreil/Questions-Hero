import {useState} from "react";

interface Props {
    title: string;
    content: React.ReactNode;
    defaultExpanded?: boolean;
    className?: string;
}

export default function QuestionSection({title, content, defaultExpanded, className}: Props) {
    const [expanded, setExpanded] = useState<boolean>(defaultExpanded || true);

    return (
        <div className={`w-full flex flex-col p-4 border-t-[3px] border-[#ebf2f6] ${expanded ? 'py-[22px]' : 'py-[15px]'} ${className}`}>
            <div className='cursor-pointer w-full flex justify-between items-center' onClick={() => setExpanded(!expanded)}>
                <h3 className='text-[17px] font-medium mb-1'>{title}</h3>
                <img
                    src='/assets/images/drop-down.svg'
                    alt='arrow-down'
                    className={`w-[15px] ${expanded ? '-rotate-90' : 'rotate-90'}`}
                />
            </div>
            {expanded && content}
        </div>
    )
}