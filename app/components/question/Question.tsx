import QuestionType from "~/components/question/QuestionType";
import {AnswerStatus, IUser} from "~/models/questionModel";
import SanitizedText from "~/components/question/SanitizedText";
import React from "react";

interface Props {
    questionBody: string;
    user?: IUser;
    createdAt?: string;
    slug?: string;
    isLoggedIn?: boolean;
    answerStatuses?: AnswerStatus[];
    answerCount?: number;
    correctAnswer?: string;
    topic?: string,
    options?: {
        choice_text: string;
        id: number;
        is_correct: number;
    }[]
}

export default function Question({
                                     user,
                                     questionBody,
                                     correctAnswer,
                                     createdAt,
                                     slug,
                                     isLoggedIn,
                                     answerStatuses,
                                     answerCount,
                                     options,
                                     topic
                                 }: Props) {
    return (
        <div className='w-full h-fit border border-[#99a7af] rounded-lg p-3.5 bg-white shadow-md'>
            <SanitizedText html={questionBody}/>
            {(!!answerStatuses?.length && !!answerCount) && (
                <>
                    <div className='flex items-center justify-end'>
                        <h2>
                            <QuestionType
                                answerCount={answerCount}
                                answerStatuses={answerStatuses}
                            />
                        </h2>
                    </div>
                </>
            )}
            {(options && options?.length > 0) && <hr className='my-4 border-[#99a7af]'/>}
            {
                (options && options?.length > 0) &&
                options?.map(option =>
                    <div key={option.id} className={"rounded-xl border border-[#99a7af] p-4 mb-2"}>
                        {option.choice_text}
                    </div>
                )
            }
            {   correctAnswer &&
                <div className={"mt-6"}>
                    <p className={"font-bold"}>Correct Answer:</p>
                    <p>{correctAnswer}</p>
                </div>
            }

            <div className={"flex items-center justify-between mt-6"}>
                {   topic &&
                    <h2 className={"bg-[#e9ecf2] text-[#001547] rounded-xl py-1 px-2 text-sm"}><strong>Topic:</strong> {topic} </h2>
                }
                <div className={"ml-auto flex gap-1"}>
                    <img src='/assets/images/verified.svg' alt='verifed' />
                    <span className={"font-bold text-[#25b680]"}>Verified</span>
                </div>
            </div>
        </div>
    )
}