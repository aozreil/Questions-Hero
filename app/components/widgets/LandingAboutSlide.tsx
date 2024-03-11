
const HOW_SECTIONS = [
  {
    imgSrc: "/assets/images/you-how.png",
    title: "YOU",
    desc: "Ask any question related to your academic subjects, and our platform is here to support you in finding the information you're looking for!",
  },
  {
    imgSrc: "/assets/images/they-how.png",
    title: "THEY",
    desc: "Jump in and provide answers to your questions, as they help build a lively community of learners, creating a collaborative space.",
  },
  {
    imgSrc: "/assets/images/we-how.png",
    title: "WE",
    desc: "Work diligently to verify all questions with the help of our expert team, ensuring that the knowledge shared within our community is reliable and trustworthy.",
  },
];

export default function LandingAboutSlide() {
  return (
    <div className="container max-sm:py-16">
      <section className="px-4 flex flex-col items-center text-[#070707]">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-medium py-3 text-center">
          A simple path to feeling better today.
        </h1>
        <h2 className="text-4xl md:text-6xl font-bold">How it Works</h2>
        <div className="grid grid-cols-1 xl:grid-cols-3 mt-10 gap-12 justify-center">
          {HOW_SECTIONS.map((section) => (
            <div
              key={section.title}
              className="flex flex-col items-center"
            >
              <div className="relative flex justify-center group peer items-end w-[95%] xs:w-96 h-40 border-b-[3px] border-[#d8d8d8] mb-6">
                <div className="absolute w-[80%] xs:w-72 h-36 bg-[#f3f4f4] rounded-t-full transition" />
                <img
                  src={section.imgSrc}
                  alt="they-how"
                  className="absolute h-36 group-hover:h-40 flex-shrink-0 bottom-0 transition"
                />
              </div>
              <div className='peer-hover:[&>h3]:font-bold w-[76%] xs:w-72'>
                <h3 className="text-4xl md:text-6xl font-semibold mb-2 transition">
                  {section.title}
                </h3>
                <p className="text-[13px]">{section.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}