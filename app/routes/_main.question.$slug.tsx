import {json, MetaFunction} from "@remix-run/node";
import AnswerCard from "~/components/question/AnswerCard";
import QuestionSection from "~/components/question/QuestionSection";
import LearningObjectives from "~/components/question/LearningObjectives";
import {useState} from "react";
import ExpandImage from "~/components/question/ExpandImage";
import {
    getAnswerById,
    getInternalAnswers,
    getInternalQuestion,
    getQuestionById,
    getUsersInfo
} from "~/apis/questionsAPI.server";
import {LoaderFunctionArgs, redirect, useLoaderData} from "react-router";
import {IAnswer, IInternalAnswer, IQuestion, IUsers} from "~/models/questionModel";
import QuestionContent from "~/components/question/QuestionContent";
import {getSeoMeta} from "~/utils/seo";
import {getUser} from "~/utils";
import { BASE_URL } from "~/utils/enviroment.server";

export const meta: MetaFunction = ({ data }) => {
    const { canonical, question } = data as LoaderData;
    return [
        ...getSeoMeta({ title: question?.text ,canonical }),
        ...getStructuredData(data as LoaderData),
    ];
};

interface LoaderData {
    question: IQuestion;
    answers: IAnswer[];
    users: IUsers;
    canonical: string;
    structuredQuestion?: string;
    internalAnswers?: IInternalAnswer[];
}

export async function loader ({ params, request }: LoaderFunctionArgs) {
    const { slug } = params;
    if (!slug) throw 'ID Is Required';

    const id = slug.split('-').pop() || slug;
    let [question, answers, internalQuestion, internalAnswers] = await Promise.all([
        getQuestionById(id),
        getAnswerById(id),
        getInternalQuestion(id, { req: request }),
        getInternalAnswers(id, { req: request }),
    ]);

    if (question?.error) return redirect('/');

    let structuredQuestion = '';
    if (internalQuestion?.text) {
        structuredQuestion = internalQuestion?.text;
    }

    const userIds = [];
    if (question?.user_id) userIds.push(question.user_id);
    if (answers?.[0]?.user_id) userIds.push(answers[0].user_id);
    const users = userIds?.length ? await getUsersInfo(userIds) : [];

    const canonical = `${BASE_URL}/question/${slug}`

    return json<LoaderData>({
        question,
        answers,
        users,
        canonical,
        structuredQuestion,
        internalAnswers,
    });
}

export default function QuestionPage() {
    const [expandedImage, setExpandedImage] = useState<string | undefined>(undefined);
    const {question, answers, users} = useLoaderData() as LoaderData;

    return (
        <div className='relative w-screen'>
            <ExpandImage expandedImage={expandedImage} onClose={() => setExpandedImage(undefined)} />
            <div className='w-full h-fit flex flex-col items-center pt-4 sm:py-4 sm:px-4'>
                <div className='w-full max-lg:max-w-[540px] flex-shrink lg:w-fit'>
                    <p className='w-fit text-[#002237] text-sm pl-4 pb-[14px]'>
                        Computing
                        <span className='mx-2'>|</span>
                        Viewed
                        <span className='ml-1 font-bold'>7,889</span>
                    </p>
                    <div className='flex flex-col lg:flex-row justify-center gap-4'>
                        <div className='w-full sm:max-w-[540px] lg:w-[540px] flex flex-col bg-[#f1f5fb] border border-[#00000038] sm:rounded-xl overflow-hidden'>
                            <div className='flex flex-col items-center w-full rounded-b-2xl bg-white shadow-[0_1px_5px_0_rgba(0,0,0,0.22)]'>
                                <QuestionContent
                                    question={question}
                                    userName={question?.user_id ? users[question.user_id] : undefined}
                                />
                                {!!question?.concepts?.length && (
                                    <QuestionSection
                                        title='Definitions'
                                        content={(
                                            <>
                                                {question.concepts.map((concept) => (
                                                    !concept?.definition ? null : (
                                                        <div key={concept?.concept} className='text-[13px] mt-4'>
                                                            <p className='mb-1 font-bold'>{concept?.concept}</p>
                                                            <p className='text-[#4d6473]'>{concept?.definition}</p>
                                                        </div>
                                                    )
                                                ))}
                                            </>
                                        )}
                                    />
                                )}
                                {!!question?.learning_objectives && (
                                    <QuestionSection
                                        title='Learning Objectives'
                                        className='lg:hidden'
                                        content={(
                                            <div className='text-[13px] mt-4'>
                                                <p className='text-[#4d6473]'>{question.learning_objectives}</p>
                                            </div>
                                        )}
                                    />
                                )}
                            </div>
                            {!!answers?.length && (
                                <div className='mb-2 px-[13px] flex flex-col items-center'>
                                    <AnswerCard
                                        answer={answers[0]}
                                        userName={answers[0]?.user_id ? users[answers[0]?.user_id] : undefined}
                                    />
                                </div>
                            )}
                        </div>
                        {!!question?.learning_objectives && <LearningObjectives text={question.learning_objectives} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

const getStructuredData = (data: LoaderData) => {
    const {
        structuredQuestion,
        question,
        answers,
        internalAnswers,
        canonical,
        users,
    } = data;

    const questionBody = structuredQuestion ?? question?.text;
    const questionTitle = questionBody;
    if (!questionBody) return [];

    const askedBy = getUser(question?.user_id, users);
    const answerCount = internalAnswers?.length ?? answers?.length;

    const getAnswer = (index: number) => {
        return internalAnswers?.[index] ?? answers?.[index];
    }

    const getAnswerText = (index: number) => {
        const answer = getAnswer(index);
        return answer?.text || `The Answer of ${questionTitle}`
    }

    const Educational = {
        "@context": "https://schema.org/",
        "@type": "Quiz",
        "about": {
            "@type": "Thing",
            "name": questionTitle
        },
        "hasPart": [
            {
                "@context": "https://schema.org/",
                "@type": "Question",
                "eduQuestionType": "Flashcard",
                "text": questionBody,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": getAnswerText(0),
                    "url": canonical,
                }
            },
        ]
    }

    const getSuggestedAnswers = () => {
        let suggestedAnswers = internalAnswers || answers;
        if (suggestedAnswers?.length > 1) {
            suggestedAnswers = suggestedAnswers?.slice(1, suggestedAnswers?.length);
            return {
                "suggestedAnswer": [
                    suggestedAnswers?.map(answer => ({
                        "@type": "Answer",
                        "text": answer?.text,
                        "datePublished": answer?.created_at,
                        "author": {
                            "@type": "Person",
                            "name": getUser(answer?.user_id, users),
                        },
                    }))
                ]
            }
        }

        return {};
    }

    // note: this can also include profile link and upvotes
    const QAPage = {
        "@context": "https://schema.org",
        "@type": "QAPage",
        name: questionTitle,
        description: questionBody,
        "mainEntity": {
            "@type": "Question",
            "name": questionTitle,
            "text": questionBody,
            "answerCount": answerCount,
            "datePublished": question?.created_at,
            "author": {
                "@type": "Person",
                "name": askedBy,
            },
            "acceptedAnswer": {
                "@type": "Answer",
                "text": getAnswerText(0),
                "url": `${canonical}#acceptedAnswer`,
                "datePublished": getAnswer(0)?.created_at,
                "author": {
                    "@type": "Person",
                    "name": getUser(getAnswer(0)?.user_id, users),
                }
            },
            ...getSuggestedAnswers(),
        }
    }

    return [
        { "script:ld+json": QAPage },
        { "script:ld+json": Educational },
    ];
};