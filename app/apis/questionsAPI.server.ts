import {
    IAnswer,
    IConcept,
    IInternalAnswer,
    IInternalQuestion, IObjective,
    IQuestion, IQuestionAttachment,
    IQuestionInfo,
    IQuestionsResponse,
    ISubjectFilter,
    IUser,
    QuestionClass
} from "~/models/questionModel";
import AxiosServerInstance, {
    paramsSerializerComma,
    RequestConfigCustomize
} from "~/interceptors/http-interceptors.server";
import { ATTACHMENTS_BASE, CONTENT_CLUSTER, USERS_CLUSTER } from "~/config/enviroment.server";
import axios, { AxiosRequestConfig } from "axios";

export async function getQuestionById(id: string): Promise<IQuestion> {
   const response = await AxiosServerInstance.get<IQuestion>(`${CONTENT_CLUSTER}/questions/${id}`);
   return response?.data;
}

export async function getRelatedQuestionById(id: string, config?: AxiosRequestConfig) {
  const response = await AxiosServerInstance.get<{ data: IQuestion[], page: number, size: number, count: number}>(`${CONTENT_CLUSTER}/questions/${id}/related`, config);
  return response?.data;
}

export async function getQuestionsById(config: AxiosRequestConfig): Promise<IQuestion[]> {
    const response = await AxiosServerInstance.get<IQuestion[]>(`${CONTENT_CLUSTER}/questions`, {
        ...config,
        paramsSerializer: paramsSerializerComma,
    });
    return response?.data;
}

export async function getQuestionsByIdV1(config: AxiosRequestConfig): Promise<IQuestionsResponse> {
    const response = await AxiosServerInstance.get<IQuestionsResponse>(`${CONTENT_CLUSTER}/v1/questions`, {
        ...config,
        paramsSerializer: paramsSerializerComma,
    });

    return response?.data;
}

export async function getQuestionsInfo(config: AxiosRequestConfig): Promise<IQuestionInfo[]> {
    const response = await AxiosServerInstance.get<IQuestionInfo[]>(`${CONTENT_CLUSTER}/questions/info`, {
        ...config,
        paramsSerializer: paramsSerializerComma,
    });
    return response.data
}

export async function getQuestionAttachments(id: string, config?: AxiosRequestConfig): Promise<IQuestionAttachment[]> {
    const response = await AxiosServerInstance.get<IQuestionAttachment[]>(`${CONTENT_CLUSTER}/questions/${id}/attachments`, config);
    return response?.data?.map(file => ({ ...file, url: `${ATTACHMENTS_BASE}/${file?.key}` }));
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


export async function getLatestAddedQuestions(config?: AxiosRequestConfig){
    const response = await AxiosServerInstance.get<IQuestion[]>(`${CONTENT_CLUSTER}/questions/latest`, config);
    return response?.data;
}

export async function getSubjectsFilter(): Promise<ISubjectFilter[]> {
    const response = await axios.get<ISubjectFilter[]>(`${CONTENT_CLUSTER}/topics`);
    return response.data;
}
