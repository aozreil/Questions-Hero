import { MetaFunction } from "@remix-run/node";
import { getSeoMeta } from "~/utils/seo";
import Footer from "~/components/UI/Footer";
import LandingAboutSlide from "~/components/widgets/LandingAboutSlide";
import LandingSearchSlide from "~/components/widgets/LandingSearchSlide";
import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "~/config/enviromenet";
import SlidesNavigator from "~/components/UI/SlidesNavigator";
import { useSlides } from "~/context/SlidesProvider";

export const meta: MetaFunction = () => ([
  ...getSeoMeta({
    canonical: `${BASE_URL}/`,
  }),
]);

const NUMBER_OF_SLIDES = 2;

export default function Index() {
  const { currentSlide, setCurrentSlide, setPauseSlideNavigation } = useSlides();

  const setSlideByUser = useCallback((slideNumber: number) => {
    setCurrentSlide(slideNumber);
    setPauseSlideNavigation(true);
  }, []);

  const getHomeContent = () => {
    switch (currentSlide) {
      case 0: return <LandingSearchSlide />;
      case 1: return  <LandingAboutSlide />;
      default: return <LandingAboutSlide />;
    }
  }

  return (
    <div className='flex-1 flex flex-col relative'>
      <div className={`flex-1 flex items-start sm:pt-[5vh] 2xl:pt-[10vh] overflow-y-auto max-xl:pb-10`}>
        {getHomeContent()}
      </div>
      <div className='sticky w-full bottom-0 z-40 bg-[#f7f8fa] h-fit flex flex-col items-center'>
        <SlidesNavigator
          currentSlide={currentSlide}
          setCurrentSlide={setSlideByUser}
          numberOfSlides={NUMBER_OF_SLIDES}
          className='lg:hidden w-fit mb-4'
        />
        <Footer
          slidesNavigator={
            <SlidesNavigator
              currentSlide={currentSlide}
              setCurrentSlide={setSlideByUser}
              numberOfSlides={NUMBER_OF_SLIDES}
              className='max-lg:hidden'
            />
          }
        />
      </div>
    </div>
  );
}
