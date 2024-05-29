import axios, { AxiosRequestConfig } from "axios";
import { ASKGRAM_BASE } from "~/config/enviromenet";
import { SearchQuestionResponse } from "~/models/searchModel";

export async function searchQuestionsAPI(term: string) {
  const res =  await axios.post<{ data: SearchQuestionResponse[] }>(`${ASKGRAM_BASE}/api/search/askgram/search/questions?size=5`, {
    term,
  });
  return res.data
}

export async function getUniversities(config?: AxiosRequestConfig) {
  const response = await axios.get<
    { data: { universities: {id: number; name: string}[] } }
  >(`${ASKGRAM_BASE}/api/search/askgram/universities/autocomplete`, {
    ...config,
    withCredentials: true,
  });
  return response?.data;
}

export async function getMajors(config?: AxiosRequestConfig) {
  const response = await axios.get<
    { data: { studyFields: {id: number; name: string}[] } }
  >(`${ASKGRAM_BASE}/api/search/askgram/study-fields/autocomplete`, {
    ...config,
    withCredentials: true,
  });
  return response?.data;
}