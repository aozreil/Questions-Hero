import { HeadersFunction, json, MetaFunction } from "@remix-run/node";
import AnswerCard from "~/components/question/AnswerCard";
import QuestionSection from "~/components/question/QuestionSection";
import LearningObjectives from "~/components/question/LearningObjectives";
import { useCallback, useState } from "react";
import ExpandImage from "~/components/question/ExpandImage";
import {
  getAnswerById,
  getInternalAnswers,
  getInternalQuestion,
  getQuestionById,
  getQuestionConcepts,
  getQuestionObjectives,
  getUsersInfo,
} from "~/apis/questionsAPI.server";
import { redirect, useLoaderData, useRevalidator } from "@remix-run/react";
import {
    answersSorterFun,
    IAnswer,
    IConcept,
    IInternalAnswer,
    IInternalQuestion,
    IObjective,
    IQuestion,
    IUsers,
    QuestionClass
} from "~/models/questionModel";
import QuestionContent from "~/components/question/QuestionContent";
import { getSeoMeta } from "~/utils/seo";
import { getUser } from "~/utils";
import { BASE_URL } from "~/config/enviromenet";
import { isbot } from "isbot";
import invariant from "tiny-invariant";
import { getKatexLink } from "~/utils/external-links";
import { getCleanText } from "~/utils/text-formatting-utils";
import { LoaderFunctionArgs } from "@remix-run/router";
import UserProfile from "~/components/UI/UserProfile";
import { useAuth } from "~/context/AuthProvider";
import PostAnswerModal from "~/components/UI/PostAnswerModal";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    if(!data){
        return [];
    }
    const { canonical, question, structuredData } = data;
    return [
        ...getSeoMeta({
            title: question?.title ?? question?.text,
            description: structuredData?.verifiedAnswer,
            canonical,
        }),
        ...getStructuredData(data as LoaderData),
        ...[ question?.includesLatex ? getKatexLink() : {} ],
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
            getAnswerById(id).catch(() => []),
            getQuestionConcepts(id).catch(() => []),
            getQuestionObjectives(id).catch(() => []),
            getInternalQuestion(id, isBot, { req: request }),
            getInternalAnswers(id, isBot, { req: request })
        ]);

        if (question?.error) return redirect('/');
        if (question?.slug?.includes('-') && question?.slug !== slug) return redirect(`/question/${question?.slug}`);

        const userIds = [];
        if (question?.user_id) userIds.push(question.user_id);
        for (const answer of answers) {
            if (answer?.user_id) userIds.push(answer.user_id)
        }
        const users = userIds?.length ? await getUsersInfo(userIds).catch(() => []) : [];

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

        const sortedAnswer = answers?.sort(answersSorterFun)
        
        return json({
            question: QuestionClass.questionExtraction(question),
            answers: sortedAnswer?.map((answer: IAnswer | undefined) => QuestionClass.answerExtraction(answer)),
            concepts,
            objectives,
            users,
            canonical,
            internalQuestion,
            internalAnswers,
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
    const [postAnswerOpened, setPostAnswerOpened] = useState(false);
    const {question, answers, users, concepts, objectives} = useLoaderData<typeof loader>() ;
    const { user } = useAuth();
    const revalidator = useRevalidator();

    const handlePostAnswerSuccess = useCallback(() => {
        revalidator.revalidate();
        setPostAnswerOpened(false);
    }, [])

    return (
        <>
            <PostAnswerModal
              open={postAnswerOpened}
              onClose={() => setPostAnswerOpened(false)}
              questionText={question?.text}
              questionId={question?.id}
              onSuccess={handlePostAnswerSuccess}
            />
            <ExpandImage expandedImage={expandedImage} onClose={() => setExpandedImage(undefined)} />
            <main className='sm:container max-xs:mx-0 w-full h-fit flex flex-col items-center sm:pt-4 sm:py-4 sm:px-4'>
                <div className='w-full max-lg:max-w-[34rem] flex-shrink lg:w-fit'>
                    <div className='flex flex-col lg:flex-row justify-center gap-4'>
                        <div className='w-full h-fit sm:max-w-[34rem] lg:w-[34rem] flex flex-col bg-[#f1f5fb] sm:border sm:border-[#00000038] sm:rounded-xl overflow-hidden'>
                            <div className='flex flex-col items-center w-full rounded-b-xl bg-white shadow-[0_1px_5px_0_rgba(0,0,0,0.22)]'>
                                <QuestionContent
                                    question={question}
                                    user={question?.user_id ? users[question.user_id] : undefined}
                                />
                                {!!concepts?.length && (
                                    <QuestionSection
                                        title='Definitions'
                                        content={(
                                            <>
                                                {concepts?.map((concept) => (
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
                                {user && (
                                  <div
                                    className='w-full p-4 border-t-[3px] border-[#ebf2f6] cursor-pointer'
                                    onClick={() => setPostAnswerOpened(true)}
                                  >
                                      <div className='bg-[#f7fbff] border border-[#99a7af] rounded-xl p-1.5 flex justify-between items-center'>
                                          <div className='flex space-x-2.5 items-center'>
                                              <UserProfile user={user} className='w-7 h-7 border-none' />
                                              <p className='text-[#4d6473]'>Add your answer</p>
                                          </div>
                                          <img src='/assets/images/right-arrow.svg' alt='arrow' className='w-4 h-4 mr-2' />
                                      </div>
                                  </div>
                                )}
                            </div>
                            {!!answers?.length && (
                                <div className='mb-2 mt-3 px-3 flex flex-col items-center space-y-2.5'>
                                    {answers?.map(answer => (
                                      <AnswerCard
                                        key={answer.created_at}
                                        answer={answer}
                                        user={answer?.user_id ? users[answer?.user_id] : undefined}
                                      />
                                    ))}
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