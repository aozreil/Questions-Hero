import { Link } from "@remix-run/react";
import { TERMS_NAVIGATION_LINKS } from "~/components/UI/Terms";

interface Props {
  slidesNavigator: React.ReactNode;
}

export default function Footer({slidesNavigator}: Props) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full gap-2 sm:gap-0 bg-[#f7f8fa] text-base border-t-2 border-[#ebf2f6] px-4 md:px-14 py-4 text-[#6e777f] flex justify-center sm:justify-between items-center gap-y-4 max-lg:flex-col">
      <p>
        All copyrights are reserved to{" "}
        <span className="font-bold">{`Askgram ® ${currentYear}`}</span>
      </p>
      {!!slidesNavigator && slidesNavigator}
      <div className="flex items-center space-x-3 [&>*:last-child]:hidden">
        {TERMS_NAVIGATION_LINKS?.map(term =>
          <>
            <Link
              key={term.text}
              to={term.link}
              className='text-center hover:text-[#070707]'
            >
              {term.text}
            </Link>
            <div className='sm:hidden border-r border-[#979da4] h-4' />
          </>
        )}
      </div>
    </footer>
  );
}
