import {
    IAnswer,
    IConcept,
    IInternalAnswer,
    IInternalQuestion, IObjective,
    IQuestion,
    IUser,
    QuestionClass
} from "~/models/questionModel";
import AxiosInstance, {RequestConfigCustomize} from "~/interceptors/http-interceptors";
import {CONTENT_CLUSTER, USERS_CLUSTER} from "~/utils/enviroment.server";

export async function getQuestionById(id: string): Promise<IQuestion> {
    try {
        const response = await AxiosInstance.get<IQuestion>(`${CONTENT_CLUSTER}/questions/${id}`);
        return QuestionClass.questionExtraction(response?.data);
    } catch (e) {
        console.log(e);
        return {};
    }
}

export async function getQuestionConcepts(id: string): Promise<IConcept[]> {
    try {
        const response = await AxiosInstance.get<IConcept[]>(`${CONTENT_CLUSTER}/questions/${id}/concepts`);
        return response?.data?.length ? response.data : [];
    } catch (e) {
        console.log(e);
        return [];
    }
}

export async function getQuestionObjectives(id: string): Promise<IObjective[]> {
    try {
        const response = await AxiosInstance.get<IObjective[]>(`${CONTENT_CLUSTER}/questions/${id}/objectives`);
        return response?.data?.length ? response.data : [];
    } catch (e) {
        console.log(e);
        return [];
    }
}

export async function getAnswerById(id: string) {
    try {
        const response = await AxiosInstance.get<IAnswer[]>(`${CONTENT_CLUSTER}/answers/question/${id}`);
        return response?.data?.map(answer => QuestionClass.answerExtraction(answer));
    } catch (e) {
        console.log(e);
        return [];
    }
}

export async function getUsersInfo(ids: number[]) {
    try {
        const response = await AxiosInstance.get<IUser[]>(`${USERS_CLUSTER}/users/public?ids=${ids?.join()}`);
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
            `${CONTENT_CLUSTER}/internal/questions/${questionId}`,
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
            `${CONTENT_CLUSTER}/internal/questions/${questionId}/answer`,
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

