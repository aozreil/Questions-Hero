import {Answer, Question} from "~/models/questionModel";

const BASE_URL = 'https://askgramdev.work';

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
