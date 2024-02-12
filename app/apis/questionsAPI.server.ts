import {IAnswer, IInternalAnswer, IInternalQuestion, IQuestion, IUser, QuestionClass} from "~/models/questionModel";
import AxiosInstance, {RequestConfigCustomize} from "~/interceptors/http-interceptors";
import { BASE_URL } from "~/utils/enviroment.server";

export async function getQuestionById(id: string): Promise<IQuestion> {
    try {
        const response = await AxiosInstance.get<IQuestion>(`${BASE_URL}/api/content/questions/${id}`);
        return QuestionClass.questionExtraction(response?.data);
    } catch (e) {
        console.log(e);
        return {};
    }
}

export async function getAnswerById(id: string) {
    try {
        const response = await AxiosInstance.get<IAnswer[]>(`${BASE_URL}/api/content/answers/question/${id}`);
        return response?.data?.map(answer => QuestionClass.answerExtraction(answer));
    } catch (e) {
        console.log(e);
        return [];
    }
}

export async function getUsersInfo(ids: number[]) {
    try {
        const response = await AxiosInstance.get<IUser[]>(`${BASE_URL}/api/users/users/public?ids=${ids?.join()}`);
        return QuestionClass.usersExtraction(response?.data);
    } catch (e) {
        console.log(e);
        return [];
    }
}

export async function getInternalQuestion (
    questionId: string,
    config?: RequestConfigCustomize,
) {
    if (!global.BASIC_AUTH_VALUE) {
        return {}
    }
    try {
        const response = await AxiosInstance.get<IInternalQuestion>(
            `${BASE_URL}/api/content/internal/questions/${questionId}`,
            {
                ...config,
                headers: {
                    ...config?.headers,
                    "web-version": global.WEB_VERSION,
                },
                auth: {
                    username: 'askgram',
                    password: global.BASIC_AUTH_VALUE,
                },
            });
        return response.data;
    } catch (e) {
        console.log(e);
        return {}
    }
}

export async function getInternalAnswers (
    questionId: string,
    config?: RequestConfigCustomize,
) {
    if (!global.BASIC_AUTH_VALUE) {
        return [];
    }
    try {
        const response = await AxiosInstance.get<IInternalAnswer[]>(
            `${BASE_URL}/api/content/internal/questions/${questionId}/answer`,
            {
                ...config,
                headers: {
                    ...config?.headers,
                    "web-version": global.WEB_VERSION,
                },
                auth: {
                    username: 'askgram',
                    password: global.BASIC_AUTH_VALUE,
                },
            });
        return response.data;
    } catch (e) {
        console.log(e);
        return [];
    }
}

