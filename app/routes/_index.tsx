import Header from "~/components/UI/Header";

const HOW_SECTIONS = [
    {
        imgSrc: '/assets/images/you-how.png',
        title: 'YOU',
        desc: 'Ask inquire about any subject within your academic realm, our platform is here to assist you in obtaining the information you seek.',
    },
    {
        imgSrc: '/assets/images/they-how.png',
        title: 'THEY',
        desc: 'Answer your question, since it contribute to a dynamic community of learners, fostering a collaborative environment where knowledge is shared and verified answers are readily available.',
    },
    {
        imgSrc: '/assets/images/we-how.png',
        title: 'WE',
        desc: 'Diligently verify all questions through our expert team, enhancing the reliability and credibility of the shared knowledge in our community.',
    }
]

export default function Index() {
  const currentYear = new Date().getFullYear();
  return (
    <div className='relative pb-[100px] w-screen min-h-screen bg-[#fbfbfc] overflow-x-hidden'>
        <Header />
        <section className='px-4 flex flex-col items-center my-[70px] md:my-[126px] text-[#070707]'>
            <h3 className='text-xl sm:text-2xl md:text-4xl font-medium py-5 text-center'>A simple path to feeling better today.</h3>
            <p className='text-4xl md:text-6xl font-bold'>How it Works</p>
            <div className='grid xl:grid-cols-3 mt-[88px] gap-[50px] justify-center'>
                {HOW_SECTIONS.map((section) => (
                    <div key={section.title} className='flex flex-col items-center'>
                        <div className='relative flex justify-center items-end w-[380px] h-[160px] border-b-[3px] border-[#d8d8d8] mb-6 overflow-y-hidden'>
                            <div className='absolute w-[287px] h-[144px] bg-[#f3f4f4] rounded-t-full' />
                            <img src={section.imgSrc} alt='they-how' className='absolute h-[180px] flex-shrink-0 -bottom-8' />
                        </div>
                        <p className='w-[305px] text-4xl md:text-6xl font-semibold mb-[9px]'>{section.title}</p>
                        <p className='w-[305px] text-sm'>{section.desc}</p>
                    </div>
                ))}
            </div>
        </section>
        <footer className='absolute bottom-0 w-full gap-2 sm:gap-0 text-xs sm:text-[15px] border-t-[2px] border-[#ebf2f6] px-4 md:px-[55px] py-[27px] text-[#6e777f] flex justify-center sm:justify-between items-center flex-wrap'>
            <p>All copyrights are reserved to <span className='font-bold'>{`QUETIONS ® ${currentYear}`}</span></p>
            <div className='flex gap-[30px]'>
                <p>Help</p>
                <p>Privacy</p>
                <p>Terms</p>
                <p>About</p>
            </div>
        </footer>
    </div>
  );
}
