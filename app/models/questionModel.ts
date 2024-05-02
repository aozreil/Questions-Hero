import {
   getCleanText, getTextFormatted,
    isTextIncludingLatex,
    title
} from "~/utils/text-formatting-utils";
import { ATTACHMENTS_BASE } from "~/config/enviromenet";

export class QuestionClass {
    static questionExtraction (question: IQuestion): IQuestion {
        return {
            ...question,
            text: question?.rendered_text
       ? question?.text
       : getTextFormatted(question.text, question?.type),
      rendered_text: getRenderedText(question?.rendered_text),
            title: getCleanText(title(question?.text)),
            includesLatex: isTextIncludingLatex(question?.text),
        }
    }

  static questionTextExtraction(text?: string): string | undefined {
    return text
      ? getRenderedText(text)
      : undefined;
  }

  static answerExtraction (answer?: IAnswer): IAnswer {
        return {
            ...answer,
            text: answer?.rendered_text
        ? answer?.text
        : getTextFormatted(answer?.text),
      rendered_text: getRenderedText(answer?.rendered_text),
            answer_steps: answer?.answer_steps?.map(step => ({
                ...step,
                text: getTextFormatted(step?.text)
            }))
        }
    }

    static usersExtraction (users: IUser[]): IUsers {
        const usersObject: IUsers = {};
        for (const user of users) {
            if (user?.user_id && user?.view_name) {
                usersObject[user.user_id] = user
            }
        }

        return usersObject;
    }
}

export function getQuestionBody (question: IQuestion) {
  return question?.rendered_text ?? question.text ?? '';
}

export function getAnswerBody (answer: IAnswer) {
  return answer?.rendered_text ?? answer.text ?? '';
}

function getRenderedText(text?: string) {
  if (text) {
    return text.replaceAll('$ATTACHMENTS_BASE', ATTACHMENTS_BASE);
  }

  return undefined;
}

export function answersSorterFun (a: IAnswer, b: IAnswer) {
    if (a.answer_status === AnswerStatus.VERIFIED) return -1;
    if (a.answer_status === AnswerStatus.AI_ANSWER) return 0;
    const date1 = a?.created_at ? new Date(a?.created_at) : undefined;
    const date2 = b?.created_at ? new Date(b?.created_at) : undefined;
    if (date1 && date2) {
        return  date1 > date2 ? 1 : -1;
    } else {
        if (date1) return -1;
        if (date2) return 1;
        return 0;
    }
}

export enum AnswerStatus {
    'VERIFIED' = 'VERIFIED',
    'USER_ANSWER' = 'USER_ANSWER',
    'AI_ANSWER' = 'AI_ANSWER',
}

export interface IAnswer {
    text?: string,
    // rendered_text is the html version of the posted user answer
    rendered_text?: string;user_id?: number,
    answer_steps?: {
        text?: string,
        step_number?: number
    }[],
    created_at?: string,
    answer_status?: AnswerStatus,
}

export interface IQuestion {
    id: string,
    user_id?: number,
    text: string,
    // rendered_text is the html version of the posted user question
    rendered_text?: string;type?: string,
    slug: string,
    created_at?: string,
    error?: string;

    // Derived Props
    title?: string;
    includesLatex?: boolean;
    answerCount?: number;
}

export interface IQuestionInfo {
    id: string;
    answers_count: number;
}

export interface ISearchQuestion extends IQuestion {
    // Derived Props
    answerCount: number;
    aiAnswer?: string;
    relevant_score?: number;
    answerStatuses?: AnswerStatus[];
    rendered_text?: string;
}

export interface IQuestionInfo {
    id: string;
    answers_count: number;
    answers_statuses: AnswerStatus[];
}

export interface IConcept {
    concept?: string,
    definition?: string,
}

export interface IObjective {
    text?: string;
}

export interface IUser {
    id?: number;
    view_name?: string;
    user_id?: number;
    picture?: string;
}

export interface IUsers {
    [user_id: number]: IUser,
}

export interface IInternalQuestion {
    id?: string,
    user_id?: number,
    text?: string,
    type?: string,
    slug?: string,
    learning_objectives?: string,
    concepts?: {
        concept: string,
        definition: string
    }[],
    created_at?: string
}

export interface IInternalAnswer {
    text: string,
    user_id: number,
    answer_steps: {
        text: string,
        step_number: number
    }[],
    created_at: string,
    answer_status?: AnswerStatus,
}

export interface IPostQuestion {
    id: string;
    user_id: number;
    text: string;
    type: string;
    slug: string;
    created_at: number;
}

export interface IPreSignedURL {
    pre_signed_url: string;
    key: string;
    filename: string;
}

export interface IQuestionAttachment {
    id: number,
    questionId: string,
    key: string,
    filename: string,

    // Derived Props
    url: string,
}