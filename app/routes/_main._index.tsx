import { json, MetaFunction } from "@remix-run/node";
import { getSeoMeta } from "~/utils/seo";
import Footer from "~/components/UI/Footer";
import { BASE_URL } from "~/config/enviroment.server";
import LandingAboutSlide from "~/components/widgets/LandingAboutSlide";
import LandingSearchSlide from "~/components/widgets/LandingSearchSlide";
import { useCallback, useEffect, useState } from "react";

const HOW_SECTIONS = [
  {
    imgSrc: "/assets/images/you-how.png",
    title: "YOU",
    desc: "Ask any question related to your academic subjects, and our platform is here to support you in finding the information you're looking for!",
  },
  {
    imgSrc: "/assets/images/they-how.png",
    title: "THEY",
    desc: "Jump in and provide answers to your questions, as they help build a lively community of learners, creating a collaborative space.",
  },
  {
    imgSrc: "/assets/images/we-how.png",
    title: "WE",
    desc: "Work diligently to verify all questions with the help of our expert team, ensuring that the knowledge shared within our community is reliable and trustworthy.",
  },
];

export const meta: MetaFunction = ({ data }) => {
  const { canonical } = data as LoaderData;
  return [
    ...getSeoMeta({
      canonical,
    }),
  ];
};

interface LoaderData {
  canonical: string;
}

export async function loader () {
  return json<LoaderData>({ canonical: `${BASE_URL}/` })
}

const NUMBER_OF_SLIDES = 2;

export default function Index() {
  const [currentSlide, setCurrentSlide] = useState(0);
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
    <>
      {getHomeContent()}
      <Footer
        currentSlide={currentSlide}
        setCurrentSlide={setSlideByUser}
        numberOfSlides={NUMBER_OF_SLIDES}
      />
    </>
  );
}
