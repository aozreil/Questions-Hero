import axios from "axios";
import { ASKGRAM_BASE } from "~/config/enviromenet";
import { SearchQuestionResponse } from "~/models/searchModel";

export async function searchQuestionsAPI(term: string) {
  const res =  await axios.post<{ data: SearchQuestionResponse[] }>(`${ASKGRAM_BASE}/api/search/askgram/search/questions?size=5`, {
    term,
  });
  return res.data
}

export async function searchByImage(imageUrl: string, recaptchaToken: string) {
  const res =  await axios.post<{ data: { ocr_result: string, answer: string } }>
    (`${ASKGRAM_BASE}/api/search/askgram/image/analyze?imageUrl=${imageUrl}`, {
      recaptcha_token: recaptchaToken,
    });
  return res.data;
}