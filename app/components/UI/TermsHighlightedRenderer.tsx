import { ITerms } from "~/routes/_main.terms.$slug";

interface Props {
  sections: ITerms["highlightedSections"];
}

export default function TermsHighlightedRenderer({ sections }: Props) {
  return (
    sections?.length ? sections?.map((section) => (
      <section key={section?.title} className='flex w-full gap-3'>
        <div className='flex-1 mb-6 -mt-3'>
          <h2 className='text-2xl font-bold mb-5'>{section.title}</h2>
          {section.terms?.map(term =>
            term?.type === 'NORMAL'
              ? <p className='mb-5' dangerouslySetInnerHTML={{ __html: term.text }} />
              : <div className='mb-5 bg-[#f2f4f5] p-9 rounded-2xl'>
                <p dangerouslySetInnerHTML={{ __html: term.text }} />
              </div>
          )}
        </div>
      </section>
    )) : null
  )
}