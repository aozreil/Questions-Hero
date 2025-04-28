import Question from "~/components/question/Question";
import {
    Link,
    useLoaderData,
    useLocation,
    useNavigate,
    useNavigation
} from "@remix-run/react";
import {LoaderFunctionArgs} from "@remix-run/router";
import {json, LinksFunction, MetaFunction} from "@remix-run/node";
import {useCallback, useEffect, useRef, useState} from "react";
import {getSubjectById, getSubjectIdBySlug, getSubjectSlugById, SUBJECTS_MAPPER} from "~/models/subjectsMapper";
import clsx from "clsx";
import {
    AnswerStatus,
    IQuestion,
    ISubjectFilter,
    IUsers,
} from "~/models/questionModel";
import {
    getQuestionsListById, getRelatedChapters, getSearchValue
} from "~/apis/questionsAPI";
import {getSeoMeta} from "~/utils/seo";
import {BASE_URL} from "~/config/enviromenet";
import {getKatexLink} from "~/utils/external-links";

export const meta: MetaFunction<typeof loader> = ({data, location}) => {
    if (!data) {
        return [];
    }

    const {term, questions} = data as LoaderData;
    const canonical = `${BASE_URL}${location?.pathname}/`;
    const getPageTitle = () => {
        const defaultTitle = 'Search Page';
        if (term) {
            return `Search | ${term}`;
        }

        return defaultTitle;
    }


    return [
        ...getSeoMeta({
            title: getPageTitle(),
            canonical
        }),
    ];
}

export const links: LinksFunction = () => {
    return [
        ...getKatexLink()
    ];
};

interface QuestionsInfoMapper {
    [key: string]: { answers_count: number, answers_statuses: AnswerStatus[] }
};

interface LoaderData {
    questions?: IQuestion[];
    term?: string;
}

export async function loader({params, request}: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const term = url.searchParams.get("term") ?? ''; // Get 'term' from query string
    try {
        const questions = await getSearchValue(term.trim());
        return json({
            questions: questions,
            term
        });
    } catch (e) {
        console.log(e);
    }

    return json({});
}

export default function _mainSubjectsSubject() {
    const {
        questions,
    } = useLoaderData() as LoaderData;
    const [questionsFilterExpanded, setQuestionsFilterExpanded] = useState(true);
    const [filtersModalVisible, setFiltersModalVisible] = useState(false);
    const [filtersCount, setFiltersCount] = useState(0);
    const isFirstLoad = useRef(true);
    const containerDiv = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigation = useNavigation();
    const navigate = useNavigate();
    const isLoadingData = navigation.state === 'loading' && navigation.location?.pathname?.includes('subjects');

    useEffect(() => {
        if (containerDiv.current) {
            containerDiv.current.scrollTo({
                top: 0,
            });
        }
    }, [location]);


    useEffect(() => {
        const statusesFilter = getStorageArr('question_status');
        const typesFilter = getStorageArr('question_types');
        setFiltersCount(statusesFilter.length + typesFilter.length);
    }, [questions]);

    const clearFilters = useCallback(() => {
        sessionStorage.setItem('question_status', JSON.stringify([]));
        sessionStorage.setItem('question_types', JSON.stringify([]));
        navigate(".", {
            replace: true,
            relative: "path",
        });
    }, []);

    return (
        <div ref={containerDiv}
             className='flex-1 search-page-scroll overflow-scroll w-full h-[calc(100vh-80px)] pb-5 bg-[#f5f6f8]'>
            <div className='flex flex-col items-center'>
                <div className='w-[95vw] sm:w-[70vw] max-w-[70rem] flex flex-col items-center mt-3'>

                    <div className='w-full flex max-md:flex-col'>
                        <div className='md:hidden flex items-center space-x-4 mb-4'>
                            <button
                                onClick={() => setFiltersModalVisible(true)}
                                className='border border-black rounded-md px-4 py-2 flex items-center space-x-1.5'
                            >
                                <img src='/assets/images/filters.svg' alt='filters' className='w-4 h-4 rotate-90'/>
                                <span className='font-semibold'>Filters</span>
                                {!!filtersCount && (
                                    <span
                                        className='text-white rounded-full bg-black flex-shrink-0 w-5 h-5 flex items-center justify-center'>
                    {filtersCount}
                    </span>
                                )}
                            </button>
                            {!!filtersCount && (
                                <button className='text-[#2563eb] font-semibold' onClick={clearFilters}>
                                    Reset
                                </button>
                            )}
                        </div>
                        <div className='flex flex-col space-y-4 w-full flex-1 overflow-x-hidden'>
                            {questions?.length === 0 && !isLoadingData && (
                                <div className='w-full flex items-center justify-center'>
                                    <div
                                        className="shadow bg-white mt-4 p-16 text-center w-[95%] sm:w-[34rem] h-fit flex items-center flex-col rounded-md">
                                        <h2 className="text-xl font-bold mb-3">
                                            No matching results
                                        </h2>
                                    </div>
                                </div>
                            )}

                            <div className={"flex flex-col gap-4"}>
                                {!isLoadingData ?
                                    questions?.map(question => (
                                        <Link key={question?.id} to={`/chapter/${question.chapter_id}?question_id=${question.id}`} >
                                            <Question
                                                questionBody={question?.rendered_text ?? question?.text}
                                                createdAt={question?.created_at}
                                                slug={question?.slug}
                                            />
                                        </Link>
                                    )) : <ContentLoaderContainer/>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ContentLoaderContainer = () => (
    <>
        <QuestionsContentLoader/>
        <QuestionsContentLoader/>
        <QuestionsContentLoader/>
    </>
)

const QuestionsContentLoader = () => (
    <div className='flex flex-col w-full h-fit rounded-lg p-3.5 shadow-md bg-white'>
        <div className='flex space-x-3'>
            {/*<ContentLoader tailwindStyles='h-11 w-11 rounded-full' />*/}
            <div className='flex flex-col items-start text-sm text-black'>
                {/*<ContentLoader tailwindStyles='w-20 h-5 mb-1 rounded-md' />*/}
                {/*<ContentLoader tailwindStyles='w-5 h-5 rounded-md' />*/}
            </div>
        </div>
        <hr className='my-2.5'/>
        {/*<ContentLoader tailwindStyles='w-full h-16 rounded-md' />*/}
    </div>
)

const getStorageArr = (key: string): string[] => {
    let data = sessionStorage.getItem(key);
    if (data) {
        return JSON.parse(data);
    }

    return [];
}

