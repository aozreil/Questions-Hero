import { json, MetaFunction } from "@remix-run/node";
import { searchQuestionsDetailsAPI } from "~/apis/searchAPI.service";
import SuccessAlert from "~/components/UI/SuccessAlert";
import { Suspense, useState } from "react";
import SearchQuestion from "~/components/question/SearchQuestion";
import Loader from "~/components/UI/Loader";
import CloseModal from "~/components/icons/CloseModal";
import { getKatexLink } from "~/utils/external-links";
import { ASKGRAM_BASE } from "~/config/enviromenet";
import { getSeoMeta } from "~/utils/seo";
import { Await, defer, useLoaderData } from "@remix-run/react";
import EmptyResultsSearch from "~/components/UI/EmptyResultsSearch";
import { LoaderFunctionArgs } from "@remix-run/router";
import { getTextFormatted } from "~/utils/text-formatting-utils";

export const meta: MetaFunction = ({ location }) => {
  const params = new URLSearchParams(location.search);
  const query = params.get("term");
  let title = "Search | AskGram";
  if (query?.trim()) {
    title = `Search results of ${query}`;
  }

  return [
    ...getSeoMeta({
      title: title,
      canonical: `${ASKGRAM_BASE}/search`
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

  return (
    <section className="pt-2 pb-40">
      <div className="container w-full px-4 mb-4 md:hidden">
        <HeaderSearch className="bg-white w-full" />
      </div>

      <Suspense fallback={
        <section className="w-full h-64 flex items-center justify-center">
          <Loader className="fill-[#5fc9a2] w-12 h-12" />
        </section>
      }>
        <Await resolve={data} errorElement={
          <EmptyResultsSearch />
        }>

          {({ data, count }) => {
            return <>
              {data.length === 0 && <>
                <EmptyResultsSearch />
              </>}

              {data.length > 0 && <>
                {showVerifiedAnswer &&
                  <SuccessAlert>
                    <section className="container max-md:px-4 lg:pl-52 flex items-center">
                      <img src="/assets/images/verified.svg" alt="verifed" className="mr-3" />
                      <p>Verified Answers: Curated by experts, our search results highlight accurate and detailed
                        information.</p>
                      <button
                        onClick={() => setShowVerifiedAnswer(false)}
                        className="ml-auto">
                        <span className="sr-only">Dismiss</span>
                        <CloseModal colorFill="#667a87" className="w-4 h-4 cursor-pointer" />
                      </button>
                    </section>
                  </SuccessAlert>
                }
                <div className="container w-full mt-4 max-md:px-4 lg:pl-52">
                  <p>
                    {count} <span className="font-bold">Result{count > 1 ? "s" : ""} found</span>
                  </p>
                  <div className="pt-4 space-y-4">
                    {data.map((el) => {
                      if(!el){
                        return <></>
                      }
                      return <SearchQuestion
                        key={el.id}
                        text={el.text}
                        questionId={el.id}
                        slug={el.slug}
                      />;
                    })}
                  </div>
                </div>
              </>}
            </>;
          }}
        </Await>
      </Suspense>

    </section>
  );
}
