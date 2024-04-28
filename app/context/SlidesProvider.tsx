import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface ISlidesProvider {
  currentSlide: number;
  setPauseSlideNavigation: (pause: boolean) => void;
  setCurrentSlide: (slide: number) => void;
}

export enum LandingSlides {
  'SEARCH_SLIDE',
  'ABOUT_SLIDE'
}

const NUMBER_OF_SLIDES = 2;

const SlidesContext = createContext<ISlidesProvider | undefined>(undefined);

export default function SlidesProvider({ children }: { children: ReactNode }) {
  const [currentSlide, setCurrentSlide] = useState<number>(LandingSlides.SEARCH_SLIDE);
  const [pauseSlideNavigation, setPauseSlideNavigation] = useState<boolean>(false);

  useEffect(() => {
    if (pauseSlideNavigation) return;
    const interval = setInterval(() => {
      const nextIndex = (currentSlide + 1) % NUMBER_OF_SLIDES;
      setCurrentSlide(nextIndex);
    }, 30000);

    return () => {
      clearInterval(interval);
    }
  }, [currentSlide, pauseSlideNavigation]);

  return (
    <SlidesContext.Provider
      value={{ currentSlide, setPauseSlideNavigation, setCurrentSlide }}
    >
      {children}
    </SlidesContext.Provider>
  )
}

export function useSlides() {
  const context = useContext(SlidesContext);
  if (context === undefined) {
    throw new Error("useSlides must be used within Slides Provider");
  }
  return context;
}