import axios from "axios";
import { SEARCH_CLUSTER } from "~/config/enviroment.server";
import { getQuestionsById } from "~/apis/questionsAPI.server";

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

export async function searchQuestionsDetailsAPI(term: string) {
  const searchResponse = await searchQuestionsAPI(term)
  if(searchResponse.data.length === 0){
    return {
      data: [],
      count: 0
    }
  }
  const questionDetails = await getQuestionsById(searchResponse.data.map(el => el.id).join(','))
  return {
    data: questionDetails.filter(el => el),
    count: searchResponse.count
  }
}

export async function searchQuestionsAPI(term: string) {
  const res =  await axios.post<SearchResponseInterface>(`${SEARCH_CLUSTER}/askgram/search/questions`, { term });
  return res.data
}