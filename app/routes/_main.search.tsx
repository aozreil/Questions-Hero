import { json, MetaFunction } from "@remix-run/node";
import { searchQuestionsDetailsAPI } from "~/apis/searchAPI.service";
import SuccessAlert from "~/components/UI/SuccessAlert";
import { Suspense, useEffect, useState } from "react";
import SearchQuestion from "~/components/question/SearchQuestion";
import Loader from "~/components/UI/Loader";
import CloseModal from "~/components/icons/CloseModal";
import { getKatexLink } from "~/utils/external-links";
import { AI_ANSWER_ACCEPTED_SCORE, BASE_URL } from "~/config/enviromenet";
import { getSeoMeta } from "~/utils/seo";
import { Await, defer, useLoaderData, useLocation, useNavigation, useSearchParams } from "@remix-run/react";
import EmptyResultsSearch from "~/components/UI/EmptyResultsSearch";
import { LoaderFunctionArgs } from "@remix-run/router";
import { useAnalytics } from "~/hooks/useAnalytics";
import { useOverlay } from "~/context/OverlayProvider";
import { ISearchQuestion } from "~/models/questionModel";

export const meta: MetaFunction<typeof loader> = ({ location }) => {
  const params = new URLSearchParams(location.search);
  const query = params.get("term");
  let title = "Search | AskGram";
  if (query?.trim()) {
    title = `Search results of ${query}`;
  }

  return [
    ...getSeoMeta({
      title: title,
      canonical: `${BASE_URL}/search`
    }),
    ...getKatexLink()
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("term");
  if (!query) {
    return json({ data: { data: [], count: 0 } });
  }

  return defer({
    data: searchQuestionsDetailsAPI(query)
  });
}

export default function SearchPage() {
  const { data } = useLoaderData<typeof loader>();
  const [showVerifiedAnswer, setShowVerifiedAnswer] = useState(true);
  const navigation = useNavigation();
  const isLoadingData = navigation.state === 'loading' && navigation.location?.pathname === '/search'
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('term');
  const { trackEvent } = useAnalytics();
  const { overlayVisible } = useOverlay();
  const location = useLocation();

  useEffect(() => {
    const search_term = searchParams.get('term');
    if (search_term) {
      trackEvent("search", {
        search_term,
      })
    }
  }, [searchParams]);

  const handleAnswerOpen = (questionId: string) => {
    if (window.innerWidth < 1024) return;
    const element = document.getElementById(`q-${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  const getDataWithAiAnswer = (data: ISearchQuestion[]): ISearchQuestion[] => {
    const firstQuestionScore = data?.[0]?.relevant_score;
    const aiAnswer = location?.state?.ai_answer;
    if (!aiAnswer) return data;

    // if first question score is higher than AI_ANSWER_ACCEPTED_SCORE, then AI answer will be merged to it
    if (firstQuestionScore && firstQuestionScore > AI_ANSWER_ACCEPTED_SCORE) {
        data[0].aiAnswer = aiAnswer;
        data[0].answerCount = data[0].answerCount + 1;
        return data;
    } else {
      return [
        {
          id: 'ai-answer',
          text: searchTerm ?? '',
          slug: './',
          answerCount: 1,
          aiAnswer: aiAnswer,
        },
        ...data,
      ]
    }
  }

  return (
    <section
      className={`pb-40 search-page-scroll max-h-[calc(100vh-6rem)] ${overlayVisible ? 'overflow-hidden pr-[12px]' : 'overflow-y-auto'}`}
    >
      <Suspense fallback={
        <SearchLoading />
      }>
        <Await resolve={data} errorElement={
          <EmptyResultsSearch />
        }>
          {isLoadingData ? <SearchLoading /> : (
          ({ data, count }) => {
            const dataWithAiAnswer = getDataWithAiAnswer(data as ISearchQuestion[]);

            return <>
              {dataWithAiAnswer.length === 0 && <>
                <EmptyResultsSearch />
              </>}

              {dataWithAiAnswer.length > 0 && <>
                {showVerifiedAnswer &&
                  <SuccessAlert className='sm:px-0'>
                    <section className={`container aligned-with-search max-sm:px-2 max-md:px-4 max-xl:px-10 w-full flex items-center`}>
                      <img src="/assets/images/verified.svg" alt="verifed" className="mr-3" />
                      <p>Verified Answers: Curated by experts, our search results highlight accurate and detailed
                        information.</p>
                      <button
                        onClick={() => setShowVerifiedAnswer(false)}
                        className="ml-auto">
                        <span className="sr-only">Dismiss</span>
                        <CloseModal colorfill="#667a87" className="w-4 h-4 cursor-pointer" />
                      </button>
                    </section>
                  </SuccessAlert>
                }
                <div className="container aligned-with-search max-sm:px-2 max-md:px-4 max-xl:px-10 w-full mt-4">
                  <p>
                    {count} <span className="font-bold">Result{count > 1 ? "s" : ""} found</span>
                  </p>
                  <div className="pt-4 space-y-4">
                    {dataWithAiAnswer.map((el) => {
                      if(!el){
                        return <></>
                      }
                      return <SearchQuestion
                        key={el.id}
                        question={el}
                        handleAnswerOpen={handleAnswerOpen}
                      />;
                    })}
                  </div>
                </div>
              </>}
            </>;
          })}
        </Await>
      </Suspense>

    </section>
  );
}

const SearchLoading = () => (
  <section className="w-full h-screen pt-16 flex items-start justify-center">
    <Loader className="fill-[#5fc9a2] w-12 h-12" />
  </section>
)