import { Form, useLocation, useSearchParams } from "@remix-run/react";
import clsx from "clsx";
import Loader from "~/components/UI/Loader";
import { useNavigation } from "react-router";
import { useEffect, useRef } from "react";

interface Props {
  className?: string;
}

export default function HeaderSearch({ className }: Props) {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTerm = searchParams?.get('term') ?? undefined;
  const isSearching = navigation.state === 'loading' && navigation.formAction === '/search';

  useEffect(() => {
    if (inputRef.current && location?.pathname !== '/search') {
      inputRef.current.value = '';
    }
  }, [location?.pathname]);

  return (
    <Form action="/search" className={clsx(`relative rounded-md w-[22rem] lg:w-[34rem]`, className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {isSearching
          ? <Loader className='w-4 h-4' />
          : <img src="/assets/images/search-icon.svg" alt="search" className="cursor-pointer" width={18}
                 height={18} />
        }
      </div>
      <input
        ref={inputRef}
        type="search"
        name="term"
        className="w-full rounded-md border-0 py-1.5 pl-10 pr-2 bg-[#f8f8f8] ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="Search for acadmic answers"
        defaultValue={searchTerm}
      />
    </Form>
  );
}