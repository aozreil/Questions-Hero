import axios, { AxiosRequestConfig } from "axios";
import { IAnswer, IPostQuestion, IPreSignedURL, IQuestion,
  IQuestionInfo,
  IQuestionsResponse,
  IUser
} from "~/models/questionModel";
import { ASKGRAM_BASE } from "~/config/enviromenet";
import { axiosApiInstance, paramsSerializerComma } from "~/interceptors/client-interceptors";

export async function clientGetAnswer(id: string) {
  const response = await axios.get<IAnswer[]>(`${ASKGRAM_BASE}/api/content/answers/question/${id}`);
  return response?.data;
}

export async function clientGetUsers(ids: number[]) {
  const response = await axios.get<IUser[]>(`${ASKGRAM_BASE}/api/users/users/public?ids=${ids?.join()}`);
  return response?.data;
}

export async function clientGetQuestionsInfo(config: AxiosRequestConfig): Promise<IQuestionInfo[]> {
  const response = await axios.get<IQuestionInfo[]>(`${ASKGRAM_BASE}/api/content/questions/info`, {
    ...config,
    paramsSerializer: paramsSerializerComma
  });
  return response.data;
}

export async function postQuestion(
  htmlBody: string,
  innerText: string,
  recaptchaToken: string | null,
  attachments: { key: string; filename: string }[]
) {
  const response = await axiosApiInstance.post<IPostQuestion>(`${ASKGRAM_BASE}/api/content/questions`, {
    question_body: innerText,
    rendered_body: htmlBody,
    recaptcha_token: recaptchaToken,
    attachments
  }, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  });
  return response?.data;
}

export async function postAnswer(htmlBody: string, innerText: string, questionId: string, recaptchaToken: string | null) {
  const response = await axiosApiInstance.post<IUser[]>(`${ASKGRAM_BASE}/api/content/answers`, {
    answer_body: innerText,
    rendered_body: htmlBody,
    question_id: questionId,
    recaptcha_token: recaptchaToken
  }, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  });
  return response?.data;
}

export async function getPreSignedUrls(
  attachments: {
    filename: string,
  }[]
) {
  const response = await axiosApiInstance.post<IPreSignedURL[]>(`${ASKGRAM_BASE}/api/content/storage/attachments/pre-signed-url`, {
    attachments
  }, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  });
  return response.data;
}

export async function uploadFile(
  preSignedUrl: string,
  file: File | Blob,
  onProgress: (progress?: number) => void,
  config?: AxiosRequestConfig
) {
  const response = await axios.put(preSignedUrl, file, {
    onUploadProgress: progressEvent => onProgress && onProgress(progressEvent.progress),
    ...config
  });
  return response.data;
}

export async function getMyAskedQuestions(config?: AxiosRequestConfig) {
  const response = await axios.get<{
    data: IQuestion[],
    count: number,
    page: number,
    size: number
  }>(`${ASKGRAM_BASE}/api/content/me/questions`, {
    ...config,
    withCredentials: true
  });
  return response?.data;
}

export async function getAskedQuestionsByUserId(id: number, config?: AxiosRequestConfig) {
  const response = await axios.get<{
    data: IQuestion[],
    count: number,
    page: number,
    size: number
  }>(`${ASKGRAM_BASE}/api/content/users/${id}/questions`, {
    ...config,
    withCredentials: true
  });
  return response?.data;
}

export async function getQuestionsById(config: AxiosRequestConfig): Promise<IQuestion[]> {
  const response = await axios.get<IQuestion[]>(`${ASKGRAM_BASE}/api/content/questions`, {
    ...config,
    paramsSerializer: paramsSerializerComma
  });
  return response?.data;
}

export async function getMyAnswersForQuestions(config?: AxiosRequestConfig) {
  const response = await axios.get<{
    data: IAnswer[],
    count: number,
    page: number,
    size: number
  }>(`${ASKGRAM_BASE}/api/content/me/answers`, {
    ...config,
    withCredentials: true
  });
  return response?.data;
}

export async function getUserAnswersForQuestionsByUserId(id: number, config?: AxiosRequestConfig) {
  const response = await axios.get<{
    data: IAnswer[],
    count: number,
    page: number,
    size: number
  }>(`${ASKGRAM_BASE}/api/content/users/${id}/answers`, {
    ...config,
    withCredentials: true
  });
  return response?.data;
}

export async function getMeStats(config?: AxiosRequestConfig) {
  const response = await axios.get<{
    "answers_count": number,
    "questions_count": number
  }>(`${ASKGRAM_BASE}/api/content/me/stats`, {
    ...config,
    withCredentials: true
  });
  return response?.data;
}

export async function getUSerStatsByUserId(id: number, config?: AxiosRequestConfig) {
  const response = await axios.get<{
    "answers_count": number,
    "questions_count": number
  }>(`${ASKGRAM_BASE}/api/content/users/${id}/stats`, {
    ...config,
    withCredentials: true
  });
  return response?.data;
}

export async function postUniversity(
  name: string,
) {
  const response = await axiosApiInstance.post<{ id: number; name: string }>(`${ASKGRAM_BASE}/api/content/universities`, {
    "name": name,
  });
  return response.data;
}

export async function getUniversityById(
  id: number | string,
) {
  const response = await axiosApiInstance.get<{ id: number; name: string }>(`${ASKGRAM_BASE}/api/content/universities/${id}`);
  return response.data;
}

export async function postMajor(
  name: string,
) {
  const response = await axiosApiInstance.post<{ id: number; name: string }>(`${ASKGRAM_BASE}/api/content/study-fields`, {
    "name": name,
  });
  return response.data;
}

export async function getMajorById(
  id: number | string,
) {
  const response = await axiosApiInstance.get<{ id: number; name: string }>(`${ASKGRAM_BASE}/api/content/study-fields/${id}`);
  return response.data;
}

export async function clientGetQuestionsById(config: AxiosRequestConfig): Promise<IQuestion[]> {
  const response = await axios.get<IQuestion[]>(`${ASKGRAM_BASE}/api/content/questions`, {
    ...config,
    paramsSerializer: paramsSerializerComma
  });
  return response?.data;
}

export async function clientGetQuestionsByIdV1(config: AxiosRequestConfig): Promise<IQuestionsResponse> {
  const response = await axios.get<IQuestionsResponse>(`${ASKGRAM_BASE}/api/content/v1/questions`, {
    ...config,
    paramsSerializer: paramsSerializerComma
  });
  return response?.data;
}
