import { MetaFunction } from "@remix-run/node";
import { getSeoMeta } from "~/utils/seo";
import Footer from "~/components/UI/Footer";
import {useEffect} from "react";
import { BASE_URL } from "~/config/enviromenet";
import {useNavigate} from "@remix-run/react";

export const meta: MetaFunction = () => ([
  ...getSeoMeta({
    canonical: `${BASE_URL}/`,
  }),
]);

export default function Index() {

    // const navigate = useNavigate();
    // useEffect(( ) => {
    //     navigate("/question/maintains-that-a-client-s-problems-develop-in-the-context-of-family-are-sustained-by-family-interactions-and-that-any-change-made-by-the-client-will-affect-all-the-family-members-a-salvado-01HQR347SGT0M302AGRDDST58T")
    // },[])

  return (
    <div className='flex-1 flex flex-col relative'>
      <div className={`flex-1 flex items-start sm:pt-[5vh] 2xl:pt-[10vh] overflow-y-auto max-xl:pb-10`}>
      </div>
      <div className='sticky w-full bottom-0 z-40 bg-[#f7f8fa] h-fit flex flex-col items-center'>
        <Footer/>
      </div>
    </div>
  );
}
