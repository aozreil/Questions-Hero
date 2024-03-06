import { Link } from "@remix-run/react";
import { TERMS_NAVIGATION_LINKS } from "~/components/UI/Terms";

interface Props {
  setCurrentSlide: (slideNumber: number) => void;
  currentSlide: number;
  numberOfSlides: number;
}

export default function Footer({setCurrentSlide, currentSlide, numberOfSlides}: Props) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto gap-2 sm:gap-0 text-xs sm:text-base border-t-0.2 border-[#ebf2f6] px-4 md:px-14 py-7 text-[#6e777f] flex justify-center sm:justify-between items-center gap-y-4 max-lg:flex-col">
      <p className='max-sm:hidden'>
        All copyrights are reserved to{" "}
        <span className="font-bold">{`Askgram ® ${currentYear}`}</span>
      </p>
      <div className='flex items-center space-x-1.5 bg-[#afafb0] p-2.5 rounded-full'>
        {Array(numberOfSlides).fill('').map((slide, index) => (
          <div
            key={index}
            className={`${index === currentSlide ? 'bg-[#f9fafc]' : 'bg-[#d7d9da]'} w-2.5 h-2.5 rounded-full cursor-pointer`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
      <p className='sm:hidden'>
        All copyrights are reserved to{" "}
        <span className="font-bold">{`Askgram ® ${currentYear}`}</span>
      </p>
      <div className="flex gap-y-1 gap-4 sm:gap-x-7">
        {TERMS_NAVIGATION_LINKS?.map(term =>
          <Link
            key={term.text}
            to={term.link}
            className='text-center hover:text-[#070707]'
          >{term.text}</Link>
        )}
      </div>
    </footer>
  );
}
