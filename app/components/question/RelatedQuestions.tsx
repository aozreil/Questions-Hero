const RELATED = [
    'Select the correct definition for each of the following',
    'The body system that controls breathing is considered',
    'The endocrine gland located at the base of the human',
    'The bones in the region of the hip are considered to be',
    'The nervous tissue that is surrounded by that something',
    'The plane that divides the body into parts are called',
    'The voice box is the',
]

export default function RelatedQuestions() {
    return (
        <div className='w-full mt-4 p-3 pt-[20px] border border-[#e0e0e0] rounded-lg flex flex-col bg-white'>
            <h2 className='text-[#002237] text-[21px] font-semibold mb-3'>Related Questions</h2>
            <div className='flex flex-col [&>*:last-child]:border-0'>
                {RELATED.map(related => (
                    <div className='flex justify-between items-center text-[#4d6473] text-sm py-2 border-b border-[#e0e0e0]'>
                        <p className='truncate pr-2'>{related}</p>
                        <img src='/assets/images/related-arrow.svg' alt='arrow' className='h-3 flex-shrink-0' />
                    </div>
                ))}
            </div>
        </div>
    )
}