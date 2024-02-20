import { Link } from "@remix-run/react";
import { TERMS_NAVIGATION_LINKS } from "~/routes/_main.terms.$slug";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto container gap-2 sm:gap-0 text-xs sm:text-base border-t-0.2 border-[#ebf2f6] px-4 md:px-14 py-7 text-[#6e777f] flex justify-center sm:justify-between items-center flex-wrap">
      <p>
        All copyrights are reserved to{" "}
        <span className="font-bold">{`Askgram ® ${currentYear}`}</span>
      </p>
      <div className="flex gap-7">
        {TERMS_NAVIGATION_LINKS?.map(term =>
          <Link
            key={term.text}
            to={term.link}
            className='hover:text-[#070707]'
          >{term.text}</Link>
        )}
      </div>
    </footer>
  );
}
