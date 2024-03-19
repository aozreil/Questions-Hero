import { useCallback, useRef, useState } from "react";
import { Form } from "@remix-run/react";
import { useOverlay } from "~/context/OverlayProvider";
import clsx from "clsx";
import CloseIcon from "~/components/icons/CloseIcon";

interface Props {
    setIsSearchFocused: (isFocused: boolean) => void;
}

export default function ExpandableSearch({ setIsSearchFocused }: Props) {
    const [hasValue, setHasValue] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const submitButton = useRef<HTMLButtonElement>(null);
    const { setOverlayVisible, focusedOverlayStyles } = useOverlay();

    const onFocus = useCallback(() => {
        setIsSearchFocused(true);
        setOverlayVisible(true);
        if (textAreaRef.current) calculateTextareaRows(textAreaRef.current.value)

    }, []);

    const onBlur = useCallback(() => {
        setIsSearchFocused(false);
        setOverlayVisible(false);
        if (textAreaRef.current) textAreaRef.current.rows = 1;
    }, []);

    const handleBlur = useCallback(
      (e: any) => {
          const currentTarget = e.currentTarget;

          // Give browser time to focus the next element
          requestAnimationFrame(() => {
              // Check if the new focused element is a child of the original container
              if (!currentTarget.contains(document.activeElement)) {
                  onBlur();
              }
          });
      },
      [onBlur]
    );

    const calculateTextareaRows = useCallback((text?: string) => {
        if (textAreaRef.current && text !== undefined) {
            const rows = Math.min(Math.floor(text.length / 70), 3) + 1;
            const hasNewLines = text.includes('\n');

            if (hasNewLines) {
                textAreaRef.current.rows = 3;
            } else if (rows !== textAreaRef.current.rows) {
                textAreaRef.current.rows = rows <= 3 ? rows : 3;
            }
        }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (hasValue && !e?.target?.value) setHasValue(false);
        if (!hasValue && e?.target?.value) setHasValue(true);

        calculateTextareaRows(e?.target?.value);
    }

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if(e.key == 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onBlur();
            !!textAreaRef?.current?.value && submitButton?.current?.click();
        }
    }, []);

    const handleCancelClick = useCallback(() => {
        setHasValue(false);
        if (textAreaRef.current) textAreaRef.current.value = '';
        onBlur();
    }, []);

    return (
        <Form
          action='/search'
          ref={formRef}
          className={clsx(`z-10 py-2 sm:py-3.5 px-5 bg-white border border-[#2b2b2b] min-h-[40px] sm:min-h-[60px] h-fit w-[90%]
           md:w-[46rem] max-w-[46rem] rounded-[30px] flex items-start justify-between flex-shrink-0`, focusedOverlayStyles)}
          onBlur={handleBlur}
          onSubmit={onBlur}
        >
            <button ref={submitButton} className='flex-shrink-0' type='submit'>
                <img
                  src='/assets/images/search-icon.svg'
                  alt='search'
                  className='cursor-pointer flex-shrink-0 max-sm:mt-1 w-6 h-6 sm:w-7 sm:h-7'
                />
            </button>
            <textarea
              className='textarea-scrollable max-sm:mt-0.5 rounded-lg cursor-text resize-none w-full text-left py-0.5 flex-1 mx-3 max-h-[158px] bg-white outline-none text-xl'
              rows={1}
              name='term'
              placeholder='Search for acadmic answers…'
              ref={textAreaRef}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              required={true}
            />
            {hasValue && (
              <button type='button' className='h-full flex items-center' onClick={handleCancelClick}>
                <CloseIcon colorfill='#000' className='mt-2.5 w-3.5 h-3.5' />
              </button>
            )}
        </Form>
    )
}