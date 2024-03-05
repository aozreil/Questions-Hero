import ExpandableSearch from "~/components/UI/ExpandableSearch";
import BackgroundEffect from "~/components/UI/BackgroundEffect";

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
    </section>
  )
}