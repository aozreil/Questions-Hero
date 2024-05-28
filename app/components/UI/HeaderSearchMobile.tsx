import clsx from "clsx";
import { Form, useLocation, useSearchParams } from "@remix-run/react";
import { ExpandableTextarea, IExpandableTextarea } from "~/components/UI/ExpandableTextarea";
import { useCallback, useEffect, useRef } from "react";
import { useSlides } from "~/context/SlidesProvider";
import { useOverlay } from "~/context/OverlayProvider";
import CloseIcon from "~/components/icons/CloseIcon";
import BackArrow from "~/components/icons/BackArrow";
import { useModals } from "~/context/ModalsProvider";
import { useNavigate } from "react-router";

interface Props {
  setIsSearchExpanded?: (expanded: boolean) => void;
  isSearchExpanded?: boolean;
}

export default function HeaderSearchMobile({ setIsSearchExpanded, isSearchExpanded }: Props) {
  const textareaRef = useRef<IExpandableTextarea>(null);
  const { ocrOpened, setOcrOpened } = useModals();
  const { setOverlayVisible, focusedOverlayStyles } = useOverlay();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const slides = location?.pathname === '/' ? useSlides() : undefined;
  const navigate = useNavigate();

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
    setIsSearchExpanded && setIsSearchExpanded(true);
  }, []);

  const onBlur = useCallback(() => {
    setIsSearchExpanded && setIsSearchExpanded(false);
    setOverlayVisible(false);
    if (textareaRef.current) {
      textareaRef.current.collapseRows();
      textareaRef.current.blur();
    }
  }, []);

  const handleSubmit = useCallback((e: any) => {
    e.preventDefault();

    if (textareaRef.current?.getValue()) {
      const term = textareaRef.current?.getValue()?.replaceAll('\n', ' ');
      navigate({ pathname: '/search', search: `?term=${term}` })
    }

    onBlur();
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
    if (textareaRef.current?.getValue()) {
      const term = textareaRef.current?.getValue()?.replaceAll('\n', ' ');
      navigate({ pathname: '/search', search: `?term=${term}` })
    }

    onBlur();
  }, []);

  const handleCancelClick = useCallback(() => {
    if (textareaRef.current) textareaRef.current.clearValue();
    // onBlur();
  }, []);

  return (
    <div className='flex items-center space-x-2 flex-1 max-h-[27px] overflow-y-visible'>
      {isSearchExpanded && (
        <button type='button' className='h-full flex items-center' onClick={onBlur}>
          <BackArrow className='w-6 h-6 mt-0.5 rotate-180 text-[#002237]' />
        </button>
      )}
      <Form
        action='/search'
        className={clsx(`sm:hidden z-10 py-1 px-3 bg-[#f2f4f5] min-h-[27px] h-fit flex-1
           rounded-2xl flex items-start justify-between flex-shrink-0`, isSearchExpanded && 'border border-[#99a7af]')}
        data-cy="header-search"
        onSubmit={handleSubmit}
        onBlur={handleBlur}
      >
        <ExpandableTextarea
          ref={textareaRef}
          className='textarea-scrollable rounded-lg cursor-text resize-none bg-transparent text-left py-0.5 flex-1 mr-3 max-h-[158px] outline-none border-none focus:ring-0'
          name='term'
          placeholder='Search'
          onFocus={onFocus}
          onEnter={onTextareaEnter}
        />
        {isSearchExpanded
          ? (
            <button type='button' className='h-full flex items-center' onClick={handleCancelClick}>
              <CloseIcon colorfill='#000' className='mt-2 w-3.5 h-3.5' />
            </button>
          ) : (
            <button type='button' onClick={() => setOcrOpened(true)}>
              <img src='/assets/images/search-ocr.svg' alt='search-by-image' className='w-6 h-6 mt-0.5' />
            </button>
          )
        }
      </Form>
    </div>
  )
}