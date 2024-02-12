export class QuestionClass {
    static questionExtraction (question?: QuestionClass) {
        return {
            ...question,
        }
    }

    static answerExtraction (answer?: IAnswer) {
        return {
            ...answer,
        }
    }

    static usersExtraction (users: IUser[]): IUsers {
        let usersObject: IUsers = {};
        for (const user of users) {
            if (user?.user_id && user?.view_name) {
                usersObject[user.user_id] = user.view_name
            }
        }

        return usersObject;
    }
}

export interface IAnswer {
    text?: string,
    user_id?: number,
    answer_steps?: {
        text?: string,
        step_number?: number
    }[],
    created_at?: string,
}

export interface IQuestion {
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
}

export interface IUser {
    view_name: string,
    user_id: number
}

export interface IUsers {
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