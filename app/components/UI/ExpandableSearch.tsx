import { useCallback, useEffect, useRef, useState } from "react";
import { Form } from "@remix-run/react";
import { useOverlay } from "~/context/OverlayProvider";
import clsx from "clsx";
import CloseIcon from "~/components/icons/CloseIcon";
import { useSlides } from "~/context/SlidesProvider";
import { ExpandableTextarea, IExpandableTextarea } from "~/components/UI/ExpandableTextarea";
import { useNavigate } from "react-router";
import { useModals } from "~/context/ModalsProvider";

export default function ExpandableSearch() {
    const [hasValue, setHasValue] = useState(false);
    const textareaRef = useRef<IExpandableTextarea>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const submitButton = useRef<HTMLButtonElement>(null);
    const { setOverlayVisible, focusedOverlayStyles } = useOverlay();
    const { setPauseSlideNavigation } = useSlides();
    const { ocrOpened, setOcrOpened } = useModals();
    const navigate = useNavigate();

    useEffect(() => {
        setPauseSlideNavigation(true);
    }, [ocrOpened]);

    const onFocus = useCallback(() => {
        setPauseSlideNavigation(true);
        setOverlayVisible(true);
    }, []);

    const onBlur = useCallback(() => {
        setPauseSlideNavigation(false);
        setOverlayVisible(false);
        if (textareaRef.current) textareaRef.current.collapseRows();
    }, []);

    const handleBlur = useCallback(
      (e: any) => {
          const currentTarget = e.currentTarget;

          if (ocrOpened) return;
          // Give browser time to focus the next element
          requestAnimationFrame(() => {
              // Check if the new focused element is a child of the original container
              if (!currentTarget.contains(document.activeElement)) {
                  onBlur();
              }
          });
      },
      [onBlur, ocrOpened]
    );

    const onTextareaEnter = useCallback(() => {
        onBlur();
        !!textareaRef.current?.getValue() && submitButton?.current?.click();
    }, []);

    const handleCancelClick = useCallback(() => {
        setHasValue(false);
        if (textareaRef.current) textareaRef.current.clearValue();
        onBlur();
    }, []);

    const handleSubmit = useCallback((e: any) => {
        e.preventDefault();

        if (textareaRef.current?.getValue()) {
            const term = textareaRef.current?.getValue()?.replaceAll('\n', ' ');
            navigate({ pathname: '/search', search: `?term=${term}` })
        }
        onBlur();
    }, []);

    return (
      <>
        <Form
          action='/search'
          ref={formRef}
          className={clsx(`z-10 py-2 sm:py-3.5 px-5 bg-white border border-[#2b2b2b] min-h-[40px] sm:min-h-[60px] h-fit w-[90%]
           md:w-[46rem] max-w-[46rem] rounded-[30px] flex items-start justify-between flex-shrink-0`, focusedOverlayStyles)}
          onBlur={handleBlur}
          onSubmit={handleSubmit}
          data-cy="landing-search"
        >
            <button ref={submitButton} className='flex-shrink-0' type='submit'>
                <img
                  src='/assets/images/search-icon.svg'
                  alt='search'
                  className='cursor-pointer flex-shrink-0 mt-2 sm:mt-1 w-6 h-6 sm:w-7 sm:h-7'
                />
            </button>
            <ExpandableTextarea
              ref={textareaRef}
              className='textarea-scrollable max-sm:mt-0.5 border-0 rounded-lg cursor-text resize-none w-full text-left py-0.5 flex-1 mx-3 max-h-[158px] bg-white outline-none text-xl border-none focus:ring-0'
              name='term'
              placeholder='Search for acadmic answers…'
              onEnter={onTextareaEnter}
              onFocus={onFocus}
              setHasValue={setHasValue}
            />
            {hasValue ? (
              <button type='button' className='h-full flex items-center' onClick={handleCancelClick}>
                <CloseIcon colorfill='#000' className='mt-2.5 w-3.5 h-3.5' />
              </button>
            ) : (
              <button type='button' onClick={() => setOcrOpened(true)}>
                  <img src='/assets/images/search-ocr.svg' alt='search-by-image' className='w-7 h-7 mt-1' />
              </button>
            )}
        </Form>
      </>
    )
}
