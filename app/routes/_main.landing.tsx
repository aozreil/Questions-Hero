import ExpandableSearch from "~/components/UI/ExpandableSearch";
import BackgroundEffect from "~/components/UI/BackgroundEffect";

const SLIDER_DATA = ['Business', 'Medicine', 'Biology', 'Computing'];
const SLIDER_CONTENT = [...SLIDER_DATA, ...SLIDER_DATA, ...SLIDER_DATA, ...SLIDER_DATA];

export default function Landing() {
  return (
    <section className='w-full flex flex-col items-center max-sm:space-y-4 mt-16 sm:mt-36 text-[#070707] text-center'>
      <h4 className='max-sm:font-bold text-2xl sm:text-3xl lg:text-4xl font-medium'>Unlocking Knowledge, Guiding Futures:</h4>
      <h3 className='text-[2.6rem] mt-5 lg:text-5xl font-bold z-20'>
        Your Ultimate University<br className='md:hidden' /> Resource Hub!
      </h3>
      <BackgroundEffect>
        <ExpandableSearch />
      </BackgroundEffect>
      <div className='slider w-[90%] sm:w-[36rem] h-[26px] relative overflow-hidden'>
        <div className='slide-track'>
          {SLIDER_CONTENT?.map(value => (
            <div className='slide text-sm px-1 text-[#6e777f] bg-white border border-[#f1f1f1] rounded-md mx-2 flex items-center justify-center'>{value}</div>
          ))}
        </div>
      </div>
    </section>
  )
}