export default function EmptyResultsSearch() {
  return <div
    className="container shadow bg-white p-16 text-center w-[95%] sm:w-[34rem] h-full flex items-center flex-col rounded-md">
    <h2 className="text-3xl font-bold mb-3">
      No matching results
    </h2>
    <p className="text-lg">
      There weren&apos;t any answers, recent queries, or sources matching your search
    </p>
  </div>;
}