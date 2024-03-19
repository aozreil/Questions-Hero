import axios from "axios";
import { SEARCH_CLUSTER } from "~/config/enviroment.server";
import { getQuestionsById } from "~/apis/questionsAPI.server";
import { SearchResponseInterface } from "~/models/searchModel";

export async function searchQuestionsDetailsAPI(term: string) {
  const searchResponse = await searchQuestionsAPI(term)
  if(searchResponse.data.length === 0){
    return {
      data: [],
      count: 0
    }
  }
  const questionDetails = await getQuestionsById(searchResponse.data.map(el => el.id).join(','))
  let questionMapper: { [key: string]: string } = {};
  questionDetails?.forEach((question) => questionMapper[question.id] = question.slug )

  return {
    data: searchResponse.data.map(question => ({
      ...question,
      slug: questionMapper.hasOwnProperty(question.id) ? questionMapper[question.id] : question.id
    })),
    count: searchResponse.count
  }
}

export async function searchQuestionsAPI(term: string) {
  const res =  await axios.post<SearchResponseInterface>(`${SEARCH_CLUSTER}/askgram/search/questions`, { term });
  return res.data
}