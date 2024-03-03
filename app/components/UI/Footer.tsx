import { Link } from "@remix-run/react";
import { TERMS_NAVIGATION_LINKS } from "~/components/UI/Terms";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto gap-2 sm:gap-0 text-xs sm:text-base border-t-0.2 border-[#ebf2f6] px-4 md:px-14 py-7 text-[#6e777f] flex justify-center sm:justify-between items-center gap-y-4 max-lg:flex-col">
      <p>
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
