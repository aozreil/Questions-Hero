import { ReactNode } from "react";
import { Disclosure } from "@headlessui/react";
import clsx from "clsx";

interface Props {
    title: string;
    content: ReactNode;
    defaultExpanded?: boolean;
    className?: string;
}

export default function QuestionSection({title, content, defaultExpanded, className}: Props) {
    return (
        <Disclosure defaultOpen={defaultExpanded ?? true}>
            {({ open }) => (
              <div className={clsx(
                'w-full flex flex-col px-4 border-t-[3px] border-[#ebf2f6] py-4',
                'transition-[max-height] ease-out duration-300 flex-shrink-0 overflow-y-hidden',
                open ? 'max-h-[1000px] ease-in' : 'max-h-16',
                className,
              )}>
                  <Disclosure.Button className='cursor-pointer w-full flex justify-between items-center'>
                      <h3 className='font-medium mb-1'>{title}</h3>
                      <img
                        src='/assets/images/drop-down.svg'
                        alt='arrow-down'
                        className={`w-4 mr-2 transition-all duration-200 ${open ? '-rotate-90' : 'rotate-90'}`}
                      />
                  </Disclosure.Button>
                  <div>{content}</div>
              </div>
            )}
        </Disclosure>
    )
}