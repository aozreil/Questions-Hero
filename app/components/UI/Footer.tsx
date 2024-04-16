import { Link } from "@remix-run/react";
import { TERMS_NAVIGATION_LINKS } from "~/components/UI/Terms";
import React, { Fragment } from "react";

interface Props {
  slidesNavigator?: React.ReactNode;
}

export default function Footer({ slidesNavigator }: Props) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full bg-[#f7f8fa] text-base border-t-2 border-[#ebf2f6] text-[#6e777f]"
    >
      <div className='container w-full flex justify-center sm:justify-between items-center gap-y-4 max-lg:flex-col px-4 md:px-10 py-4 max-sm:pb-8'>
        <p>
          All copyrights are reserved to{" "}
          <span className="font-bold">{`Askgram ® ${currentYear}`}</span>
        </p>
        {!!slidesNavigator && slidesNavigator}
        <div className="flex items-center space-x-3 [&>*:last-child]:hidden">
          {TERMS_NAVIGATION_LINKS?.map(term =>
            <Fragment key={term.text}>
            <Link
              to={term.link}
              className="text-center hover:text-[#070707]"
              >
                {term.text}
              </Link>
              <div className="sm:hidden border-r border-[#979da4] h-4" />
            </Fragment>
          )}
        </div>
      </div>
    </footer>
  );
}
