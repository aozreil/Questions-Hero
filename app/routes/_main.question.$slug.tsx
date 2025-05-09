import { ActionFunctionArgs, HeadersFunction, json, LinksFunction, MetaFunction } from "@remix-run/node";
import AnswerCard from "~/components/question/AnswerCard";
import QuestionSection from "~/components/question/QuestionSection";
import LearningObjectives from "~/components/question/LearningObjectives";
import { useCallback, useEffect, useState } from "react";
import {
  getAnswerById,
  getInternalAnswers,
  getInternalQuestion,
  getQuestionAttachments,
  getQuestionById,
  getQuestionConcepts,
  getQuestionObjectives,
  getRelatedQuestionById,
  getUsersInfo
} from "~/apis/questionsAPI.server";
import { redirect, useLoaderData, useLocation } from "@remix-run/react";
import {
  answersSorterFun,
  getQuestionBody,
  AnswerStatus,
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
import { getCleanText, title } from "~/utils/text-formatting-utils";
import { LoaderFunctionArgs } from "@remix-run/router";
import AttachmentsViewer from "~/components/question/AttachmentsViewer";
import RelatedQuestions from "~/components/question/RelatedQuestions";
import Footer from "~/components/UI/Footer";


export const links: LinksFunction = () => {
  return [
    ...getKatexLink()
  ];
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [];
  }
  const { canonical, question, internalAnswers, answers, concepts } = data;
  return [
    ...getSeoMeta({
      title: question?.title ?? question?.text,
      description: internalAnswers?.length ? getAnswerText(getVerifiedAnswer(internalAnswers)) : answers.length ? getAnswerText(getVerifiedAnswer(answers)) : concepts.length ? concepts.map((el) => el ? `${el.concept}: ${el.definition}` : "").join("\n") : question.text,
      canonical
    }),
    ...getStructuredData(data as LoaderData),
    ...data?.attachments?.map(file => ({
      tagName: "link",
      rel: "preload",
      href: file?.url,
      as: "image"
    }))
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

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { slug } = params;
  invariant(slug, "Not Found");

  const isBot = isbot(request.headers.get("user-agent"));
  const id = slug.split("-").pop() || slug;
  try {
    const [
      question,
      answers,
      concepts,
      objectives,
      internalQuestion,
      internalAnswers,
      attachments,
      relatedQuestions
    ] = await Promise.all([
      getQuestionById(id),
      getAnswerById(id).catch(() => []),
      getQuestionConcepts(id).catch(() => []),
      getQuestionObjectives(id).catch(() => []),
      getInternalQuestion(id, isBot, { req: request }),
      getInternalAnswers(id, isBot, { req: request }),
      getQuestionAttachments(id).catch(() => []),
      getRelatedQuestionById(id, {
        params: {
          limit: 5
        }
      }).catch(() => ({ data: [] }))

    ]);

    if (question?.error) return redirect("/");
    if (question?.slug?.includes("-") && question?.slug !== slug) return redirect(`/question/${question?.slug}`);

    const userIds = [];
    if (question?.user_id) userIds.push(question.user_id);
    for (const answer of answers) {
      if (answer?.user_id) userIds.push(answer.user_id);
    }
    const users = userIds?.length ? await getUsersInfo(userIds).catch(() => []) : [];

    const canonical = `${BASE_URL}/question/${question?.slug}`;
    const sortedAnswer = answers?.sort(answersSorterFun);

    return json({
      question: QuestionClass.questionExtraction(question),
      answers: sortedAnswer?.map((answer: IAnswer | undefined) => QuestionClass.answerExtraction(answer)),
      concepts,
      objectives,
      users,
      canonical,
      internalQuestion: { ...internalQuestion, text: getCleanText(internalQuestion?.text) },
      internalAnswers: internalAnswers?.map(answer => ({
        ...answer,
        text: getCleanText(answer?.text),
        answer_steps: answer?.answer_steps?.map(step => ({ ...step, text: getCleanText(step?.text) }))
      })),
      attachments,
      relatedQuestions: relatedQuestions.data.map(el => {
        let text = title(el.text);
        // Only return the first 10 words
        if (el.text.split(" ").length > 10) {
          text = text.split(" ").slice(0, 10).join(" ") + " ...";
        }
        return {
          slug: el.slug,
          text: getCleanText(text),
        };
      }).slice(0, 5)
    });
  } catch (e) {
    console.error(e);
    throw new Response(null, {
      status: 404,
      statusText: "Not Found"
    });
  }
}

export async function action({
                               request
                             }: ActionFunctionArgs) {
  const body = await request.formData();
  return { postedAnswer: body.get("postedAnswer") };
}

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=86400, s-maxage=86400"
});

export default function QuestionPage() {
  const [postAnswerOpened, setPostAnswerOpened] = useState(false);
  const {
    question,
    answers,
    users,
    concepts,
    objectives,
    attachments,
    relatedQuestions
  } = useLoaderData<typeof loader>();
  const [isVerified] = useState(() => !!answers?.find(answer => answer?.answer_status === AnswerStatus.VERIFIED));
  const location = useLocation();

  useEffect(() => {
    if (location.state?.fromSubjectsPage) {
      setTimeout(() => {
        setPostAnswerOpened(true);
        window.history.pushState({}, "", null);
      }, 600);
    }
  }, []);

  const handlePostAnswerSuccess = useCallback(() => {
    setPostAnswerOpened(false);
  }, []);

  return (
    <>
        <main
          className="container max-sm:max-w-full max-sm:mx-0 aligned-with-search max-xs:mx-0 w-full h-fit flex flex-col max-lg:items-center sm:pt-4 sm:py-4">
          <div className="w-full max-lg:max-w-[34rem] flex-shrink lg:w-fit xl:-ml-2">
            <div className="flex flex-col lg:flex-row justify-center gap-4">
              <div
                className="w-full h-fit sm:max-w-[34rem] lg:w-[34rem] flex flex-col bg-[#f1f5fb] sm:border sm:border-[#00000038] sm:rounded-xl overflow-hidden">
                <div
                  className="flex flex-col items-center w-full rounded-b-xl bg-white shadow-[0_1px_5px_0_rgba(0,0,0,0.22)]">
                  <QuestionContent
                    question={question}
                    user={question?.user_id ? users[question.user_id] : undefined}
                    isVerified={isVerified}
                  />
                  <AttachmentsViewer attachments={attachments} />
                  {!!concepts?.length && (
                    <QuestionSection
                      title="Definitions"
                      content={(
                        <>
                          {concepts?.map((concept) => (
                            !concept?.definition ? null : (
                              <div key={concept?.concept} className="text-sm mt-4">
                                <p className="mb-1 font-bold">{concept?.concept}</p>
                                <p className="text-[#4d6473]">{concept?.definition}</p>
                              </div>
                            )
                          ))}
                        </>
                      )}
                    />
                  )}
                  {!!objectives?.length && (
                    <QuestionSection
                      title={"Learning Objectives"}
                      className="lg:hidden"
                      content={(
                        <div className="text-sm mt-4">
                          <ul className="list-disc ml-4 text-[#4d6473]">
                            {objectives?.map((objective, index) => <li key={index}
                                                                       className="mb-2">{objective?.text}</li>)}
                          </ul>
                        </div>
                      )}
                    />
                  )}
                {/*<div*/}
                {/*  className="w-full p-4 border-t-[3px] border-[#ebf2f6] cursor-pointer"*/}
                {/*  onClick={() => {*/}
                {/*    user*/}
                {/*      ? setPostAnswerOpened(true)*/}
                {/*      : openSignUpModal();*/}
                {/*  }}*/}
                {/*>*/}
                {/*  <div*/}
                {/*    className="bg-[#f7fbff] border border-[#99a7af] rounded-xl p-1.5 flex justify-between items-center">*/}
                {/*    <div className="flex space-x-2.5 items-center">*/}
                {/*      {*/}
                {/*        user*/}
                {/*        ? <UserProfile user={user} className="w-7 h-7 border-none" />*/}
                {/*        : <img*/}
                {/*            src='/assets/images/user-profile.png'*/}
                {/*            alt='user-profile'*/}
                {/*            className='w-7 h-7 rounded-full object-contain'*/}
                {/*          />*/}
                {/*      }*/}
                {/*      <p className="text-[#4d6473]">{t("Add your answer")}</p>*/}
                {/*    </div>*/}
                {/*    <img src="/assets/images/right-arrow.svg" alt="arrow" className="w-4 h-4 mr-2" />*/}
                {/*  </div>*/}
                {/*</div>*/}
                </div>
                {!!answers?.length && (
                  <div className="mb-2 mt-3 px-3 flex flex-col items-center space-y-2.5">
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
              <div className="block w-full lg:w-[22rem]">
                {!!objectives?.length &&
                  <div className="hidden lg:block">
                    <LearningObjectives objectives={objectives} />
                  </div>}
                {relatedQuestions?.length > 0 && <RelatedQuestions list={relatedQuestions} />}
              </div>
            </div>
          </div>
        </main>

      <Footer />
    </>
  );
}

const getStructuredData = (data: LoaderData) => {
  const {
    question,
    answers,
    internalAnswers,
    internalQuestion, canonical,
    users,
    concepts
  } = data;

  const questionData = internalQuestion?.text ? internalQuestion : question;
  const answersData = internalAnswers?.length ? internalAnswers : answers;
  if (!questionData?.text) return [];

  const questionBody = getCleanText(questionData?.text);
  const questionTitle = questionBody;
  const questionAskedBy = getUser(question?.user_id, users);
  const verifiedAnswer = getVerifiedAnswer(answersData);
  const suggestedAnswers = filterSuggestedAnswers(answersData).filter(
    question => question?.created_at !== verifiedAnswer?.created_at
  );
  const answerFallback = concepts?.length
    ? getConceptsText(concepts)
    : `The Answer of ${questionBody}`;

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
          "text": verifiedAnswer ? getAnswerText(verifiedAnswer) : answerFallback,
          "url": canonical
        }
      }
    ]
  };

  const getSuggestedAnswers = () => {

    if (suggestedAnswers?.length) {
      return {
        "suggestedAnswer": [
          suggestedAnswers?.map(answer => ({
            "@type": "Answer",
            "text": answer?.text ? getAnswerText(answer) : answerFallback,
            "datePublished": answer?.created_at,
            "author": {
              "@type": "Person",
              "name": getUser(answer?.user_id, users)
            }
          }))
        ]
      };
    }

    return {};
  };

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
        "name": questionAskedBy
      },
      "acceptedAnswer": {
        "@type": "Answer",
        "text": verifiedAnswer ? getAnswerText(verifiedAnswer) : answerFallback,
        "url": `${canonical}#acceptedAnswer`,
        "datePublished": verifiedAnswer?.created_at ?? question?.created_at,
        "author": {
          "@type": "Person",
          "name": getUser(verifiedAnswer?.user_id, users)
        }
      },
      ...getSuggestedAnswers()
    }
  };

  return [
    { "script:ld+json": QAPage },
    { "script:ld+json": Educational }
  ];
};

const getVerifiedAnswer = (answers: IAnswer[] | IInternalAnswer[]) => {
  const verifiedAnswer = answers?.find(answer => answer?.answer_status === AnswerStatus.VERIFIED);
  return verifiedAnswer ?? answers?.[0];
};

const filterSuggestedAnswers = (answers: IAnswer[] | IInternalAnswer[]) => {
  return answers?.filter(answer => answer?.answer_status !== AnswerStatus.VERIFIED);
};

const getAnswerText = (answer: IAnswer | IInternalAnswer) => {
  let answerText = `Final Answer : ${answer?.text}`;
  if (answer?.answer_steps?.length) {
    answerText = answerText + ", Explanation : ";
    for (const step of answer.answer_steps) {
      answerText = answerText + " " + step?.text;
    }
  }

  return getCleanText(answerText);
};

const getConceptsText = (concepts: IConcept[]) => {
  let text = '';
  
  for (const concept of concepts) {
    text = text + `${concept.concept} : ${concept.definition}`;
  }
  
  return text;
}