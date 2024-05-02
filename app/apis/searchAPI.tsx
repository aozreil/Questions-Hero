import axios from "axios";
import { ASKGRAM_BASE } from "~/config/enviromenet";
import { OCRSearchResponseInterface, SearchQuestionResponse } from "~/models/searchModel";
import { getSearchResultsWithDetails } from "~/apis/searchAPI.service";

export async function searchQuestionsAPI(term: string) {
  const res =  await axios.post<{ data: SearchQuestionResponse[] }>(`${ASKGRAM_BASE}/api/search/askgram/search/questions?size=5`, {
    term,
  });
  return res.data
}

export async function searchByImage(imageUrl: string, recaptchaToken: string): Promise<OCRSearchResponseInterface> {
  const res =  await axios.post<OCRSearchResponseInterface>
    (`${ASKGRAM_BASE}/api/search/askgram/image/search?imageUrl=${imageUrl}`, {
      recaptcha_token: recaptchaToken,
    });

  if (res?.data) {
    const searchData = await getSearchResultsWithDetails(res?.data, true);
    return {
      ...res.data,
      ...searchData,
    }
  }

  return res.data;
}