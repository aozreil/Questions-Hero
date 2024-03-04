import ExpandableSearch from "~/components/UI/ExpandableSearch";


export default function Landing() {
  return (
    <section className='w-full flex flex-col items-center mt-[147px] text-[#070707] text-center'>
      <h4 className='text-xl sm:text-3xl lg:text-4xl font-medium'>Unlocking Knowledge, Guiding Futures:</h4>
      <div className='w-full h-20 sm:h-[13vw] lg:-mt-10 relative flex items-center justify-center'>
        <div className='absolute left-0 h-full top-0 w-full z-10'>
          <img src='/assets/images/near-original.png' className='bg-effect w-full object-fill' />
        </div>
        <h3 className='text-2xl max-xs:-mt-2 sm:text-4xl lg:text-5xl font-bold z-20'>Your Ultimate University Resource Hub!</h3>
      </div>
      <ExpandableSearch />
    </section>
  )
}