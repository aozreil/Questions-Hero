import axios, { AxiosRequestConfig } from "axios";
import { IAnswer, IPostQuestion, IPreSignedURL, IQuestionInfo, IUser } from "~/models/questionModel";
import { ASKGRAM_BASE } from "~/config/enviromenet";
import { axiosApiInstance, paramsSerializerComma } from "~/interceptors/client-interceptors";

export async function clientGetAnswer (id: string) {
  const response = await axios.get<IAnswer[]>(`${ASKGRAM_BASE}/api/content/answers/question/${id}`);
  return response?.data;
}

export async function clientGetUsers (ids: number[]) {
  const response = await axios.get<IUser[]>(`${ASKGRAM_BASE}/api/users/users/public?ids=${ids?.join()}`);
  return response?.data;
}

export async function clientGetQuestionsInfo(config: AxiosRequestConfig): Promise<IQuestionInfo[]> {
  const response = await axios.get<IQuestionInfo[]>(`${ASKGRAM_BASE}/api/content/questions/info`, {
    ...config,
    paramsSerializer: paramsSerializerComma,
  });
  return response.data
}

export async function postQuestion (
  htmlBody: string,
  innerText: string,
  recaptchaToken: string | null,
) {
  const response = await axiosApiInstance.post<IPostQuestion>(`${ASKGRAM_BASE}/api/content/questions`, {
    question_body: innerText,
    rendered_body: htmlBody,
    recaptcha_token: recaptchaToken,
  }, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return response?.data;
}

export async function postAnswer (htmlBody: string, innerText: string, questionId: string, recaptchaToken: string | null) {
  const response = await axiosApiInstance.post<IUser[]>(`${ASKGRAM_BASE}/api/content/answers`, {
    answer_body: innerText,
    rendered_body: htmlBody,
    question_id: questionId,
    recaptcha_token: recaptchaToken,
  }, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return response?.data;
}

export async function getPreSignedUrls (
  attachments: {
    filename: string,
  }[],
) {
  const response = await axiosApiInstance.post<IPreSignedURL[]>(`${ASKGRAM_BASE}/api/content/storage/attachments/pre-signed-url`, {
    attachments,
  }, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return response.data;
}

export async function uploadFile (
  preSignedUrl: string,
  file: File,
  onProgress: (progress?: number) => void,
  config?: AxiosRequestConfig,
) {
  const response = await axios.put(preSignedUrl, file, {
    onUploadProgress: progressEvent => onProgress && onProgress(progressEvent.progress),
    ...config,
  });
  return response.data;
}