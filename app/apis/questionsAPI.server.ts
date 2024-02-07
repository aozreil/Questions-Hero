import {Answer, Question, User} from "~/models/questionModel";
import {getBaseUrl} from "~/utils/main.server";

const BASE_URL = getBaseUrl();

export async function getQuestionById(id: string): Promise<Question> {
    try {
        const response = await fetch(`${BASE_URL}/api/content/questions/${id}`);
        const data: Question = await response.json();
        return Question.questionExtraction(data);
    } catch (e) {
        console.log(e);
        return {};
    }
}

export async function getAnswerById(id: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/content/answers/question/${id}`);
        const data: Answer[] = await response.json();
        return data?.map(answer => Question.answerExtraction(answer));
    } catch (e) {
        console.log(e);
        return [];
    }
}

export async function getUsersInfo(ids: number[]) {
    try {
        const response = await fetch(`${BASE_URL}/api/users/users/public?ids=${ids?.join()}`);
        const data: User[] = await response.json();
        return Question.usersExtraction(data);
    } catch (e) {
        console.log(e);
        return [];
    }
}


