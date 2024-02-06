import moment from "moment";

export class Question {
    static questionExtraction (question?: Question) {
        return {
            ...question,
            created_at_string: question?.created_at ? moment(question?.created_at).format('Do MMM YYYY') : undefined,
        }
    }

    static answerExtraction (answer?: Answer) {
        return {
            ...answer,
            created_at_string: answer?.created_at ? moment(answer?.created_at).format('MM/DD/YYYY') : undefined,
        }
    }
}

export interface Answer {
    text?: string,
    user_id?: number,
    answer_steps?: {
        text?: string,
        step_number?: number
    }[],
    created_at?: string,

    // derived props
    created_at_string?: string,
}

export interface Question {
    id?: string,
    user_id?: number,
    text?: string,
    type?: string,
    slug?: string,
    learning_objectives?: string,
    concepts?: {
        concept?: string,
        definition?: string,
    }[],
    created_at?: string,
    error?: string;

    // derived props
    created_at_string?: string,
}