import {
    IAnswer,
    IConcept,
    IInternalAnswer,
    IInternalQuestion, IObjective,
    IQuestion,
    IUser,
    QuestionClass
} from "~/models/questionModel";
import AxiosServerInstance, {RequestConfigCustomize} from "~/interceptors/http-interceptors.server";
import {CONTENT_CLUSTER, USERS_CLUSTER} from "~/config/enviroment.server";

export async function getQuestionById(id: string): Promise<IQuestion> {
   const response = await AxiosServerInstance.get<IQuestion>(`${CONTENT_CLUSTER}/questions/${id}`);
   return response?.data;
}

export async function getQuestionConcepts(id: string): Promise<IConcept[]> {
    const response = await AxiosServerInstance.get<IConcept[]>(`${CONTENT_CLUSTER}/questions/${id}/concepts`);
    return response?.data;
}

export async function getQuestionObjectives(id: string): Promise<IObjective[]> {
    const response = await AxiosServerInstance.get<IObjective[]>(`${CONTENT_CLUSTER}/questions/${id}/objectives`);
    return response?.data?.length ? response.data : [];
}

export async function getAnswerById(id: string): Promise<IAnswer[]> {
    const response = await AxiosServerInstance.get<IAnswer[]>(`${CONTENT_CLUSTER}/answers/question/${id}`);
    return response?.data;
}

export async function getUsersInfo(ids: number[]) {
    const response = await AxiosServerInstance.get<IUser[]>(`${USERS_CLUSTER}/users/public?ids=${ids?.join()}`);
    return QuestionClass.usersExtraction(response?.data);
}

export async function getInternalQuestion (
    questionId: string,
    isBot: boolean,
    config?: RequestConfigCustomize,
) {
    if (!global.BASIC_AUTH_VALUE || !isBot) {
        return {}
    }
    try {
        const response = await AxiosServerInstance.get<IInternalQuestion>(
            `${CONTENT_CLUSTER}/internal/questions/${questionId}`,
            {
                ...config,
                auth: {
                    username: 'askgram',
                    password: global.BASIC_AUTH_VALUE,
                },
            });
        return response.data;
    } catch (e) {
        console.error(e);
        return {}
    }
}

export async function getInternalAnswers (
    questionId: string,
    isBot: boolean,
    config?: RequestConfigCustomize,
) {
    if (!global.BASIC_AUTH_VALUE || !isBot) {
        return [];
    }
    try {
        const response = await AxiosServerInstance.get<IInternalAnswer[]>(
            `${CONTENT_CLUSTER}/internal/questions/${questionId}/answer`,
            {
                ...config,
                auth: {
                    username: 'askgram',
                    password: global.BASIC_AUTH_VALUE,
                },
            });
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
}

export function handleError (e: any, defaultValue: any) {
    console.error(e);
    return defaultValue;
}
