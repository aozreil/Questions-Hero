import Question from "~/components/question/Question";
import {
  ClientLoaderFunctionArgs,
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation
} from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/router";
import { json, MetaFunction } from "@remix-run/node";
import CheckboxWithLabel from "~/components/UI/CheckboxWithLabel";
import { getQuestionsByIdV1, getQuestionsInfo, getSubjectsFilter, getUsersInfo } from "~/apis/questionsAPI.server";
import { useEffect, useRef, useState } from "react";
import { getSubjectIdBySlug, getSubjectSlugById, SUBJECTS_MAPPER } from "~/models/subjectsMapper";
import clsx from "clsx";
import {
  AnswerStatus,
  IQuestion,
  ISubjectFilter,
  IUsers,
  QuestionClass
} from "~/models/questionModel";
import { clientGetQuestionsByIdV1, clientGetQuestionsInfo, clientGetUsers } from "~/apis/questionsAPI";
import { Pagination } from "~/components/UI/Pagination";
import { useAuth } from "~/context/AuthProvider";
import ContentLoader from "~/components/UI/ContentLoader";
import { getSeoMeta } from "~/utils/seo";
import { BASE_URL } from "~/config/enviromenet";
import { getKatexLink } from "~/utils/external-links";

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  if (!data) {
    return [];
  }

  const { page, size, count, mainSubjectId } = data as LoaderData;
  const canonical = `${BASE_URL}${location?.pathname}${page ? location?.search : ''}`;

  const getPageTitle = () => {
    const defaultTitle = 'Subjects Page';
    const subjectTitle = SUBJECTS_MAPPER.hasOwnProperty(Number(mainSubjectId)) && SUBJECTS_MAPPER[Number(mainSubjectId)]?.label;
    if (subjectTitle) {
      return `Subject | ${subjectTitle}`;
    }

    return defaultTitle;
  }

  const getPrevNextLinks = () => {
    if (page === undefined || size === undefined || count === undefined) return[];
    const prevLink = page > 0 && `${BASE_URL}${location?.pathname}?page=${page - 1}`;
    const nextLink = ((page + 1) * size) < (count) && `${BASE_URL}${location?.pathname}?page=${page + 1}`;

    let links = [];
    if (prevLink) links.push({ tagName: "link", rel: "prev", href: prevLink })
    if (nextLink) links.push({ tagName: "link", rel: "next", href: nextLink })
    return links;
  }

  return [
    ...getSeoMeta({
      title: getPageTitle(),
      canonical
    }),
    ...getPrevNextLinks(),
    ...getKatexLink(),
  ];
}

interface QuestionsInfoMapper { [key: string]: { answers_count: number, answers_statuses: AnswerStatus[] } };

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

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { subject } = params;
  const url = new URL(request.url);
  const queryParams = url.searchParams;

  const page = queryParams.get('page');
  const mainSubjectId = getSubjectIdBySlug(subject);

  let subjects: ISubjectFilter[] = [],
    questions: IQuestion[] = [],
    users: IUsers = [];

  try {
    const [questions, subjects] = await Promise.all([
      getQuestionsByIdV1({ params: {
        topic_ids: mainSubjectId ? [mainSubjectId] : undefined,
        page: page ? page : 0 }
      }),
      getSubjectsFilter(),
    ])

    const userIds = [];
    const questionIds = [];
    for (const question of questions?.data) {
      if (question?.user_id) userIds.push(question.user_id);
      if (question?.id) questionIds.push(question.id);
    }

    const [users, questionsInfo] = await Promise.all([
      userIds?.length && getUsersInfo(userIds).catch(() => []),
      questionIds?.length && getQuestionsInfo({ params: { ids: questionIds }}).catch(() => []),
    ]);

    let questionsInfoMapper: QuestionsInfoMapper = {};
    questionsInfo && questionsInfo?.forEach((question) => questionsInfoMapper[question.id] = {
      answers_count: question?.answers_count,
      answers_statuses: question?.answers_statuses,
    });

    return json({
      questions: questions?.data?.map(question => QuestionClass.questionExtraction(question)),
      subjects,
      mainSubjectId,
      questionsInfoMapper,
      users: users ?? [],
      page: questions?.page,
      size: questions?.size,
      count: questions?.count,
    });
  } catch (e) {
    console.log(e);
  }

  return json({ questions, subjects, mainSubjectId, users });
}

let initialLoaderResponse: LoaderData | undefined = undefined;
export const clientLoader = async ({
 request,
 params,
 serverLoader,
}: ClientLoaderFunctionArgs) => {
  if (!initialLoaderResponse) {
    const serverData = await serverLoader() as LoaderData;
    initialLoaderResponse = serverData;

    // clear session storage on refresh
    sessionStorage.removeItem('question_types')
    sessionStorage.removeItem('question_status')
    return serverData;
  }

  const { subject } = params;
  const mainSubjectId = getSubjectIdBySlug(subject);

  const url = new URL(request.url);
  const queryParams = url.searchParams;
  const page = queryParams.get('page');

  const questionTypes = getStorageArr("question_types");
  const questionStatus = getStorageArr("question_status");
  const answeredParam = questionStatus?.length === 1
    ? questionStatus?.includes('answered') : undefined

  const questions = await clientGetQuestionsByIdV1({ params: {
      topic_ids: mainSubjectId ? [mainSubjectId] : undefined,
      question_types: questionTypes?.length ? questionTypes : undefined,
      is_answered: answeredParam,
      page: page ? page : 0 }
  });

  const userIds = [];
  const questionIds = [];
  for (const question of questions?.data) {
    if (question?.user_id) userIds.push(question.user_id);
    if (question?.id) questionIds.push(question.id);
  }

  const [users, questionsInfo] = await Promise.all([
    userIds?.length && clientGetUsers(userIds).catch(() => []),
    questionIds?.length && clientGetQuestionsInfo({ params: { ids: questionIds }}).catch(() => []),
  ]);

  let questionsInfoMapper: QuestionsInfoMapper = {};
  questionsInfo && questionsInfo?.forEach((question) => questionsInfoMapper[question.id] = {
    answers_count: question?.answers_count,
    answers_statuses: question?.answers_statuses,
  });

  return {
    questions: questions?.data?.map(question => QuestionClass.questionExtraction(question)),
    users: users ? QuestionClass.usersExtraction(users) : [],
    questionsInfoMapper,
    mainSubjectId,
    subjects: initialLoaderResponse?.subjects,
    page: questions?.page,
    size: questions?.size,
    count: questions?.count,
  }
};

clientLoader.hydrate = true;

const getFilteredSubjects = (subjects?: ISubjectFilter[], mainSubjectId?: string, selectedCount?: number) => {
  const isSelected = (id: number) => !!mainSubjectId && !!id && id === Number(mainSubjectId);
  return subjects
    ?.filter(subject => subject?.questions_count > 0)
    ?.map(subject => ({
      label: subject?.title,
      value: subject?.id?.toString(),
      count: isSelected(subject?.id) && selectedCount !== undefined ? selectedCount : subject?.questions_count?.toString(),
      defaultChecked: isSelected(subject?.id),
    }))
    ?.sort((a, b) => b?.defaultChecked ? 1 : -1)
}

export default function _mainSubjectsSubject() {
  const {
    subjects,
    mainSubjectId,
    questions,
    users,
    page,
    size,
    count,
    questionsInfoMapper,
  } = useLoaderData() as LoaderData;
  const [savedSubjects] = useState(subjects);
  const [filteredSubjects, setFilteredSubjects] = useState<IFilter[] | undefined>(
    () => getFilteredSubjects(subjects, mainSubjectId, count));
  const [questionsFilterExpanded, setQuestionsFilterExpanded] = useState(true);
  const isFirstLoad = useRef(true);
  const containerDiv = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigation = useNavigation();
  const isLoadingData = navigation.state === 'loading' && navigation.location?.pathname?.includes('subjects');
  const { user } = useAuth();

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

  return (
    <div ref={containerDiv} className='flex-1 overflow-y-auto h-full w-full max-h-[calc(100vh-6rem)] pb-5'>
      <div className='flex flex-col items-center'>
        <div className='w-[95vw] sm:w-[70vw] max-w-[70rem] flex flex-col items-center mt-3'>
          <div className='relative w-full h-[10.6rem] rounded-xl mb-3 py-5 px-8'>
            <img src='/assets/images/subjects-header.png' alt='subjects-header' className='absolute z-10 w-full h-full top-0 left-0' />
            <img src='/assets/images/subjects-header-icon.png' alt='subjects-header' className='max-lg:hidden absolute z-10 h-[80%] top-0 bottom-0 my-auto right-12' />
            <div className='relative flex flex-col max-sm:items-center max-sm:justify-center space-y-6 h-full z-20'>
              <p className='text-2xl sm:text-3xl text-white font-bold'>Curious minds want to know!</p>
              <Link to='/ask-question' target='_blank' className='btn-primary w-fit'>
                <p className='text-lg mx-10 sm:mx-16 my-2'>Ask away - we've got answers</p>
              </Link>
            </div>
          </div>
          <div className='w-full flex max-md:flex-col md:space-x-4'>
            <div className='w-full md:w-[14rem] mb-5 rounded-xl shadow-md p-2 text-black h-fit bg-white'>
              <button
                className='flex items-center justify-between w-full sm:pointer-events-none'
                onClick={() => setQuestionsFilterExpanded(!questionsFilterExpanded)}
              >
                <p className='text-lg px-2 font-bold'>Questions filter</p>
                <img
                  src='/assets/images/drop-down.svg'
                  alt='arrow-down'
                  className={`md:hidden w-4 mr-2 transition-all duration-200 ${questionsFilterExpanded ? '-rotate-90' : 'rotate-90'}`}
                />
              </button>
              <div className={clsx('flex flex-col w-full h-fit', !questionsFilterExpanded && 'hidden')}>
                <SubjectsSection subjects={filteredSubjects} />
                <hr className='my-5' />
                <FiltersSection title='Status' filters={STATUS_FILTERS} paramsId='question_status' />
                <hr className='my-5' />
                <FiltersSection title='Type' filters={TYPE_FILTERS} paramsId='question_types' />
              </div>
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
              {!isLoadingData ?
              questions?.map(question => (
                <Question
                  key={question?.id}
                  questionBody={question?.text}
                  createdAt={question?.created_at}
                  user={question?.user_id ? users[question.user_id] : undefined}
                  slug={question?.slug}
                  isLoggedIn={!!user}
                  answerCount={questionsInfoMapper?.hasOwnProperty(question?.id) ? questionsInfoMapper[question.id].answers_count : undefined}
                  answerStatuses={questionsInfoMapper?.hasOwnProperty(question?.id) ? questionsInfoMapper[question.id].answers_statuses : undefined}
                />
              )): <ContentLoaderContainer />}
              {!isLoadingData
                && !!questions?.length
                && size !== undefined
                && count !== undefined
                && page !== undefined
                && (
                  <Pagination
                    page={page}
                    size={size}
                    total={count}
                    previous={`${location.pathname}?page=${page - 1}`}
                    next={`${location.pathname}?page=${page + 1}`}
                  />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface IFilter { label: string; value: string; count?: string | number; defaultChecked?: boolean }

const FiltersSection = ({ title, filters, showMoreOn, paramsId }: {
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
      {filters
        ?.slice(0, showMoreVisible ? showMoreOn : filters?.length )
        ?.map(
          filter =>
            <CheckboxWithLabel
              key={filter?.value}
              id={filter?.value}
              label={filter?.label}
              value={filter?.value}
              count={filter?.count}
              defaultChecked={filter?.defaultChecked || cashedFilters?.includes(filter?.value)}
              onChecked={handleChange}
            />
        )
      }
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

const SubjectsSection = ({ subjects }: { subjects?: IFilter[] }) => {
  const [showMoreVisible, setShowMoreVisible] = useState(true);
  if (!subjects) return null;
  return (
    <section className='flex flex-col space-y-2 mt-2'>
      <p className='px-2'>Subjects</p>
      {subjects
        ?.slice(0, showMoreVisible ? 4 : subjects?.length )
        ?.map(subject => (
          <Link
            key={subject?.value}
            to={`/subjects/${getSubjectSlugById(subject?.value)}`}
            className="ms-1 flex space-x-2 px-2 py-1 justify-between items-center me-4 overflow-x-hidden hover:bg-gray-200 rounded"
          >
            <p
              className={clsx(
                "text text-black whitespace-nowrap truncate",
                subject?.defaultChecked && 'font-medium'
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
  <QuestionsContentLoader />
  <QuestionsContentLoader />
  <QuestionsContentLoader />
 </>
)

const QuestionsContentLoader = () => (
  <div className='flex flex-col w-full h-fit rounded-lg p-3.5 shadow-md bg-white'>
    <div className='flex space-x-3'>
      <ContentLoader tailwindStyles='h-11 w-11 rounded-full' />
      <div className='flex flex-col items-start text-sm text-black'>
        <ContentLoader tailwindStyles='w-20 h-5 mb-1 rounded-md' />
        <ContentLoader tailwindStyles='w-5 h-5 rounded-md' />
      </div>
    </div>
    <hr className='my-2.5' />
    <ContentLoader tailwindStyles='w-full h-16 rounded-md' />
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
  { label: 'Answered', value: 'answered' },
  { label: 'Unanswered', value: 'unanswered' },
];

const TYPE_FILTERS: IFilter[] = [
  { label: 'Multiple answers', value: 'MULTIPLE_CHOICE' },
  { label: 'True/False', value: 'TRUE_FALSE' },
  { label: 'Essay', value: 'ESSAY' },
  { label: 'Short answer', value: 'SHORT_ANSWER' },
];
