import axios from "axios";
import { IAnswer, IPostQuestion, IUser } from "~/models/questionModel";
import { ASKGRAM_BASE } from "~/config/enviromenet";
import { axiosApiInstance } from "~/interceptors/client-interceptors";

export async function clientGetAnswer (id: string) {
  const response = await axios.get<IAnswer[]>(`${ASKGRAM_BASE}/api/content/answers/question/${id}`);
  return response?.data;
}

export async function clientGetUsers (ids: number[]) {
  const response = await axios.get<IUser[]>(`${ASKGRAM_BASE}/api/users/users/public?ids=${ids?.join()}`);
  return response?.data;
}

export async function postQuestion (questionBody: string) {
  const response = await axiosApiInstance.post<IPostQuestion>(`${ASKGRAM_BASE}/api/content/questions`, {
    question_body: questionBody,
  }, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return response?.data;
}

export async function postAnswer (answerBody: string, questionId: string) {
  const response = await axiosApiInstance.post<IUser[]>(`${ASKGRAM_BASE}/api/content/answers`, {
    answer_body: answerBody,
    question_id: questionId,
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
    key: string,
  }[],
) {
  const response = await axiosApiInstance.post(`${ASKGRAM_BASE}/api/content/storage/attachments/pre-signed-url`, {
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

export async function uploadFile (preSignedUrl: string, file: File) {
  const response = await axios.put(preSignedUrl, file);
  return response.data;
}