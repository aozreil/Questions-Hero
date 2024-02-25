import ExpandableSearch from "~/components/UI/ExpandableSearch";


export default function SearchPage() {
    return (
        <section className='w-full flex flex-col items-center mt-[147px] text-[#070707] text-center'>
            <h4 className='text-[38px] font-medium'>Unlocking Knowledge, Guiding Futures:</h4>
            <h3 className='text-[56px] font-bold'>Your Ultimate University Resource Hub!</h3>
            <div className='relative mt-[50px] w-full flex items-center justify-center min-h-[90px]'>
                <ExpandableSearch />
                <div className='radial w-full h-[90px] absolute top-0 right-0 z-1' />
            </div>
        </section>
    )
}