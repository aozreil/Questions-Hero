export default function EmptyResultsSearch() {
  return <div
    className="container shadow bg-white p-16 text-center w-[95%] sm:w-[34rem] h-full flex items-center flex-col rounded-md">
    <h2 className="text-3xl font-bold mb-3">
      No matching results
    </h2>
    <p className="text-lg">
      There weren&apos;t any answers, recent queries, or sources matching your search
    </p>
    <p className="text-lg">
      <span className="text-blue-500 font-semibold">Ask community</span> or <span
      className="text-blue-500 font-semibold">Search again</span>
    </p>
  </div>;
}