import moment from "moment";

export class Question {
    static questionExtraction (question?: Question) {
        return {
            ...question,
            created_at_string: question?.created_at ? moment(question?.created_at).format('MMM Do, YYYY') : undefined,
        }
    }

    static answerExtraction (answer?: Answer) {
        return {
            ...answer,
            created_at_string: answer?.created_at ? getAnswerDate(answer.created_at) : undefined,
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

const getAnswerDate = (createdAt: string) => {
    const selectedDate = moment(createdAt);
    const today = moment();
    const difference = today.diff(selectedDate, 'days');

    if (difference <= 7) {
        return selectedDate.fromNow();
    } else if (difference <= 14) {
        return 'week ago';
    } else if (difference <= 21) {
        return '2 weeks ago';
    } else if (difference <= 28) {
        return '3 weeks ago';
    } else {
        return selectedDate.format('MMM Do, YYYY')
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