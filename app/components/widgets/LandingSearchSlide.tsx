import BackgroundEffect from "~/components/UI/BackgroundEffect";
import ExpandableSearch from "~/components/UI/ExpandableSearch";
import { useTranslation } from "react-i18next";
import { SUBJECTS_MAPPER } from "~/models/subjectsMapper";
import { Link } from "@remix-run/react";

export default function LandingSearchSlide() {
  const { t } = useTranslation();
  return (
    <section className="w-full flex flex-col items-center max-sm:mt-16 text-[#070707] text-center">
      <h1 className="max-sm:font-bold text-2xl sm:text-3xl lg:text-4xl font-medium">
        Ask Your Questions,<br className='md:hidden' /> Achieve Academic Excellence
      </h1>
      <p className="text-xl w-[80%] lg:w-[50%] mt-5 font-medium z-20">
        Access millions of step-by-step solutions and connect with a community of experts to excel in your studies!
      </p>
      <BackgroundEffect>
        <ExpandableSearch />
      </BackgroundEffect>
      <div className={"container grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-9 gap-4 w-[90%] md:w-[50rem] max-w-[50rem] z-30"}>
        <SubjectLink slug={""} label={"All Subjects"} icon={'/assets/images/topics/all-topics.svg'} />
        {Object.entries(SUBJECTS_MAPPER).map(([id, { label, slug, shortTitle }]) => {
          return <SubjectLink key={slug} slug={slug} label={shortTitle ?? label} icon={`/assets/images/topics/${id}.svg`} />;
        })}
      </div>
    </section>
  );
}

function SubjectLink({ slug, label, icon }: { slug: string, label: string, icon?: string }) {
  return <Link to={`/subjects/${slug}`}
               className={"flex justify-center flex-col group items-center space-y-2 text-gray-500 font-semibold hover:bg-gray-200 rounded p-2"}>
    <img src={icon} alt={label} width={24} height={24} className={"w-7 lg:w-6 h-7 lg:h-6 group-hover:scale-105 "} />
    <div className={"line-clamp-2 text-sm lg:text-xs h-10 group-hover:text-black"}>
      <p> {label}</p>
    </div>
  </Link>;

}
