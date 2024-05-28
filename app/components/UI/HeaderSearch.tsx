import { Form, useLocation, useSearchParams } from "@remix-run/react";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { useOverlay } from "~/context/OverlayProvider";
import { useSlides } from "~/context/SlidesProvider";
import { useModals } from "~/context/ModalsProvider";
import { ExpandableTextarea, IExpandableTextarea } from "~/components/UI/ExpandableTextarea";
import { useNavigate } from "react-router";
import CloseIcon from "~/components/icons/CloseIcon";

interface Props {
  className?: string;
  setIsSearchExpanded?: (expanded: boolean) => void;
  setIsSearchFocused?: (focused: boolean) => void;
  isSearchExpanded?: boolean;
}

export default function HeaderSearch({ className, setIsSearchExpanded, isSearchExpanded, setIsSearchFocused }: Props) {
  const [hasValue, setHasValue] = useState(false);
  const textareaRef = useRef<IExpandableTextarea>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submitButton = useRef<HTMLButtonElement>(null);
  const { setOverlayVisible, focusedOverlayStyles } = useOverlay();
  const { ocrOpened, setOcrOpened } = useModals();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const slides = location?.pathname === '/' ? useSlides() : undefined;

  useEffect(() => {
    if (location?.pathname !== '/search' && textareaRef.current) {
      textareaRef.current.clearValue();
    } else if (location?.pathname === '/search' && searchParams.get('term')) {
      textareaRef.current && textareaRef.current.setValue(searchParams.get('term') ?? '');
    }
  }, [location?.pathname]);

  useEffect(() => {
    slides?.setPauseSlideNavigation && slides?.setPauseSlideNavigation(ocrOpened);
  }, [ocrOpened]);

  const onFocus = useCallback(() => {
    slides?.setPauseSlideNavigation && slides?.setPauseSlideNavigation(true);
    setOverlayVisible(true);
    setIsSearchFocused && setIsSearchFocused(true);
  }, []);

  const onBlur = useCallback(() => {
    slides?.setPauseSlideNavigation && slides?.setPauseSlideNavigation(false);
    setOverlayVisible(false);
    if (textareaRef.current) {
      textareaRef.current.collapseRows();
      textareaRef.current.blur();
    }
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
    <div className='max-sm:hidden max-h-10 overflow-y-visible'>
      <Form
        action='/search'
        ref={formRef}
        className={clsx(`z-10 py-1 px-3 bg-[#f8f8f8] border border-[#99a7af] min-h-[36px] h-fit sm:w-[22rem] lg:w-[34rem]
         rounded-md flex items-start justify-between flex-shrink-0`, focusedOverlayStyles)}
        onBlur={handleBlur}
        onSubmit={handleSubmit}
        data-cy="header-search"
      >
        <button ref={submitButton} className='flex-shrink-0' type='submit'>
          <img
            src='/assets/images/search-icon.svg'
            alt='search'
            className='cursor-pointer flex-shrink-0 mt-2 sm:mt-1 w-5 h-5'
          />
        </button>
        <ExpandableTextarea
          ref={textareaRef}
          className='textarea-scrollable max-sm:mt-0.5 rounded-lg cursor-text resize-none w-full bg-transparent text-left py-0.5 flex-1 mx-3 max-h-[158px] outline-none border-none focus:ring-0'
          name='term'
          placeholder='Search for acadmic answers…'
          onEnter={onTextareaEnter}
          onFocus={onFocus}
          setHasValue={setHasValue}
        />
        {hasValue ? (
          <button type='button' className='h-full flex items-center' onClick={handleCancelClick}>
            <CloseIcon colorfill='#000' className='mt-2 w-3.5 h-3.5' />
          </button>
        ) : (
          <button type='button' onClick={() => setOcrOpened(true)}>
            <img src='/assets/images/search-ocr.svg' alt='search-by-image' className='w-6 h-6 mt-1' />
          </button>
        )}
      </Form>
    </div>
  );
}