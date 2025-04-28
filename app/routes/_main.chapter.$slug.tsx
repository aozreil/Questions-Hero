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
    getQuestionsListById, getRelatedChapters
} from "~/apis/questionsAPI";
import {getSeoMeta} from "~/utils/seo";
import {BASE_URL} from "~/config/enviromenet";
import {getKatexLink} from "~/utils/external-links";

export const meta: MetaFunction<typeof loader> = ({data, location}) => {
    if (!data) {
        return [];
    }

    const {page, size, count, mainSubjectId} = data as LoaderData;
    const canonical = `${BASE_URL}${location?.pathname}/`;

    const getPageTitle = () => {
        const defaultTitle = 'Chapter Page';
        const postTitle = data?.["chapter"].post_title;
        if (postTitle) {
            return `chapter | ${postTitle}`;
        }

        return defaultTitle;
    }

    const description = data?.["chapter"].short_description ?? "";
    const chapter = data?.["chapter"]
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Quiz",
        "name": chapter?.post_title,
        "about": {
            "@type": "Thing",
            "name": chapter?.post_title,
        },
        "educationalAlignment": [
            {
                "@type": "AlignmentObject",
                "alignmentType": "educationalSubject",
                "targetName": chapter?.subject_name ?? "", // You may need to adjust based on your chapter data
            }
        ],
        "provider": {
            "@type": "Organization",
            "name": "prepida",
            "url": "https://prepida.com"
        },
        "hasPart": data?.["questions"]?.map((q) => ({
            "@type": "Question",
            "eduQuestionType": "Flashcard",
            "text": q?.rendered_text ?? q?.text ?? '',
            "acceptedAnswer": {
                "@type": "Answer",
                "text": q?.correct_answer ?? '',
            }
        })) || []
    };

    return [
        ...getSeoMeta({
            title: getPageTitle(),
            description,
            canonical
        }),
        {
            "script:ld+json":schemaData
        }
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
    subjects?: ISubjectFilter[];
    mainSubjectId?: string;
    questionsInfoMapper?: QuestionsInfoMapper;
    users?: IUsers[];
    page?: number,
    size?: number,
    count?: number,
}

export async function loader({params, request}: LoaderFunctionArgs) {
    const mainSubjectId = +params?.slug;
    try {
        const chapter = await getQuestionsListById(+(mainSubjectId ?? '0'));
        const relatedChapters = await getRelatedChapters(+(mainSubjectId ?? '0'));
        return json({
            questions: chapter?.["questions"],
            chapter,
            relatedChapters,
        });
    } catch (e) {
        console.log(e);
    }

    return json({});
}

const getFilteredSubjects = (subjects?: ISubjectFilter[], mainSubjectId?: string, selectedCount?: number) => {
    const isSelected = (id: number) => !!mainSubjectId && !!id && id === Number(mainSubjectId);
    const list = subjects
        ?.filter(subject => SUBJECTS_MAPPER.hasOwnProperty(subject?.id))
        ?.map(subject => ({
            label: subject?.title,
            value: subject?.id?.toString(),
            count: isSelected(subject?.id) && selectedCount !== undefined ? selectedCount : subject?.questions_count?.toString(),
            defaultChecked: isSelected(subject?.id),
        }))
    list && makeSelectedFirst(list);
    return list;
}

export default function _mainSubjectsSubject() {
    const {
        subjects,
        mainSubjectId,
        questions,
        chapter,
        relatedChapters,
        count,
        questionsInfoMapper,
    } = useLoaderData() as LoaderData;
    const [savedSubjects] = useState(subjects);
    const [filteredSubjects, setFilteredSubjects] = useState<IFilter[] | undefined>(
        () => getFilteredSubjects(subjects, mainSubjectId, count));
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
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            return;
        }

        const list = getFilteredSubjects(savedSubjects, mainSubjectId, count);
        setFilteredSubjects(list);
    }, [questions]);

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

    const selectedSubjectTitle = getSubjectById(Number(mainSubjectId))?.shortTitle
        ? getSubjectById(Number(mainSubjectId))?.shortTitle
        : getSubjectById(Number(mainSubjectId))?.label ?? '';

    return (
        <div ref={containerDiv}
             className='flex-1 search-page-scroll overflow-scroll h-full w-full max-h-[calc(100vh-67px)] pb-5 bg-[#f5f6f8]'>
            <div className='flex flex-col items-center'>
                <div className='w-[95vw] sm:w-[70vw] max-w-[70rem] flex flex-col items-center mt-3'>
                    <div className='relative w-full rounded-xl mb-3 py-5 px-8'>
                        <img src='/assets/images/subjects-header.png' alt='subjects-header'
                             className='absolute z-10 w-full h-full top-0 left-0'/>
                        <img src='/assets/images/subjects-header-icon.png' alt='subjects-header'
                             className='max-lg:hidden absolute z-10 h-[80%] top-0 bottom-0 my-auto right-12'/>
                        <div
                            className='relative flex flex-col max-sm:items-center max-sm:justify-center gap-y-3 h-full z-20'>
                            <h1 className='text-2xl sm:text-3xl text-white font-bold'>{chapter.post_title}</h1>
                        </div>
                    </div>
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
                        {/*<CustomModal open={filtersModalVisible} closeModal={() => setFiltersModalVisible(false)} className='justify-end bottom-0'>*/}
                        {/*    <div className='w-screen h-screen flex items-end'>*/}
                        {/*        <div className='w-screen h-[90vh] z-50 bg-white rounded-md px-5 py-6 flex flex-col overflow-y-auto thin-scrollbar'>*/}
                        {/*            <div className='w-full flex justify-between font-bold mb-4'>*/}
                        {/*                <button onClick={() => setFiltersModalVisible(false)}>*/}
                        {/*                    <CloseIcon colorfill='#000' className='w-5 h-5' />*/}
                        {/*                </button>*/}
                        {/*                <span className='text-2xl'>Questions filter</span>*/}
                        {/*                <button*/}
                        {/*                    onClick={() => setFiltersModalVisible(false)}*/}
                        {/*                    className='text-[#2563eb] text-xl'*/}
                        {/*                >*/}
                        {/*                    Apply*/}
                        {/*                </button>*/}
                        {/*            </div>*/}
                        {/*            <SubjectsSection subjects={filteredSubjects} />*/}
                        {/*            <hr className='my-5' />*/}
                        {/*            <FiltersSection title='Status' filters={STATUS_FILTERS} paramsId='question_status' />*/}
                        {/*            <hr className='my-5' />*/}
                        {/*            <FiltersSection title='Type' filters={TYPE_FILTERS} paramsId='question_types' />*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</CustomModal>*/}
                        {   relatedChapters?.length > 0  &&
                            <div
                                className='max-md:hidden md:w-[14rem] mr-4 mb-5 rounded-xl shadow-md p-2 text-black h-fit bg-white sticky top-8'>
                                <h2 className={"font-bold"}>Related Topics:</h2>
                                <div className={"flex flex-col items-start gap-3 mt-4"}>
                                    {
                                        relatedChapters.map(chapter => {
                                            return <Link to={`/chapter/${chapter.id}`}  key={chapter.id}>{chapter.chapter_title}</Link>
                                        })
                                    }
                                </div>
                            </div>
                        }
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
                            <img className={"rounded-2xl"} src={chapter.image_url} alt={chapter.image_title}  />
                            {Boolean(chapter.h2_title) && <h2 className={"text-center font-bold"}>{chapter.h2_title}</h2>}
                            { Boolean(chapter.short_description) &&
                                <div className={"border border-[#99a7af] rounded-lg p-3.5 bg-white shadow-md"}>
                                    {chapter.short_description}
                                </div>
                            }

                            <div className={"flex flex-col gap-4"}>
                                {!isLoadingData ?
                                    questions?.map(question => (
                                        <Question
                                            key={question?.id}
                                            questionBody={question?.rendered_text ?? question?.text}
                                            createdAt={question?.created_at}
                                            slug={question?.slug}
                                            correctAnswer={question.correct_answer}
                                            options={question.choices}
                                            topic={question.topic_name}
                                            answerCount={questionsInfoMapper?.hasOwnProperty(question?.id) ? questionsInfoMapper[question.id].answers_count : undefined}
                                            answerStatuses={questionsInfoMapper?.hasOwnProperty(question?.id) ? questionsInfoMapper[question.id].answers_statuses : undefined}
                                        />
                                    )) : <ContentLoaderContainer/>}
                            </div>
                            {/*{!isLoadingData*/}
                            {/*    && !!questions?.length*/}
                            {/*    && size !== undefined*/}
                            {/*    && count !== undefined*/}
                            {/*    && page !== undefined*/}
                            {/*    && (*/}
                            {/*        <Pagination*/}
                            {/*            page={page}*/}
                            {/*            size={size}*/}
                            {/*            total={count}*/}
                            {/*            previous={`${location.pathname}?page=${page - 1}`}*/}
                            {/*            next={`${location.pathname}?page=${page + 1}`}*/}
                            {/*        />*/}
                            {/*    )}*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface IFilter {
    label: string;
    value: string;
    count?: string | number;
    defaultChecked?: boolean
}

const FiltersSection = ({title, filters, showMoreOn, paramsId}: {
    title: string;
    filters: IFilter[];
    showMoreOn?: number;
    paramsId?: string;
}) => {
    const [showMore, setShowMore] = useState(false);
    const [cashedFilters, setCashedFilters] = useState<string[]>([]);
    const showMoreVisible = showMoreOn && !showMore;
    const navigate = useNavigate();

    useEffect(() => {
        if (!paramsId) return;
        const sessionFilter = getStorageArr(paramsId);
        if (sessionFilter?.length) {
            setCashedFilters(sessionFilter);
        }
    }, []);

    const handleChange = (value: string, isChecked: boolean) => {
        if (paramsId) {
            let currentState = getStorageArr(paramsId);

            let updatedState;
            if (isChecked) {
                updatedState = [...currentState, value];
            } else {
                updatedState = currentState?.filter(state => state !== value);
            }

            sessionStorage.setItem(paramsId, JSON.stringify(updatedState));
            navigate(".", {
                replace: true,
                relative: "path",
            });
        }
    }

    return (
        <section className='flex flex-col space-y-2 px-2'>
            <p>{title}</p>
            {/*{filters*/}
            {/*    ?.slice(0, showMoreVisible ? showMoreOn : filters?.length )*/}
            {/*    ?.map(*/}
            {/*        filter =>*/}
            {/*            // <CheckboxWithLabel*/}
            {/*            //     key={filter?.value}*/}
            {/*            //     id={filter?.value}*/}
            {/*            //     label={filter?.label}*/}
            {/*            //     value={filter?.value}*/}
            {/*            //     count={filter?.count}*/}
            {/*            //     defaultChecked={filter?.defaultChecked || cashedFilters?.includes(filter?.value)}*/}
            {/*            //     onChecked={handleChange}*/}
            {/*            // />*/}
            {/*    )*/}
            {/*}*/}
            {showMoreVisible && (
                <button
                    className='text-[#0059ff] text-sm font-medium w-fit ml-7 hover:bg-[#e1f2ff] rounded px-2 py-1'
                    onClick={() => setShowMore(true)}
                >
                    Show more
                </button>
            )}
        </section>
    )
}

const SubjectsSection = ({subjects}: { subjects?: IFilter[] }) => {
    const [showMoreVisible, setShowMoreVisible] = useState(true);
    if (!subjects) return null;
    return (
        <section className='flex flex-col space-y-2 mt-2'>
            <p className='px-2'>Subjects</p>
            {subjects
                ?.slice(0, showMoreVisible ? 4 : subjects?.length)
                ?.map(subject => (
                    <Link
                        key={subject?.value}
                        to={`/subjects/${getSubjectSlugById(subject?.value)}`}
                        className="ms-1 flex space-x-2 px-2 py-1 justify-between items-center me-4 overflow-x-hidden hover:bg-gray-200 rounded"
                    >
                        <p
                            className={clsx(
                                "text text-black whitespace-nowrap truncate",
                                subject?.defaultChecked ? 'font-bold' : 'font-medium'
                            )}
                        >
                            {subject?.label}
                        </p>
                        {subject?.count && <p className='text-[#99a7af] text-sm ml-auto'>{subject?.count}</p>}
                    </Link>
                ))
            }
            <button
                className='ms-1 text-[#0059ff] text-sm px-2 py-1 rounded font-medium w-fit hover:bg-[#e1f2ff]'
                onClick={() => setShowMoreVisible(!showMoreVisible)}
            >
                {showMoreVisible ? 'Show more' : 'Show less'}
            </button>
        </section>
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

const STATUS_FILTERS: IFilter[] = [
    {label: 'Answered', value: 'answered'},
    {label: 'Unanswered', value: 'unanswered'},
];

const TYPE_FILTERS: IFilter[] = [
    {label: 'Multiple Choice', value: 'MULTIPLE_CHOICE'},
    {label: 'True/False', value: 'TRUE_FALSE'},
    {label: 'Essay', value: 'ESSAY'},
    {label: 'Short answer', value: 'SHORT_ANSWER'},
];

function makeSelectedFirst(array: IFilter[]) {
    // Find the index of the item with the desired property value
    let index = array.findIndex(item => item.defaultChecked);

    // If the item is found, move it to the beginning of the array
    if (index !== -1) {
        let item = array.splice(index, 1)[0]; // Remove the item from the array
        array.unshift(item); // Add the item to the beginning of the array
    }
}