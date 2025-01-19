import { Link } from "@remix-run/react";
import ArrowIcon from "~/components/icons/ArrowIcon";
import clsx from "clsx";

interface IProps {
  list: {
    text: string;
    slug: string
  }[];
}

export default function RelatedQuestions({ list }: IProps) {
  if (!list.length) {
    return <></>;
  }
  return (
    <div data-cy="related-questions" className="w-full mt-4 p-3 border rounded-lg flex flex-col bg-white border-[#e0e0e0]">
      <h2 className=" font-semibold text-xl mb-3">{"Related questions"}</h2>
      <div className="flex flex-col">
        {list.map(({ text, slug }, index) => (
          <Link key={slug} to={`/question/${slug}`} prefetch="intent"
                className={clsx("flex justify-between items-center text-sm py-2 group pr-1 transition",
                  {
                    "border-b border-[#e0e0e0] ": (list.length - 1) !== index
                  }
                )}>
            <p className="truncate pr-2 text-[#4d6473] group-hover:bg-[#f8f8f8] group-hover:text-black">{text}</p>
            <ArrowIcon className="h-3 flex-shrink-0 group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}