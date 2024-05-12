import { Form, useLocation, useSearchParams, useNavigation } from "@remix-run/react";
import clsx from "clsx";
import Loader from "~/components/UI/Loader";
import { useCallback, useEffect, useRef } from "react";
import { useOverlay } from "~/context/OverlayProvider";
import { useSlides } from "~/context/SlidesProvider";
import { useModals } from "~/context/ModalsProvider";

interface Props {
  className?: string;
  setIsSearchExpanded?: (expanded: boolean) => void;
  isSearchExpanded?: boolean;
}

export default function HeaderSearch({ className, setIsSearchExpanded, isSearchExpanded }: Props) {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const { setOverlayVisible, overlayVisible } = useOverlay();
  const { setOcrOpened } = useModals();
  const isSearching = navigation.state === 'loading' && navigation.formAction === '/search';
  const searchOutsideSearchPage = !location?.pathname?.includes('search')
  const slides = location?.pathname === '/' ? useSlides() : undefined;

  useEffect(() => {
    const searchTerm = searchParams?.get('term') ?? undefined;
    if (inputRef.current && location?.pathname !== '/search') {
      inputRef.current.value = '';
    } else if (searchTerm && inputRef.current && location?.pathname === '/search') {
      inputRef.current.value = searchTerm;
    }
  }, [location]);

  useEffect(() => {
    // if mobile remove styles applied by input[type=search]::-webkit-search-cancel-button
    if (window.innerWidth <= 640 && inputRef?.current) {
      inputRef.current.type = 'text';
      inputRef.current.placeholder = 'Search';
    }
  }, []);

  const onFocus = () => {
    slides?.setPauseSlideNavigation && slides.setPauseSlideNavigation(true);
    if (setIsSearchExpanded && window.innerWidth <= 640) {
      setIsSearchExpanded(true);
      setOverlayVisible(true);
    }
  }

  const onBlur = useCallback(() => {
    slides?.setPauseSlideNavigation && slides.setPauseSlideNavigation(false);
  }, [slides?.setPauseSlideNavigation])

  const onSubmit = () => {
    setOverlayVisible(false);
    isSearchExpanded && setIsSearchExpanded && setIsSearchExpanded(false);
    inputRef.current?.blur();
  }

  const clearExpandedSearch = () => {
    if (setIsSearchExpanded) {
      setOverlayVisible(false);
      setIsSearchExpanded(false);
    }
  }

  useEffect(() => {
    if (!overlayVisible && isSearchExpanded && setIsSearchExpanded) {
      setIsSearchExpanded(false);
    }
  }, [overlayVisible]);

  const searchClickHandler = () => {
    submitButtonRef?.current?.click();
    if (setIsSearchExpanded && isSearchExpanded && overlayVisible) {
      setIsSearchExpanded(false);
      setOverlayVisible(false);
    }
  }

  return (
    <Form
      action="/search"
      className={clsx(`relative rounded-md max-sm:flex-1 sm:w-[22rem] lg:w-[34rem]`, className)}
      onSubmit={onSubmit}
      data-cy="header-search"
    >
      <div className={clsx("absolute inset-y-0 sm:left-3 flex items-center", isSearchExpanded ? 'right-14' : 'max-sm:right-3')}>
        {isSearching && searchOutsideSearchPage
          ? <Loader className='w-5 h-5' />
          : <img
            src="/assets/images/search-icon.svg"
            alt="search"
            className="cursor-pointer w-5 h-5"
            onClick={searchClickHandler}
          />
        }
      </div>
      <div className='relative w-full flex space-x-2 items-center'>
        <input
          ref={inputRef}
          type="search"
          name="term"
          className={`w-full border-none py-1.5 bg-[#f8f8f8] placeholder:text-gray-400 focus:outline-none max-sm:text-2xl
            rounded-full max-sm:pr-12 max-sm:pl-3 focus:ring-1 focus:ring-inset max-sm:focus:ring-gray-300
            sm:pr-10 sm:rounded-md sm:pl-2 sm:bg-[#f2f4f5] sm:ring-1 sm:ring-inset sm:ring-[#99a7af] sm:focus:ring-[#070707] sm:text-sm sm:leading-6`}
          placeholder="Search for acadmic answers"
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete='off'
          required={true}
        />
        {!isSearchExpanded && (
          <button type='button' onClick={() => setOcrOpened(true)}>
            <img src='/assets/images/search-ocr.svg' alt='search-by-image' className='absolute w-6 sm:w-5 h-6 sm:h-5 right-5 sm:right-4 top-0 bottom-0 my-auto' />
          </button>
        )}
        {isSearchExpanded && <img
          src='/assets/images/close-button.svg'
          alt='close' className='h-7 w-7'
          onClick={clearExpandedSearch}
        />}
      </div>
      <button ref={submitButtonRef} type='submit' className='hidden' />
    </Form>
  );
}