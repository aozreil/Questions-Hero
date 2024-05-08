import Question from "~/components/question/Question";
import {
  ClientLoaderFunctionArgs,
  Link,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/router";
import { json } from "@remix-run/node";
import CheckboxWithLabel from "~/components/UI/CheckboxWithLabel";
import { getQuestionsById, getSubjectsFilter, getUsersInfo } from "~/apis/questionsAPI.server";
import { useEffect, useRef, useState } from "react";
import { getSubjectIdBySlug, getSubjectSlugById } from "~/models/subjectsMapper";
import clsx from "clsx";
import { IQuestion, ISubjectFilter, IUser, IUsers, QuestionClass } from "~/models/questionModel";
import Loader from "~/components/UI/Loader";
import { clientGetQuestionsById, clientGetUsers } from "~/apis/questionsAPI";

interface LoaderData {
  questions?: IQuestion[];
  subjects?: ISubjectFilter[];
  mainSubjectId?: string;
  users?: IUsers[];
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
      getQuestionsById({ params: {
        topic_ids: [mainSubjectId],
        page: page ? page : 0 }
      }),
      getSubjectsFilter(),
    ])

    const userIds = [];
    for (const question of questions?.data) {
      if (question?.user_id) userIds.push(question.user_id);
    }

    const users = userIds?.length ? await getUsersInfo(userIds).catch(() => []) : [];

    return json({
      questions: questions?.data?.map(question => QuestionClass.questionExtraction(question)),
      subjects,
      mainSubjectId,
      users,
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

  const questions = await clientGetQuestionsById({ params: {
      topic_ids: [mainSubjectId],
      question_types: questionTypes?.length ? questionTypes : undefined,
      is_answered: answeredParam,
      page: page ? page : 0 }
  });

  const userIds = [];
  for (const question of questions?.data) {
    if (question?.user_id) userIds.push(question.user_id);
  }

  const users = userIds?.length ? await clientGetUsers(userIds).catch(() => []) : [];

  return {
    questions: questions?.data?.map(question => QuestionClass.questionExtraction(question)),
    users: QuestionClass.usersExtraction(users),
    mainSubjectId,
  }
};

clientLoader.hydrate = true;

const getFilteredSubjects = (subjects?: ISubjectFilter[], mainSubjectId?: string) => {
  return subjects
    ?.filter(subject => subject?.questions_count > 0)
    ?.map(subject => ({
      label: subject?.title,
      value: subject?.id?.toString(),
      count: subject?.questions_count?.toString(),
      defaultChecked: !!mainSubjectId && !!subject?.id && subject?.id === Number(mainSubjectId),
    }))
    ?.sort((a, b) => b?.defaultChecked ? 1 : -1)
}

export default function _mainSubjectsSubject() {
  const {
    subjects,
    mainSubjectId,
    questions,
    users,
  } = useLoaderData() as LoaderData;
  const [savedSubjects] = useState(subjects);
  const [filteredSubjects, setFilteredSubjects] = useState<IFilter[] | undefined>(
    () => getFilteredSubjects(subjects, mainSubjectId));
  const isFirstLoad = useRef(true);
  const navigation = useNavigation();

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    const list = getFilteredSubjects(savedSubjects, mainSubjectId);
    setFilteredSubjects(list);
  }, [navigation?.location]);


  return (
    <div className='flex-1 overflow-y-auto h-full w-full max-h-[calc(100vh-6rem)] pb-5'>
      <div className='flex flex-col items-center'>
        <div className='w-[70vw] max-w-[70rem] flex flex-col items-center mt-3'>
          <div className='relative w-full h-[10.6rem] rounded-xl mb-3 py-5 px-8'>
            <img src='/assets/images/subjects-header.png' alt='subjects-header' className='absolute z-10 w-full h-full top-0 left-0' />
            <img src='/assets/images/subjects-header-icon.png' alt='subjects-header' className='absolute z-10 h-[80%] top-0 bottom-0 my-auto right-12' />
            <div className='relative flex flex-col justify-center space-y-6 h-full z-20'>
              <p className='text-3xl text-white font-bold'>Curious minds want to know!</p>
              <Link to='/ask-question' className='btn-primary w-fit'>
                <p className='text-lg mx-16 my-2'>Ask away - we've got answers</p>
              </Link>
            </div>
          </div>
          <div className='w-full flex space-x-4'>
            <div className='w-[14rem] rounded-xl shadow-md p-2 text-black h-fit sticky top-4'>
              <p className='text-lg px-2 font-bold mb-4'>Questions filter</p>
              <SubjectsSection subjects={filteredSubjects} />
              <hr className='my-5' />
              <FiltersSection title='Status' filters={STATUS_FILTERS} paramsId='question_status' />
              <hr className='my-5' />
              <FiltersSection title='Type' filters={TYPE_FILTERS} paramsId='question_types' />
            </div>
            <div className='flex flex-col space-y-4 w-full'>
              {navigation.state === 'idle' ?
              questions?.map(question => (
                <Question
                  key={question?.id}
                  questionBody={question?.text}
                  createdAt={question?.created_at}
                  user={question?.user_id ? users[question.user_id] : undefined}
                  slug={question?.slug}
                />
              )): <div className={'flex items-center justify-center w-full'}>
                  <Loader/>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface IFilter { label: string; value: string; count?: string; defaultChecked?: boolean }

const FiltersSection = ({ title, filters, showMoreOn, paramsId }: {
  title: string;
  filters: IFilter[];
  showMoreOn?: number;
  paramsId?: string;
}) => {
  const [showMore, setShowMore] = useState(false);
  const [allParams, setAllParams] = useState<string[]>([]);
  const showMoreVisible = showMoreOn && !showMore;
  const navigate = useNavigate();

  useEffect(() => {
    if (paramsId) {
      setAllParams(getStorageArr(paramsId));
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
              defaultChecked={filter?.defaultChecked || allParams?.includes(filter?.value)}
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
    <section className='flex flex-col space-y-2 '>
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
      {showMoreVisible && (
        <button
          className='ms-1 text-[#0059ff] text-sm px-2 py-1 rounded font-medium w-fit hover:bg-[#e1f2ff]'
          onClick={() => setShowMoreVisible(false)}
        >
          Show more
        </button>
      )}
    </section>
  )
}

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
