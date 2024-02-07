import Header from "~/components/UI/Header";
import {json, MetaFunction} from "@remix-run/node";
import AnswerCard from "~/components/question/AnswerCard";
import QuestionSection from "~/components/question/QuestionSection";
import LearningObjectives from "~/components/question/LearningObjectives";
import {useState} from "react";
import ExpandImage from "~/components/question/ExpandImage";
import {getAnswerById, getQuestionById, getUsersInfo} from "~/apis/questionsAPI.server";
import {LoaderFunctionArgs, redirect, useLoaderData} from "react-router";
import {Answer, Question, Users} from "~/models/questionModel";
import QuestionContent from "~/components/question/QuestionContent";
import {getSeoMeta} from "~/utils/seo";

export const meta: MetaFunction = ({ data }) => {
    const { canonical } = data as LoaderData;
    return [
        ...getSeoMeta({ canonical }),
        ...getStructuredData(data as LoaderData),
    ];
};

const getStructuredData = (data: LoaderData) => {
    const questionBody = data?.question?.text;
    const questionTitle = questionBody;
    if (!questionBody) return [];

    const answer = data?.answers?.[0]?.text
        ? `The Answer is ${data?.answers?.[0]?.text}`
        : `The Answer of ${questionTitle}`;

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
                    "text": answer,
                    "url": data?.canonical,
                }
            },
        ]
    }

    const QAPage = ({
        "@context": "https://schema.org",
        "@type": "QAPage",
        "name": questionTitle,
        description: questionBody,
        "mainEntity": {
            "@type": "Question",
            "name": questionTitle,
            "text": questionBody,
            "answerCount": 1,
            "upvoteCount": 2,
            acceptedAnswer: {
                "@type": "Answer",
                text: answer,
                upvoteCount: 1,
                url: data?.canonical,
            },
        }
    });

    return [
        { "script:ld+json": QAPage },
        { "script:ld+json": Educational },
    ];
};

interface LoaderData {
    question: Question;
    answers: Answer[];
    users: Users;
    canonical: string;
}

export async function loader ({ params }: LoaderFunctionArgs) {
    const { slug } = params;
    if (!slug) throw 'ID Is Required';

    const id = slug.split('-').pop() || slug;
    let [question, answers] = await Promise.all([
        getQuestionById(id),
        getAnswerById(id),
    ]);

    if (question?.error) return redirect('/');

    const userIds = [];
    if (question?.user_id) userIds.push(question.user_id);
    if (answers?.[0]?.user_id) userIds.push(answers[0].user_id);
    const users = userIds?.length ? await getUsersInfo(userIds) : [];

    const canonical = `https://askgramdev.work/question/${slug}`

    return json({
        question,
        answers,
        users,
        canonical,
    });
}

export default function QuestionPage() {
    const [expandedImage, setExpandedImage] = useState<string | undefined>(undefined);
    const {question, answers, users} = useLoaderData() as LoaderData;

    return (
        <div className='relative w-screen h-screen bg-[#f7f8fa] overflow-x-hidden'>
            <ExpandImage expandedImage={expandedImage} onClose={() => setExpandedImage(undefined)} />
            <Header className='bg-white  border-b-[3px] border-[#ebf2f6]' />
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
                                                            <p className='mb-1 font-extrabold'>{concept?.concept}</p>
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
                            {answers?.length && (
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