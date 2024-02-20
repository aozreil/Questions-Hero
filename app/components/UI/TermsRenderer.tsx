import { ITerms } from "~/routes/_main.terms.$slug";

interface Props {
  sections: ITerms["sections"];
}

export default function TermsRenderer({ sections }: Props) {
  return (
    sections?.length ? sections?.map((section) => (
        <section key={section?.title} className='flex w-full gap-3'>
          <div className='hidden sm:flex flex-col items-center -mt-1'>
            <div className='w-5 h-5 bg-black rounded-full flex-shrink-0' />
            <div className='w-1.5 bg-black h-full rounded-b-full' />
          </div>
          <div className='flex-1 mb-6 -mt-3'>
            <h2 className='text-2xl font-bold mb-5'>{section.title}</h2>
            {section.terms?.map(term => <p className='mb-5 -indent-6 ml-6' dangerouslySetInnerHTML={{ __html: term }} />)}
          </div>
        </section>
    )) : null
  )
}