import {useCallback, useRef, useState} from "react";
import { Form } from "@remix-run/react";
import { useOverlay } from "~/routes/_main";
import clsx from "clsx";

interface Props {
    setIsSearchFocused: (isFocused: boolean) => void;
}

export default function ExpandableSearch({ setIsSearchFocused }: Props) {
    const [hasValue, setHasValue] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [focused, setFocused] = useState(false);
    const { setOverlayVisible, focusedOverlayStyles } = useOverlay();

    const onFocus = useCallback(() => {
        setFocused(true);
        setIsSearchFocused(true);
        setOverlayVisible(true)

    }, []);

    const onBlur = useCallback(() => {
        setFocused(false);
        setIsSearchFocused(false);
        setOverlayVisible(false)
    }, []);

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
          className={clsx(`z-10 pt-2 sm:pt-4 pl-4 pr-3 bg-white border border-[#2b2b2b] min-h-[40px] sm:min-h-[60px] h-fit w-[90%] sm:w-[30rem]
           md:w-[46rem] max-w-[46rem] rounded-[30px] flex items-start justify-between`, focusedOverlayStyles)}
        >
            <img src='/assets/images/search-icon.svg' alt='search' className='cursor-pointer' width={27} height={27} />
            <textarea
              className='textarea-scrollable rounded-lg cursor-text resize-none w-full text-left pt-0.5 flex-1 mx-3 max-h-[158px] bg-white outline-none text-xl'
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