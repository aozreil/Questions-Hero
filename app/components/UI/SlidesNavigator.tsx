interface Props {
  setCurrentSlide: (slideNumber: number) => void;
  currentSlide: number;
  numberOfSlides: number;
}

export default function SlidesNavigator({ currentSlide, numberOfSlides, setCurrentSlide }: Props) {
  return (
    <div className='flex items-center space-x-3 sm:space-x-1.5 bg-[#afafb0] px-3 py-2.5 sm:p-2.5 rounded-full'>
      {Array(numberOfSlides).fill('').map((slide, index) => (
        <div
          key={index}
          className={`${index === currentSlide ? 'bg-[#f9fafc]' : 'bg-[#d7d9da]'} w-4 sm:w-2.5 h-4 sm:h-2.5 rounded-full cursor-pointer`}
          onClick={() => setCurrentSlide && setCurrentSlide(index)}
        />
      ))}
    </div>
  )
}