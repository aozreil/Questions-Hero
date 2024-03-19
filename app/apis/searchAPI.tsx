import axios from "axios";
import { ASKGRAM_BASE } from "~/config/enviromenet";
import { SearchQuestionResponse } from "~/models/searchModel";

export async function searchQuestionsAPI(term: string) {
  const res =  await axios.post<{ data: SearchQuestionResponse[] }>(`${ASKGRAM_BASE}/api/search/askgram/search/questions?size=5`, {
    term,
  });
  return res.data
}