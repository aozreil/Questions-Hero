import axios from "axios";
import { SEARCH_CLUSTER } from "~/config/enviroment.server";

export interface SearchQuestionResponse {
  "id": string,
  "text": string,
  "user_id": number
}

interface SearchResponseInterface {
  "banners": {
    "source": string,
    "source_url": string,
  }[],
  "count": number,
  "data": SearchQuestionResponse[],
  "page": number
  "size": number
  "subjectsCounts": {
    "additionalProp1": number
    "additionalProp2": number
    "additionalProp3": number
  },
  "term": string,
  "uuid": string,
}

export function searchQuestionsAPI(term: string) {
  return axios.post<SearchResponseInterface>(`${SEARCH_CLUSTER}/askgram/search/questions`, { term });
}