import Header from "~/components/UI/Header";
import {json, MetaFunction} from "@remix-run/node";
import AnswerCard from "~/components/question/AnswerCard";
import QuestionSection from "~/components/question/QuestionSection";
import LearningObjectives from "~/components/question/LearningObjectives";
import {useState} from "react";
import ExpandImage from "~/components/question/ExpandImage";
import {getAnswerById, getQuestionById} from "~/apis/questionsAPI.server";
import {LoaderFunctionArgs, redirect, useLoaderData} from "react-router";
import {Answer, Question} from "~/models/questionModel";
import QuestionContent from "~/components/question/QuestionContent";

export const meta: MetaFunction = () => ([
    ...getStructuredData(),
]);

const getStructuredData = () => {
    const QAPage = ({
        "@context": "https://schema.org",
        "@type": "QAPage",
        "name": `[[[[[[[[[[[question.title]]]]]]]]]]]`,
        description: `[[[[[[[[[[description]]]]]]]]]]`,
        "mainEntity": {
            "@type": "Question",
            "name": `[[[[[[[[[[question.title]]]]]]]]]]`,
            "text": `[[[[[[[[[[description]]]]]]]]]]`,
            "answerCount": 1,
            "upvoteCount": 2,
            acceptedAnswer: {
                "@type": "Answer",
                text: `[[[[[[question.answer]]]]]]`,
                upvoteCount: 1,
                url: `[[[[[[[question.bioBase/questions/]]]]]]]`,
            },
        }
    });

    const Quiz = ({
        "@context": "https://schema.org",
        "@type": "Quiz",
        about: {
            "@type": "Thing",
            name: '[[[[[[[question.title]]]]]]]',
        },
        educationalAlignment: [
            {
                "@type": "AlignmentObject",
                alignmentType: "educationalSubject",
                targetName: "Biology",
            },
            {
                "@type": "AlignmentObject",
                alignmentType: "educationalSubject",
                targetName: `[[[[[[[[question.courseTitle]]]]]]]]`,
            },
            {
                "@type": "AlignmentObject",
                alignmentType: "educationalSubject",
                targetName: `[[[[[[[[question.studySetTitle]]]]]]]]`,
            },
        ],
        hasPart: [
            {
                "@context": "https://schema.org/",
                "@type": "Question",
                eduQuestionType: "Flashcard",
                text: `[[[[[[[[[[description]]]]]]]]]]`,
                upvoteCount: 1,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `[[[[[[[[[[question.answer]]]]]]]]]]`,
                    upvoteCount: 1,
                    url: `[[[[[[[question.bioBase/questions/]]]]]]]`,
                },
            },
        ],
    });

    return [
        { "script:ld+json": QAPage },
        { "script:ld+json": Quiz },
    ];
};

interface LoaderData {
    question: Question;
    answers: Answer[];
    createdAt: string;
}

export async function loader ({ params }: LoaderFunctionArgs) {
    const { id } = params;
    if (!id) throw 'ID Is Required';

    let [question, answers] = await Promise.all([
        getQuestionById(id),
        getAnswerById(id),
    ]);

    if (question?.error) return redirect('/');

    return json({ question, answers });
}

export default function QuestionPage() {
    const [expandedImage, setExpandedImage] = useState<string | undefined>(undefined);
    const {question, answers} = useLoaderData() as LoaderData;

    return (
        <div className='relative w-screen h-screen bg-[#f7f8fa] overflow-x-hidden'>
            <ExpandImage expandedImage={expandedImage} onClose={() => setExpandedImage(undefined)} />
            <Header className='bg-white  border-b-[3px] border-[#ebf2f6]' />
            <div className='w-full h-fit flex flex-col items-center pt-4 sm:py-4 sm:px-4'>
                <div className='max-lg:max-w-[540px] flex-shrink lg:w-fit'>
                    <p className='w-fit text-[#002237] text-sm pl-4 pb-[14px]'>
                        Computing
                        <span className='mx-2'>|</span>
                        Viewed
                        <span className='ml-1 font-bold'>7,889</span>
                    </p>
                    <div className='flex flex-col lg:flex-row justify-center gap-4'>
                        <div className='w-full sm:max-w-[540px] lg:w-[540px] flex flex-col bg-[#f1f5fb] border border-[#00000038] sm:rounded-xl overflow-hidden'>
                            <div className='flex flex-col items-center w-full rounded-b-2xl bg-white shadow-[0_1px_5px_0_rgba(0,0,0,0.22)]'>
                                <QuestionContent question={question} />
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
                            <div className='mb-2 px-[13px] flex flex-col items-center'>
                                <AnswerCard answer={answers[0]} />
                            </div>
                        </div>
                        {!!question?.learning_objectives && <LearningObjectives text={question.learning_objectives} />}
                    </div>
                </div>
            </div>
        </div>
    )
}