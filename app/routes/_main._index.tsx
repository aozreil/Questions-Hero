import { MetaFunction } from "@remix-run/node";
import { getSeoMeta } from "~/utils/seo";
import Footer from "~/components/UI/Footer";
import LandingAboutSlide from "~/components/widgets/LandingAboutSlide";
import LandingSearchSlide from "~/components/widgets/LandingSearchSlide";
import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "~/config/enviromenet";

export const meta: MetaFunction = () => ([
  ...getSeoMeta({
    canonical: `${BASE_URL}/`,
  }),
]);

const NUMBER_OF_SLIDES = 2;

export default function Index() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [slideSelectedByUser, setSlideSelectedByUser] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isSearchFocused || slideSelectedByUser) return;
      const nextIndex = (currentSlide + 1) % NUMBER_OF_SLIDES;
      setCurrentSlide(nextIndex);
    }, 10000);

    return () => {
      clearInterval(interval);
    }
  }, [currentSlide, isSearchFocused]);

  const setSlideByUser = useCallback((slideNumber: number) => {
    setCurrentSlide(slideNumber);
    setSlideSelectedByUser(true);
  }, []);

  const getHomeContent = () => {
    switch (currentSlide) {
      case 0: return <LandingAboutSlide />;
      case 1: return  <LandingSearchSlide setIsSearchFocused={setIsSearchFocused} />;
      default: return <LandingAboutSlide />;
    }
  }

  return (
    <section className='flex-1 flex flex-col justify-between'>
      <div className='flex-1 flex sm:items-center'>
        {getHomeContent()}
      </div>
      <Footer
        currentSlide={currentSlide}
        setCurrentSlide={setSlideByUser}
        numberOfSlides={NUMBER_OF_SLIDES}
      />
    </section>
  );
}
