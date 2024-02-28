import { Link, useLocation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

export interface ITerms {
  title: string;
  description: string;
  pageDescription: string;
  lastUpdated: string;
  sections?: {
    title: string;
    terms: string[];
  }[];
  highlightedSections?: {
    title: string;
    terms: {
      type: string;
      text: string;
      pointedList?: string[];
    }[];
  }[]
}

export const TERMS_NAVIGATION_LINKS = [
  {
    text: 'Terms of Use',
    link: '/terms/terms-of-use'
  },
  {
    text: 'Privacy Policy',
    link: '/terms/privacy-policy'
  },
  {
    text: 'Honor Code',
    link: '/terms/honor-code'
  },
]

interface Props {
  terms: ITerms;
  type: 'POINTS' | 'HIGHLIGHTED';
}

export default function Terms({ terms, type }: Props) {
  const location = useLocation();
  return (
    <div className='mt-10 sm:mt-14 flex flex-col items-center text-[#070707]'>
      <div className='container flex flex-col items-center max-w-[70rem] w-[85%] sm:w-[70%] pb-10'>
        <div className='bg-[#afafb0] w-fit rounded-[18px] flex justify-center items-center gap-y-1 gap-x-9 py-1.5 px-5 mb-12 flex-wrap'>
          {TERMS_NAVIGATION_LINKS?.map(term =>
            <Link
              key={term.text}
              to={term.link}
              prefetch='intent'
              className={`text-[#d7d8da] hover:text-[#f9fafc] ${location?.pathname === term.link ? 'text-[#f9fafc] font-medium' : ''}`}
            >{term.text}</Link>
          )}
        </div>
        <section className='flex flex-col items-center text-lg md:text-xl leading-7 md:leading-[2.2rem] mb-20'>
          <h1 className='text-2xl md:text-3xl'>{terms.title}</h1>
          <p className='font-semibold sm:text-2xl mt-2' dangerouslySetInnerHTML={{ __html: terms.description }} />
        </section>
        <p className={`text-[#667a87] w-full mb-4 ${type === 'POINTS' ? 'sm:ml-8' : ''}`}>{terms.lastUpdated}</p>
        <section className='relative flex flex-col w-full'>
          {type === 'POINTS'
            ? (
              <>
                <ScrollIndicator />
                <TermsRenderer sections={terms.sections} />
              </>
            )
            : <TermsHighlightedRenderer sections={terms.highlightedSections} />
          }
        </section>
      </div>
    </div>
  )
}

function ScrollIndicator() {
  const [percentage, setPercentage] = useState(0);
  const refLastScroll = useRef(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.screen.width <= 640) return;

    const onScroll = () => {
      if (!ref.current) return;
      const refOffsetTop = ref.current.offsetTop;
      let scrollTop = window.scrollY < refOffsetTop ? 0 : window.scrollY;
      let docHeight = document.body.offsetHeight;
      let winHeight = window.innerHeight;
      let scrollPercent = scrollTop / (docHeight - winHeight);
      if (scrollPercent <= 0.9 && scrollTop <= refLastScroll.current + 10) return;
      refLastScroll.current = scrollTop;
      let scrollPercentRounded = Math.round(scrollPercent * 100);
      setPercentage(scrollPercentRounded);
    }

    addEventListener("scroll", onScroll);

    return () => {
      removeEventListener("scroll", onScroll);
    }
  }, []);

  return (
    <>
      <div ref={ref} className={`hidden sm:flex absolute -mt-1 rounded-full w-5 left-0 bg-black z-10 transition-[height] ease-out duration-700`} style={{ height: `${percentage}%` }} />
      <div ref={ref} className={`hidden sm:flex absolute -mt-1 bg-[#d7d8da] rounded-full h-full w-5 left-0 z-[1]`} />
    </>
  )
}

function TermsHighlightedRenderer({ sections }: { sections: ITerms["highlightedSections"]; }) {
  return (
    sections?.length ? sections?.map((section) => (
      <section key={section?.title} className='flex w-full gap-3'>
        <div className='flex-1 mb-6 -mt-3'>
          <h2 className='text-2xl font-bold mb-5'>{section.title}</h2>
          {section.terms?.map(term =>
            term?.type === 'NORMAL'
              ? <p key={term?.text} className='mb-5' dangerouslySetInnerHTML={{ __html: term.text }} />
              : term?.pointedList
                ? (
                  <div key={term?.text} className='mb-5 bg-[#f2f4f5] p-9 rounded-2xl'>
                    <ul className='list-disc'>
                      {term?.pointedList?.map(text => <li key={text} dangerouslySetInnerHTML={{ __html: text }} />)}
                    </ul>
                  </div>
                ) : (
                  <div key={term?.text} className='mb-5 bg-[#f2f4f5] p-9 rounded-2xl'>
                    <p dangerouslySetInnerHTML={{ __html: term.text }} />
                  </div>
                )
          )}
        </div>
      </section>
    )) : null
  )
}

function TermsRenderer({ sections }: { sections: ITerms["sections"]; }) {
  return (
    sections?.length ? sections?.map((section) => (
      <section key={section?.title} className='flex w-full gap-3'>
        <div className='hidden sm:flex flex-col items-center -mt-1 z-20 '>
          <div className='w-5 h-5 overflow-y-hidden flex-shrink-0'>
            <div className='w-5 h-5 bg-transparent terms-line-circle rounded-full flex-shrink-0' />
          </div>
          <div className='w-5 h-[calc(100%-22px)] overflow-y-hidden flex items-center justify-center'>
            <div className='w-1.5 bg-transparent terms-line h-full rounded-b-full' />
          </div>
        </div>
        <div className='flex-1 mb-6 -mt-3'>
          <h2 className='text-2xl font-bold mb-5'>{section.title}</h2>
          {section.terms?.map(term => {
            const isNumbered = term?.[0] && !isNaN(Number(term?.[0]));
            return <p key={term} className={`mb-5 ${isNumbered ? '-indent-6 ml-6' : ''}`} dangerouslySetInnerHTML={{ __html: term }} />
          })}
        </div>
      </section>
    )) : null
  )
}