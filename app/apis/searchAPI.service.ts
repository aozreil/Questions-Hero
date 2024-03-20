import axios from "axios";
import { SEARCH_CLUSTER } from "~/config/enviroment.server";
import { getQuestionsById, getQuestionsInfo } from "~/apis/questionsAPI.server";

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


  const questionIds = searchResponse.data.map(el => el.id);

  let questionMapper: { [key: string]: string } = {};
  let questionInfoMapper: { [key: string]: { answers_count: number } } = {};

  const handleQuestionDetails = async () => {
    const questionDetails = await getQuestionsById({ params: { ids: questionIds }})
    questionDetails?.forEach((question) => questionMapper[question.id] = question.slug );
  }

  const handleQuestionsInfo = async () => {
    const questionInfo = await getQuestionsInfo({ params: { ids: questionIds }});
    questionInfo?.forEach((question) => questionInfoMapper[question.id] = { answers_count: question?.answers_count } );
  }

  await Promise.allSettled([handleQuestionDetails(), handleQuestionsInfo()]);

  return {
    data: searchResponse.data.map(question => ({
      ...question,
      slug: questionMapper.hasOwnProperty(question.id) ? questionMapper[question.id] : question.id,
      answerCount: questionInfoMapper.hasOwnProperty(question.id) ? questionInfoMapper[question.id]?.answers_count : undefined,
    })),
    count: searchResponse.count
  }
}

export async function searchQuestionsAPI(term: string) {
  const res =  await axios.post<SearchResponseInterface>(`${SEARCH_CLUSTER}/askgram/search/questions`, { term });
  return res.data
}