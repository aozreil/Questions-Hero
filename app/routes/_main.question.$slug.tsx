import { HeadersFunction, json, MetaFunction } from "@remix-run/node";
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
    getQuestionConcepts,
    getQuestionObjectives,
    getUsersInfo,
    handleError,
} from "~/apis/questionsAPI.server";
import {LoaderFunctionArgs, redirect, useLoaderData} from "react-router";
import {
    IAnswer,
    IConcept,
    IInternalAnswer,
    IInternalQuestion,
    IObjective,
    IQuestion,
    IUsers,
    QuestionClass,
} from "~/models/questionModel";
import QuestionContent from "~/components/question/QuestionContent";
import {getSeoMeta} from "~/utils/seo";
import {getUser} from "~/utils";
import { BASE_URL } from "~/config/enviroment.server";
import { isbot } from "isbot";
import invariant from "tiny-invariant";
import { getKatexLink } from "~/utils/external-links";
import { getCleanText } from "~/utils/text-formatting-utils";

export const meta: MetaFunction = ({ data }) => {
    const { canonical, question, baseUrl, structuredData } = data as LoaderData;
    return [
        ...getSeoMeta({
            title: question?.title ?? question?.text,
            description: structuredData?.verifiedAnswer,
            canonical,
        }),
        ...getStructuredData(data as LoaderData),
        ...[ question?.includesLatex ? getKatexLink(baseUrl) : {} ],
    ];
};

interface StructuredData {
    questionText?: string;
    verifiedAnswer?: string;
}

interface LoaderData {
    question: IQuestion;
    answers: IAnswer[];
    users: IUsers;
    concepts: IConcept[];
    objectives: IObjective[];
    canonical: string;
    internalQuestion?: IInternalQuestion;
    internalAnswers?: IInternalAnswer[];
    baseUrl: string;
    structuredData?: StructuredData;
}

export async function loader ({ params, request }: LoaderFunctionArgs) {
    const { slug } = params;
    invariant(slug, 'Not Found');

    const isBot = isbot(request.headers.get("user-agent"));
    const id = slug.split('-').pop() || slug;
    try {
        const [
            question,
            answers,
            concepts,
            objectives,
            internalQuestion,
            internalAnswers,
        ] = await Promise.all([
            getQuestionById(id),
            getAnswerById(id).catch((e) => handleError(e, [])),
            getQuestionConcepts(id).catch((e) => handleError(e, [])),
            getQuestionObjectives(id).catch((e) => handleError(e, [])),
            getInternalQuestion(id, isBot, { req: request }),
            getInternalAnswers(id, isBot, { req: request }),
        ]);

        if (question?.error) return redirect('/');
        if (question?.slug?.includes('-') && question?.slug !== slug) return redirect(`/question/${question?.slug}`);

        const userIds = [];
        if (question?.user_id) userIds.push(question.user_id);
        if (answers?.[0]?.user_id) userIds.push(answers[0].user_id);
        const users = userIds?.length
          ? await getUsersInfo(userIds).catch((e) => handleError(e, []))
          : [];

        const canonical = `${BASE_URL}/question/${question?.slug}`;

        const answer = internalAnswers?.[0] ?? answers?.[0];
        let answerText = `Final Answer : ${answer?.text}` ?? `The Answer of ${question?.text}`;
        if (answer?.answer_steps?.length) {
            answerText = answerText + ', Explanation : ';
            for (const step of answer.answer_steps) {
                answerText = answerText + ' ' + step?.text;
            }
        }
        const structuredData: StructuredData = {
            questionText: getCleanText(internalQuestion?.text ?? question?.text),
            verifiedAnswer: getCleanText(answerText)
        }

        return json<LoaderData>({
            question: QuestionClass.questionExtraction(question),
            answers: answers?.map((answer: IAnswer | undefined) => QuestionClass.answerExtraction(answer)),
            concepts,
            objectives,
            users,
            canonical,
            internalQuestion,
            internalAnswers,
            baseUrl: BASE_URL,
            structuredData,
        }, {
            headers: {
                'Cache-Control': 'max-age=86400, public',
            }
        });
    } catch (e) {
        console.error(e)
        throw new Response(null, {
            status: 404,
            statusText: "Not Found",
        });
    }
}

export const headers: HeadersFunction = () => ({
    "Cache-Control": "max-age=86400, s-maxage=86400",
});

export default function QuestionPage() {
    const [expandedImage, setExpandedImage] = useState<string | undefined>(undefined);
    const {question, answers, users, concepts, objectives} = useLoaderData() as LoaderData;

    return (
        <>
            <ExpandImage expandedImage={expandedImage} onClose={() => setExpandedImage(undefined)} />
            <main className='container max-xs:mx-0 w-full h-fit flex flex-col items-center pt-4 sm:py-4 sm:px-4'>
                <div className='w-full max-lg:max-w-[34rem] flex-shrink lg:w-fit'>
                    <div className='flex flex-col lg:flex-row justify-center gap-4'>
                        <div className='w-full h-fit sm:max-w-[34rem] lg:w-[34rem] flex flex-col bg-[#f1f5fb] border border-[#00000038] sm:rounded-xl overflow-hidden'>
                            <div className='flex flex-col items-center w-full rounded-b-xl bg-white shadow-[0_1px_5px_0_rgba(0,0,0,0.22)]'>
                                <QuestionContent
                                    question={question}
                                    userName={question?.user_id ? users[question.user_id] : undefined}
                                />
                                {!!concepts?.length && (
                                    <QuestionSection
                                        title='Definitions'
                                        content={(
                                            <>
                                                {concepts.map((concept) => (
                                                    !concept?.definition ? null : (
                                                        <div key={concept?.concept} className='text-sm mt-4'>
                                                            <p className='mb-1 font-bold'>{concept?.concept}</p>
                                                            <p className='text-[#4d6473]'>{concept?.definition}</p>
                                                        </div>
                                                    )
                                                ))}
                                            </>
                                        )}
                                    />
                                )}
                                {!!objectives?.length && (
                                    <QuestionSection
                                        title='Learning Objectives'
                                        className='lg:hidden'
                                        content={(
                                            <div className='text-sm mt-4'>
                                                <ul className='list-disc ml-4 text-[#4d6473]'>
                                                    {objectives?.map((objective, index) => <li key={index} className='mb-2'>{objective?.text}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                    />
                                )}
                            </div>
                            {!!answers?.length && (
                                <div className='mb-2 px-3 flex flex-col items-center'>
                                    <AnswerCard
                                        answer={answers[0]}
                                        userName={answers[0]?.user_id ? users[answers[0]?.user_id] : undefined}
                                    />
                                </div>
                            )}
                        </div>
                        {!!objectives?.length && <LearningObjectives objectives={objectives} />}
                    </div>
                </div>
            </main>
        </>
    )
}

const getStructuredData = (data: LoaderData) => {
    const {
        question,
        answers,
        internalAnswers,
        canonical,
        users,
        structuredData
    } = data;

    const questionBody = structuredData?.questionText;
    const questionTitle = questionBody;
    if (!questionBody) return [];

    const askedBy = getUser(question?.user_id, users);

    const getAnswer = (index: number) => {
        return internalAnswers?.[index] ?? answers?.[index];
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
                    "text": structuredData?.verifiedAnswer,
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
                        "text": structuredData?.verifiedAnswer,
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
            "answerCount": 1,
            "datePublished": question?.created_at,
            "author": {
                "@type": "Person",
                "name": askedBy,
            },
            "acceptedAnswer": {
                "@type": "Answer",
                "text": structuredData?.verifiedAnswer,
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