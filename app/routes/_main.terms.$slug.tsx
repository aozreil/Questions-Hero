import TermsRenderer from "~/components/UI/TermsRenderer";
import { LoaderFunctionArgs, redirect, useLoaderData } from "react-router";
import { json, MetaFunction } from "@remix-run/node";
import TermsOfUse from './terms/terms-of-use.server.json';
import PrivacyPolicy from './terms/privacy-policy.server.json';
import CopyrightPolicy from './terms/copyright-policy.server.json';
import HonorCode from './terms/honor-code.server.json';
import { Link, useLocation } from "@remix-run/react";
import invariant from "tiny-invariant";
import TermsHighlightedRenderer from "~/components/UI/TermsHighlightedRenderer";
import { getSeoMeta } from "~/utils/seo";
import { BASE_URL } from "~/config/enviroment.server";

export const meta: MetaFunction = ({ data }) => {
  const { terms, canonical } = data as LoaderData;
  return [
    ...getSeoMeta({
      title: terms?.title,
      description: terms?.pageDescription,
      canonical,
    }),
  ]
}

export interface ITerms {
  title: string;
  description: string;
  pageDescription: string;
  lastUpdated: string;
  sections?: {
    title: string;
    terms: string[];
    highlightedTerms: {
      type: string;
      text: string;
    }[];
  }[];
  highlightedSections?: {
    title: string;
    terms: {
      type: string;
      text: string;
    }[];
  }[]
}

interface LoaderData {
  terms: ITerms;
  type: 'POINTS' | 'HIGHLIGHTED';
  canonical: string;
}

const TERMS: { [key: string]: any } = {
  'terms-of-use': TermsOfUse,
  'privacy-policy': PrivacyPolicy,
  'copyright-policy': CopyrightPolicy,
  'honor-code': HonorCode,
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
    text: 'Copyright Policy',
    link: '/terms/copyright-policy'
  },
  {
    text: 'Honor Code',
    link: '/terms/honor-code'
  },
]

const HIGHLIGHTED_TERMS = ['copyright-policy', 'honor-code'];

export async function loader ({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  invariant(slug, 'You should provide slug');
  const terms = slug && TERMS.hasOwnProperty(slug) ? TERMS[slug] : undefined;
  if (!terms) return redirect('/');
  return json<LoaderData>({
    terms,
    type: HIGHLIGHTED_TERMS.includes(slug) ? 'HIGHLIGHTED' : 'POINTS',
    canonical: `${BASE_URL}/terms/${slug}`,
  })
}

export default function TermsPage() {
  const { terms, type } = useLoaderData() as LoaderData;
  const location = useLocation();
  return (
    <div className='mt-20 sm:mt-28 flex flex-col items-center text-[#070707]'>
      <div className='container flex flex-col items-center max-w-[90rem] w-[85%] pb-10'>
        <div className='bg-[#afafb0] w-fit rounded-[18px] flex justify-center items-center gap-y-1 gap-x-9 py-1.5 px-5 mb-12 flex-wrap'>
          {TERMS_NAVIGATION_LINKS?.map(term =>
            <Link
              key={term.text}
              to={term.link}
              className={`text-[#d7d8da] hover:text-[#f9fafc] ${location?.pathname === term.link ? 'text-[#f9fafc] font-medium' : ''}`}
            >{term.text}</Link>
          )}
        </div>
        <section className='flex flex-col items-center text-xl md:text-3xl leading-7 md:leading-[3.2rem] mb-20'>
          <h1>{terms.title}</h1>
          <p className='font-bold' dangerouslySetInnerHTML={{ __html: terms.description }} />
        </section>
        <p className={`text-[#667a87] w-full mb-4 ${type === 'POINTS' ? 'sm:ml-8' : ''}`}>{terms.lastUpdated}</p>
        {type === 'POINTS'
          ? <TermsRenderer sections={terms.sections} />
          : <TermsHighlightedRenderer sections={terms.highlightedSections} />
        }
      </div>
    </div>
  )
}