import Header from "~/components/UI/Header";
import {MetaFunction} from "@remix-run/node";
import AnswerCard from "~/components/question/AnswerCard";
import QuestionSection from "~/components/question/QuestionSection";
import LearningObjectives from "~/components/question/LearningObjectives";

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

export default function QuestionPage() {
    return (
        <div className='w-screen h-screen bg-[#f7f8fa] overflow-x-hidden'>
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
                                <div className='flex flex-col mb-5 p-4'>
                                    <div className='w-full flex flex-col-reverse sm:flex-row flex-wrap sm:justify-between sm:items-center mb-3'>
                                        <p className='text-[#667a87] text-[13px]'>Asked by <span className='font-bold'>Mhamad Jarrar on 13 Aug 2023</span></p>
                                        <div className='flex items-center gap-[6px] text-[#25b680] text-[15px] font-bold mb-5 sm:mb-0'>
                                            <img src='/assets/images/verified.svg' alt='verifed' />
                                            <p>Verified</p>
                                        </div>
                                    </div>
                                    <p className='text-[15px] lg:text-[19px] font-semibold mb-3'>
                                        While working in a community mental health treatment center, a nurse overhears one of the
                                        receptionists saying that one of the clients is "really psycho." Later in the day,
                                        the nurse talks with the receptionist about the comment. This action by the nurse demonstrates
                                        an attempt to address which issue?
                                    </p>
                                    <img src='/assets/images/question-image.png' alt='question-image' />
                                </div>
                                <QuestionSection
                                    title='Definitions'
                                    content={(
                                        <>
                                            <div className='text-[13px] mt-4'>
                                                <p className='mb-1 font-extrabold'>Nurse overhears</p>
                                                <p className='text-[#4d6473]'>typically refers to a situation where a nurse unintentionally listens to or becomes
                                                    aware of a conversation or information without actively seeking it out.
                                                    This could happen if the nurse is nearby</p>
                                            </div>
                                            <div className='text-[13px] mt-4'>
                                                <p className='mb-1 font-extrabold'>Really psycho</p>
                                                <p className='text-[#4d6473]'>is typically used colloquially to describe someone or
                                                    something as extremely mentally unstable, erratic, or exhibiting behavior that is
                                                    perceived as crazy or irrational. It is often used in informal conversation to
                                                    convey a strong negative impression of someone's behavior or actions.</p>
                                            </div>
                                            <div className='text-[13px] mt-4'>
                                                <p className='mb-1 font-extrabold'>Receptionist</p>
                                                <p className='text-[#4d6473]'>is an administrative professional responsible for managing
                                                    the front desk area of an organization or business.</p>
                                            </div>
                                        </>
                                    )}
                                />
                                <QuestionSection
                                    title='Learning Objectives'
                                    className='lg:hidden'
                                    content={(
                                        <div className='text-[13px] mt-4'>
                                            <p className='text-[#4d6473]'>While working in a community mental health treatment center, a nurse overhears one of the
                                                receptionists saying that one of the clients is "really psycho." Later in the day, the
                                                nurse talks with the receptionist about the comment.</p>
                                        </div>
                                    )}
                                />
                            </div>
                            <div className='mb-2 px-[13px] flex flex-col items-center'>
                                <AnswerCard />
                            </div>
                        </div>
                        <LearningObjectives />
                    </div>
                </div>
            </div>
        </div>
    )
}