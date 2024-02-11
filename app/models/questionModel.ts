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

    static usersExtraction (users: User[]): Users {
        let usersObject: Users = {};
        for (const user of users) {
            if (user?.user_id && user?.view_name) {
                usersObject[user.user_id] = user.view_name
            }
        }

        return usersObject;
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

export interface User {
    view_name: string,
    user_id: number
}

export interface Users {
    [user_id: number]: string,
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
    created_at: string
}