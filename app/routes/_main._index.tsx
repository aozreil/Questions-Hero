import { MetaFunction } from "@remix-run/node";
import { getSeoMeta } from "~/utils/seo";
import Footer from "~/components/UI/Footer";

const HOW_SECTIONS = [
  {
    imgSrc: "/assets/images/you-how.png",
    title: "YOU",
    desc: "Ask inquire about any subject within your academic realm, our platform is here to assist you in obtaining the information you seek.",
  },
  {
    imgSrc: "/assets/images/they-how.png",
    title: "THEY",
    desc: "Answer your question, since it contribute to a dynamic community of learners, fostering a collaborative environment where knowledge is shared and verified answers are readily available.",
  },
  {
    imgSrc: "/assets/images/we-how.png",
    title: "WE",
    desc: "Diligently verify all questions through our expert team, enhancing the reliability and credibility of the shared knowledge in our community.",
  },
];

export const meta: MetaFunction = () => {
  return [
    ...getSeoMeta({

    }),
  ];
};

export default function Index() {
  return (
    <>
      <div className="container py-16 md:py-20">
        <section className="px-4 flex flex-col items-center text-[#070707]">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-medium py-5 text-center">
            A simple path to feeling better today.
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold">How it Works</h2>
          <div className="grid grid-cols-1 xl:grid-cols-3 mt-20 gap-12 justify-center">
            {HOW_SECTIONS.map((section) => (
              <div
                key={section.title}
                className="flex flex-col items-center group"
              >
                <div className="relative flex justify-center items-end w-[380px] h-[160px] border-b-[3px] border-[#d8d8d8] mb-6">
                  <div className="absolute w-[287px] h-[144px] bg-[#f3f4f4] rounded-t-full transition" />
                  <img
                    src={section.imgSrc}
                    alt="they-how"
                    className="absolute h-[144px] group-hover:h-[160px] flex-shrink-0 bottom-0 transition"
                  />
                </div>
                <h3 className="w-[305px] text-4xl md:text-6xl font-semibold group-hover:font-bold mb-[9px] transition">
                  {section.title}
                </h3>
                <p className="w-[305px] text-sm">{section.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
