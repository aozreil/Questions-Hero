import { Link, useLocation } from "@remix-run/react";
import HeaderSearch from "~/components/UI/HeaderSearch";
import { useAuth } from "~/context/AuthProvider";
import { useState } from "react";
import clsx from "clsx";
import { useOverlay } from "~/context/OverlayProvider";
import HeaderJoin from "~/components/UI/HeaderJoin";
import { useSlides } from "~/context/SlidesProvider";
import HeaderSearchMobile from "~/components/UI/HeaderSearchMobile";

export default function Header() {
    const location = useLocation();
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const { isLoadingUserData } = useAuth();
    const { focusedOverlayStyles } = useOverlay();
    const slides = location?.pathname === '/' ? useSlides() : undefined;
    const isLandingPage = location?.pathname === '/';
    const shouldHideSearch = isLandingPage && slides?.currentSlide === 0;
    const { user } = useAuth();
    return (
      <header data-cy="header" className={clsx(
        `sticky top-0 z-40 h-24 w-full bg-[#f7f8fa] border-t-[3px] border-t-[#070707] max-sm:px-4 pt-7 pb-6`,
        location?.pathname !== '/' && `bg-white ${isSearchFocused ? 'border-b-0' : 'border-b-[1px] sm:border-b-[2px]'} border-[#ebf2f6]`,
        isSearchExpanded && focusedOverlayStyles,
        isSearchFocused && 'z-50',
      )}>
        <div className={`container sm:px-4 md:px-10 flex items-center justify-between`}>
          <div className='flex items-center pr-2 flex-1'>
            <Link to={user ? '/subjects' : '/'} className={clsx('block w-fit mr-5 sm:mr-6', isSearchExpanded && 'hidden')}>
                <img src='/assets/images/asklix-logo.png' alt='logo' className='h-6 sm:h-8 w-fit object-contain' height={32} />
            </Link>
            {!shouldHideSearch &&
              <HeaderSearch
                setIsSearchFocused={setIsSearchFocused}
                isSearchFocused={isSearchFocused}
              />
            }
            {!shouldHideSearch &&
              <HeaderSearchMobile
                setIsSearchExpanded={setIsSearchExpanded}
                isSearchExpanded={isSearchExpanded}
              />
            }
          </div>
          <div className={clsx('text-[#1a384b] max-sm:text-sm font-medium flex items-center gap-3 sm:gap-5', isSearchExpanded && 'hidden')}>
            <Link to='/ask-question' className='max-lg:hidden' data-cy='header-ask-question'>Ask Question</Link>
            {isLoadingUserData ? null : <HeaderJoin />}
          </div>
        </div>
        {isSearchFocused && (
          <div
            className="absolute inset-0 z-50 w-full h-full bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
          />
        )}
        </header>
    )
}