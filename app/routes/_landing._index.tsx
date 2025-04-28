import {json, MetaFunction} from "@remix-run/node";
import {getSeoMeta} from "~/utils/seo";
import Footer from "~/components/UI/Footer";
import {BASE_URL} from "~/config/enviromenet";
import {Link, useLoaderData, useNavigate} from "@remix-run/react";
import {LoaderFunctionArgs} from "@remix-run/router";
import {getAllChapters} from "~/apis/questionsAPI";
import clsx from "clsx";

export const meta: MetaFunction = () => ([
    ...getSeoMeta({
        canonical: `${BASE_URL}/`,
    }),
]);

export async function loader({params, request}: LoaderFunctionArgs) {
    try {
        const chapters = await getAllChapters();
        return json({
            chapters,
        });
    } catch (e) {
        console.log(e);
    }

    return json({});
}

export default function Index() {
    const {
        chapters,
    } = useLoaderData();
    const navigate = useNavigate();

    const cleanTitle = (title: string) => {
        return title.replace(/^(Chapter\s*\d+\s*:\s*)/i, "").trim();
    }
    console.log("chapters ", chapters)
    return (
        <div className='flex-1 flex flex-col relative'>
            <div className={`flex-1 flex flex-col sm:pt-[5vh] 2xl:pt-[10vh] min-h-[calc(100vh-135px)] overflow-y-auto max-xl:pb-10`}>
                <h1 className={"text-center font-bold text-3xl"}>Ask Your Questions, Achieve Academic Excellence</h1>
                <h2 className={"text-center font-bold text-xl mt-3"}>Access millions of step-by-step solutions and connect
                    with a community of experts to excel in your studies!</h2>


                <div className={clsx('w-full h-[35vw] md:h-[17vw] -my-4 sm:-my-8 md:my-0 xl:-my-10 relative flex items-center justify-center')}>
                    <div className='absolute h-full left-0 top-0 w-full z-10'>
                        <img src='/assets/images/mobile-highlight.png' className='md:hidden bg-effect w-full object-fill' />
                        <img src='/assets/images/background-effect-thin.png' className='max-md:hidden bg-effect w-full object-fill' />
                    </div>
                    <form className={"relative z-50 w-1/2"} onSubmit={(event) => {
                        event.preventDefault();
                        const term = event.target?.input?.value;
                        navigate(`/search?term=${term}`)
                    }}>
                        <img src={"/assets/images/search-icon.svg"} className={"cursor-pointer absolute top-[14px] left-3 flex-shrink-0 w-5 h-5"} />
                        <input name="input" placeholder={"Search for Academic solutions "} className={"border bg-white border-black rounded-full w-full pl-9 py-3 placeholder:text-gray-500 placeholder:text-sm"}/>
                    </form>
                </div>

                <div className={"flex items-center justify-center flex-wrap mt-6"}>
                    {
                        chapters.map(chapter =>
                            <Link key={chapter.id} to={`/chapter/${chapter.id}`}>
                                <div className={"flex flex-col items-center justify-center"}>
                                    <img src={`/assets/images/topics/${chapter.id + 93}.svg`} width={30} height={30}
                                         alt={chapter.chapter_title + " image "}/>
                                    <p className={"text-sm font-semibold text-[#65788a]"}>{cleanTitle(chapter.chapter_title)}</p>
                                </div>
                            </Link>
                        )
                    }
                </div>
            </div>
            <div className='sticky w-full bottom-0 z-40 bg-[#f7f8fa] h-fit flex flex-col items-center'>
                <Footer/>
            </div>
        </div>
    );
}
