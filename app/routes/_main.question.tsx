import Header from "~/components/UI/Header";

const RELATED = [
    'Select the correct definition for each of the following',
    'The body system that controls breathing is considered',
    'The endocrine gland located at the base of the human',
    'The bones in the region of the hip are considered to be',
    'The nervous tissue that is surrounded by that something',
    'The plane that divides the body into parts are called',
    'The voice box is the',
]

export default function QuestionPage() {
    return (
        <div className='w-screen h-screen bg-[#f7f8fa] overflow-x-hidden'>
            <Header className='bg-white  border-b-[3px] border-[#ebf2f6]' />
            <div className='w-full h-fit flex flex-col items-center py-4 px-4'>
                <div className='max-lg:max-w-[540px] flex-shrink lg:w-fit'>
                    <p className='w-fit text-[#002237] text-sm pl-4 pb-[14px]'>
                        Computing
                        <span className='mx-2'>|</span>
                        Viewed
                        <span className='ml-1 font-bold'>7,889</span>
                    </p>
                    <div className='flex flex-col lg:flex-row justify-center gap-4'>
                        <div className='max-w-[540px] lg:w-[540px] flex flex-col'>
                            <div className='flex flex-col items-center w-full border border-[#00000038] rounded-lg p-4 bg-white'>
                                <div className='w-full flex flex-wrap justify-between items-center mb-3'>
                                    <p className='text-[#667a87] text-[13px]'>Asked by <span className='font-bold'>Mhamad Jarrar on 13 Aug 2023</span></p>
                                    <div className='flex items-center gap-[6px] text-[#25b680] text-[15px] font-bold'>
                                        <img src='/assets/images/verified.svg' alt='verifed' />
                                        <p>Verified Answer</p>
                                    </div>
                                </div>
                                <p className='lg:text-[19px] font-semibold mb-3'>
                                    While working in a community mental health treatment center, a nurse overhears one of the
                                    receptionists saying that one of the clients is "really psycho." Later in the day,
                                    the nurse talks with the receptionist about the comment. This action by the nurse demonstrates
                                    an attempt to address which issue?
                                </p>
                                <img src='/assets/images/question-image.png' alt='question-image' />
                                <div className='w-full lg:w-[538px] my-[22px] h-2 border-t-[3px] border-[#ebf2f6]' />
                                <div className='w-full flex flex-col'>
                                    <div className='w-full flex justify-between items-center'>
                                        <h3 className='text-[17px] font-medium mb-1'>Definitions</h3>
                                        <img src='/assets/images/drop-down.svg' alt='arrow-down' className='h-[14px] rotate-90' />
                                    </div>
                                    <div className='text-[13px] mt-4'>
                                        <p className='mb-1 font-extrabold'>Nurse overhears</p>
                                        <p className='text-[#4d6473]'>typically refers to a situation where a nurse unintentionally listens to or becomes
                                            aware of a conversation or information without actively seeking it out.
                                            This could happen if the nurse is nearby</p>
                                    </div>
                                    <div className='text-[13px] mt-4'>
                                        <p className='mb-1 font-extrabold'>Really psycho</p>
                                        <p className='text-[#4d6473]'>is typically used colloquially to describe someone or
                                            something as extremely mentally unstable, erratic, or exhibiting behavior that is
                                            perceived as crazy or irrational. It is often used in informal conversation to
                                            convey a strong negative impression of someone's behavior or actions.</p>
                                    </div>
                                    <div className='text-[13px] mt-4'>
                                        <p className='mb-1 font-extrabold'>Receptionist</p>
                                        <p className='text-[#4d6473]'>is an administrative professional responsible for managing
                                            the front desk area of an organization or business.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='w-full lg:w-[317px]'>
                            <div className='w-full bg-[#eaf1fa] text-sm font-medium text-[#344f60] p-3 border border-[#e0e0e0] rounded-lg flex flex-col items-center'>
                                <img src='/assets/images/objectives.svg' alt='objectives' className='w-[71px] mb-[26px]' />
                                <h2 className='text-[#002237] text-[21px] font-semibold mb-[9px]'>Learning Objectives</h2>
                                <p>While working in a community mental health treatment center, a nurse overhears one of the
                                    receptionists saying that one of the clients is "really psycho." Later in the day, the
                                    nurse talks with the receptionist about the comment.</p>
                                <p className='mt-3 mb-5'>This action by the nurse demonstrates an attempt to address which issue?</p>
                                <div className='w-full mb-[10px]  border-t-[1px] border-[#bedcff]' />
                                <div className='w-full py-3 bg-white text-[13px] text-[#070707] rounded-xl border border-[#e0e0e0] flex items-center justify-center'>
                                    Read More
                                </div>
                            </div>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}