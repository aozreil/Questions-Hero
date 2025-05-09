import axios, { AxiosRequestConfig } from "axios";
import { SITE_BASE } from "~/config/enviromenet";
import { OCRSearchResponseInterface, SearchQuestionResponse } from "~/models/searchModel";
import { getSearchResultsWithDetails } from "~/apis/searchAPI.service";

export async function searchQuestionsAPI(term: string) {
  const res =  await axios.post<{ data: SearchQuestionResponse[] }>(`${SITE_BASE}/api/search/asklix/search/questions?size=5`, {
    term,
  });
  return res.data
}

export async function searchByImage(recaptchaToken: string, config?: AxiosRequestConfig): Promise<OCRSearchResponseInterface> {
  const res =  await axios.post<OCRSearchResponseInterface>
    (`${SITE_BASE}/api/search/asklix/image/search`, {
      recaptcha_token: recaptchaToken,
    }, { ...config });

  if (res?.data) {
    const searchData = await getSearchResultsWithDetails(res?.data, true);
    return {
      ...res.data,
      ...searchData,
    }
  }

  return res.data;
}

export async function getUniversities(config?: AxiosRequestConfig) {
  const response = await axios.get<
    { data: { universities: {id: number; name: string}[] } }
  >(`${SITE_BASE}/api/search/asklix/universities/autocomplete`, {
    ...config,
    withCredentials: true,
  });
  return response?.data;
}

export async function getMajors(config?: AxiosRequestConfig) {
  const response = await axios.get<
    { data: { studyFields: {id: number; name: string}[] } }
  >(`${SITE_BASE}/api/search/asklix/study-fields/autocomplete`, {
    ...config,
    withCredentials: true,
  });
  return response?.data;
}