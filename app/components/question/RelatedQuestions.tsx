import { Link } from "@remix-run/react";
import ArrowIcon from "~/components/icons/ArrowIcon";

interface IProps {
  list: {
    text: string;
    slug: string
  }[];
}

export default function RelatedQuestions({ list }: IProps) {
  return (
    <div className="w-full mt-4 p-3 border rounded-lg flex flex-col bg-white border-[#e0e0e0]">
      <h2 className=" font-semibold text-xl mb-3">Related questions</h2>
      <div className="flex flex-col [&>*:last-child]:border-0">
        {list.map(({ text, slug }) => (
          <Link key={slug} to={`/question/${slug}`} prefetch="intent"
                className="flex justify-between items-center text-sm py-2 border-b border-[#e0e0e0] group pr-1 transitionn">
            <p className="truncate pr-2 text-[#4d6473] group-hover:bg-[#f8f8f8] group-hover:text-black">{text}</p>
            <ArrowIcon className="h-3 flex-shrink-0 group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}