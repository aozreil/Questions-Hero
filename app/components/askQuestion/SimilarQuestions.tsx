import AskQuestionSearchCard from "~/components/question/AskQuestionSearchCard";
import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import { searchQuestionsAPI } from "~/apis/searchAPI";
import { clientGetQuestionsInfo } from "~/apis/questionsAPI";
import { SearchQuestionResponse } from "~/models/searchModel";
import { IQuestionInfo } from "~/models/questionModel";
import { ASK_QUESTION_SIMILAR_SCORE } from "~/config/dev/enviromenet";

interface Props {
  searchTerm: string;
  setIsDescriptionVisible: (visible: boolean) => void;
  textareaHasValue: boolean;
  setHasExactMatch: (hasExactMatch: boolean) => void;
  setIsSearchingForSimilar: (isSearching: boolean) => void;
}

export default function SimilarQuestions({
   searchTerm, setIsDescriptionVisible, textareaHasValue, setHasExactMatch, setIsSearchingForSimilar
}: Props) {
  const [searchData, setSearchData] = useState<SearchQuestionResponse[]>([]);
  const [searchQuestionsInfo, setSearchQuestionsInfo] = useState<IQuestionInfo[]>([]);

  useEffect(() => {
    if (searchData?.length) {
      if (window.innerWidth < 640) {
        setIsDescriptionVisible(false);
      }
    }
  }, [searchData]);


  useEffect(() => {
    if (!searchTerm) {
      setSearchData([]);
      setSearchQuestionsInfo([]);
      setHasExactMatch(false);
      return;
    }

    (async () => {
      try {
        setIsSearchingForSimilar(true);
        const searchRes = await searchQuestionsAPI(searchTerm)
        if (searchRes?.data) {
          const filteredQuestions = searchRes.data?.filter(
            item => item?.relevant_score > ASK_QUESTION_SIMILAR_SCORE);
          setHasExactMatch(filteredQuestions?.[0]?.relevant_score > 0.9);
          if (filteredQuestions?.length) {
            const questionsInfo = await clientGetQuestionsInfo({ params: { ids: filteredQuestions?.map(question => question?.id) }});
            setSearchQuestionsInfo(questionsInfo);
            setSearchData(filteredQuestions);
          }
        }
      } catch (e) {
        console.log(e);
      }

      setIsSearchingForSimilar(false);
    })()
  }, [searchTerm]);

  return (
    <Transition
      show={!!searchData?.length && textareaHasValue}
      enter='transition-opacity duration-400'
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-400"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {!!searchData?.length && (
        <div className='w-full lg:w-[28rem] xl:w-[35rem] flex flex-col text-white'>
          <div className='flex items-center space-x-3'>
            <img src='/assets/images/search-questions-hi.svg' alt='questions' className='h-[4.1rem]' />
            <div className='flex flex-col'>
              <p className='text-2xl font-bold'>Hi There!</p>
              <p className='text-lg'>We've already got answers to this question.<br /> See them below</p>
            </div>
          </div>
          <div className='w-full flex-col space-y-2 p-2.5 bg-[#1e1e1e] border border-[#99a7af] rounded-xl mt-3 text-black'>
            {searchData.map(el => (
              <AskQuestionSearchCard
                key={el.id}
                text={el.text}
                questionId={el.id}
                slug={el.id}
                questionInfo={searchQuestionsInfo?.find((question => question?.id === el?.id))}
              />
            ))}
          </div>
        </div>
      )}
    </Transition>
  )
}

export async function isThereExactMatch(searchTerm: string) {
  const searchRes = await searchQuestionsAPI(searchTerm)
  if (searchRes?.data) {
    const filteredQuestions = searchRes.data?.filter(
      item => item?.relevant_score > ASK_QUESTION_SIMILAR_SCORE);
    return filteredQuestions?.[0]?.relevant_score > 0.9;
  }
  return false;
}