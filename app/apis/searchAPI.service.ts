import axios from "axios";
import { SEARCH_CLUSTER } from "~/config/enviroment.server";
import { getQuestionsById, getQuestionsInfo } from "~/apis/questionsAPI.server";
import { SearchResponseInterface } from "~/models/searchModel";
import { AnswerStatus } from "~/models/questionModel";

export async function searchQuestionsDetailsAPI(term: string) {
  try {
  const searchResponse = await searchQuestionsAPI(term)
  if(searchResponse.data.length === 0){
    return {
      data: [],
      count: 0
    }
  }

  const questionIds = searchResponse.data.map(el => el.id);
  let questionMapper: { [key: string]: string } = {};
  let questionInfoMapper: { [key: string]: { answers_count: number, answers_statuses: AnswerStatus[] } } = {};

  const handleQuestionDetails = async () => {
    const questionDetails = await getQuestionsById({ params: { ids: questionIds }})
    questionDetails?.forEach((question) => questionMapper[question.id] = question.slug );
  }

  const handleQuestionsInfo = async () => {
    const questionInfo = await getQuestionsInfo({ params: { ids: questionIds }});
    questionInfo?.forEach((question) => questionInfoMapper[question.id] = {
      answers_count: question?.answers_count,
      answers_statuses: question?.answers_statuses,
    });
  }

  await Promise.allSettled([handleQuestionDetails(), handleQuestionsInfo()]);

  return {
    data: searchResponse.data.map(question => ({
      ...question,
      slug: questionMapper.hasOwnProperty(question.id) ? questionMapper[question.id] : question.id,
      answerCount: questionInfoMapper.hasOwnProperty(question.id) ? questionInfoMapper[question.id]?.answers_count : 0,
      answerStatuses: questionInfoMapper.hasOwnProperty(question.id) ? questionInfoMapper[question.id]?.answers_statuses : [],
    })),
    count: searchResponse.count
  }
  } catch (e) {
    console.log(e);
    return { data: [], count: 0 }
  }
}

export async function searchQuestionsAPI(term: string) {
  const res =  await axios.post<SearchResponseInterface>(`${SEARCH_CLUSTER}/askgram/search/questions`, { term });
  return res.data
}