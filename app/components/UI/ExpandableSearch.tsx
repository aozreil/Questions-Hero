import {useCallback, useRef, useState} from "react";
import { Form } from "@remix-run/react";

export default function ExpandableSearch() {
    const [hasValue, setHasValue] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [focused, setFocused] = useState(false)

    const onFocus = useCallback(() => setFocused(true), []);
    const onBlur = useCallback(() => setFocused(false), []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (hasValue && !e?.target?.value) setHasValue(false);
        if (!hasValue && e?.target?.value) setHasValue(true);
    }

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if(e.key == 'Enter' && !e.shiftKey) {
            e.preventDefault();
            !!textAreaRef?.current?.value && formRef?.current?.submit();
        }
    }, []);

    const handleCancelClick = useCallback(() => {
        setHasValue(false);
        if (textAreaRef.current) textAreaRef.current.value = '';
    }, []);

    return (
        <Form
          action='/search'
          ref={formRef}
          className='z-10 pt-4 pl-4 pr-3 bg-white border border-[#2b2b2b] min-h-[60px] h-fit w-[95%] sm:w-[30rem]
           md:w-[46rem] max-w-[46rem] rounded-[30px] flex items-start justify-between'
        >
            <img src='/assets/images/search-icon.svg' alt='search' className='cursor-pointer' width={27} height={27} />
            <textarea
              className='textarea-scrollable cursor-text resize-none w-full text-left pt-0.5 flex-1 mx-3 max-h-[158px] bg-white outline-none text-xl'
              rows={focused ? 3 : 1}
              name='term'
              placeholder='Search for acadmic answers…'
              ref={textAreaRef}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              onBlur={onBlur}
            />
            {hasValue && (
                <img
                    src='/assets/images/big-search-cancel.svg'
                    alt='cancel'
                    className='cursor-pointer'
                    width={30}
                    height={30}
                    onClick={handleCancelClick}
                />
            )}
        </Form>
    )
}