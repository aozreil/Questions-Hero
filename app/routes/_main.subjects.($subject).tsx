import Question from "~/components/question/Question";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/router";
import { json } from "@remix-run/node";
import CheckboxWithLabel from "~/components/UI/CheckboxWithLabel";
import { getQuestionsById, getSubjectsFilter, getUsersInfo } from "~/apis/questionsAPI.server";
import { useEffect, useRef, useState } from "react";
import { getSubjectIdBySlug, getSubjectSlugById } from "~/models/subjectsMapper";
import clsx from "clsx";
import { IQuestion, ISubjectFilter, IUser, IUsers, QuestionClass } from "~/models/questionModel";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { subject } = params;
  const url = new URL(request.url);
  const queryParams = url.searchParams;

  const questionTypes = queryParams.getAll('question_types');
  const questionStatus = queryParams.getAll('question_status');
  const answeredParam = questionStatus?.length === 1
    ? questionStatus?.includes('answered') : undefined
  const mainSubjectId = getSubjectIdBySlug(subject);

  let subjects: ISubjectFilter[] = [],
    questions: IQuestion[] = [],
    users: IUsers = [];

  try {
    const [questions, subjects] = await Promise.all([
      getQuestionsById({ params: {
        topic_ids: [mainSubjectId],
        question_types: questionTypes?.length ? questionTypes : undefined,
        is_answered: answeredParam,
      }}),
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
  } = useLoaderData<typeof loader>()
  const [filteredSubjects, setFilteredSubjects] = useState<IFilter[] | undefined>(
    () => getFilteredSubjects(subjects, mainSubjectId));
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    const list = getFilteredSubjects(subjects, mainSubjectId);
    setFilteredSubjects(list);
  }, [subjects]);

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
            <div className='w-[14rem] rounded-xl shadow-md p-5 text-black h-fit'>
              <p className='text-lg font-bold mb-4'>Questions filter</p>
              <SubjectsSection subjects={filteredSubjects} />
              {/*{subjectsFilter && <FiltersSection*/}
              {/*  title='Subjects'*/}
              {/*  filters={subjectsFilter}*/}
              {/*  showMoreOn={7}*/}
              {/*  paramsId='topic_ids'*/}
              {/*/>}*/}
              <hr className='my-5' />
              <FiltersSection title='Status' filters={STATUS_FILTERS} paramsId='question_status' />
              <hr className='my-5' />
              <FiltersSection title='Type' filters={TYPE_FILTERS} paramsId='question_types' />
            </div>
            <div className='flex flex-col space-y-4'>
              {questions?.map(question => (
                <Question
                  key={question?.id}
                  questionBody={question?.text}
                  createdAt={question?.created_at}
                  user={question?.user_id ? users[question.user_id] : undefined}
                  slug={question?.slug}
                />
              ))}
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
  const showMoreVisible = showMoreOn && !showMore;
  const [searchParams, setSearchParams] = useSearchParams();
  const allParams = paramsId ? searchParams?.getAll(paramsId) : undefined;

  const handleChange = (value: string, isChecked: boolean) => {
    if (paramsId) {
      isChecked
        ? searchParams.append(paramsId, value)
        : searchParams.delete(paramsId, value)
      setSearchParams(searchParams, {
        preventScrollReset: true,
      });
    }
  }

  return (
    <section className='flex flex-col space-y-2'>
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
          className='text-[#0059ff] text-sm font-medium w-fit ml-7'
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
    <section className='flex flex-col space-y-2'>
      <p>Subjects</p>
      {subjects
        ?.slice(0, showMoreVisible ? 7 : subjects?.length )
        ?.map(subject => (
          <Link
            key={subject?.value}
            to={`/subjects/${getSubjectSlugById(subject?.value)}`}
            className="ms-1 flex space-x-2 justify-between items-center me-4 overflow-x-hidden"
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
          className='ms-1 text-[#0059ff] text-sm font-medium w-fit'
          onClick={() => setShowMoreVisible(false)}
        >
          Show more
        </button>
      )}
    </section>
  )
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