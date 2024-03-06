import { Form, useLocation, useSearchParams } from "@remix-run/react";
import clsx from "clsx";
import Loader from "~/components/UI/Loader";
import { useNavigation } from "react-router";
import { useEffect, useRef } from "react";
import { useOverlay } from "~/routes/_main";

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
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { setOverlayVisible, overlayVisible } = useOverlay();
  const searchTerm = searchParams?.get('term') ?? undefined;
  const isSearching = navigation.state === 'loading' && navigation.formAction === '/search';

  useEffect(() => {
    // clear search value on location change
    if (inputRef.current && location?.pathname !== '/search') {
      inputRef.current.value = '';
    }
  }, [location?.pathname]);

  useEffect(() => {
    // if mobile remove styles applied by input[type=search]::-webkit-search-cancel-button
    if (window.innerWidth <= 640 && inputRef?.current) {
      inputRef.current.type = 'text';
      inputRef.current.placeholder = 'Search';
    }
  }, []);

  const onFocus = () => {
    if (setIsSearchExpanded && window.innerWidth <= 640) {
      setIsSearchExpanded(true);
      setOverlayVisible(true);
    }
  }

  const clearExpandedSearch = () => {
    if (setIsSearchExpanded) {
      setOverlayVisible(false);
      setIsSearchExpanded(false);
      if(mobileInputRef.current) mobileInputRef.current.value = ''
    }
  }

  useEffect(() => {
    if (!overlayVisible && isSearchExpanded && setIsSearchExpanded) {
      setIsSearchExpanded(false);
    }
  }, [overlayVisible]);

  const searchClickHandler = () => {
    formRef?.current?.submit();
    if (setIsSearchExpanded && isSearchExpanded && overlayVisible) {
      setIsSearchExpanded(false);
      setOverlayVisible(false);
    }
  }

  return (
    <Form ref={formRef} action="/search" className={clsx(`relative rounded-md max-sm:flex-1 sm:w-[22rem] lg:w-[34rem]`, className)}>
      <div className={clsx("absolute inset-y-0 sm:left-3 flex items-center", isSearchExpanded ? 'right-14' : 'max-sm:right-3')}>
        {isSearching
          ? <Loader className='w-2 sm:w-4 h-2 sm:h-4' />
          : <img
            src="/assets/images/search-icon.svg"
            alt="search"
            className="cursor-pointer w-5 h-5"
            onClick={searchClickHandler}
          />
        }
      </div>
      <div className='w-full flex space-x-2 items-center'>
        <input
          ref={inputRef}
          type="search"
          name="term"
          className={`w-full border-none py-1.5 bg-[#f8f8f8] placeholder:text-gray-400 focus:outline-none
            rounded-full max-sm:pr-10 max-sm:pl-3 focus:ring-1 focus:ring-inset max-sm:focus:ring-gray-300
            sm:rounded-md sm:pl-10 sm:pr-2 sm:bg-[#f2f4f5] sm:ring-1 sm:ring-inset sm:ring-[#99a7af] sm:focus:ring-[#070707] sm:text-sm sm:leading-6`}
          placeholder="Search for acadmic answers"
          defaultValue={searchTerm}
          onFocus={onFocus}
        />
        {isSearchExpanded && <img
          src='/assets/images/close-button.svg'
          alt='close' className='h-7 w-7'
          onClick={clearExpandedSearch}
        />}
      </div>
    </Form>
  );
}