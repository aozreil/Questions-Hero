import { Link } from "@remix-run/react";


interface IProps {
  page: number,
  size: number,
  total: number,
  previous: string,
  next: string
}

export function Pagination({ total, page, previous, next, size }: IProps) {
  return <nav
    data-cy={'Pagination'}
    className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
    aria-label="Pagination"
  >
    <div className="hidden sm:block">
      <p className="text-sm text-gray-700">
        Showing <span className="font-medium">{Math.max(page * size, 1)}</span> to <span
        className="font-medium">{Math.min(((page + 1) * size), total)}</span> of{" "}
        <span className="font-medium">{total}</span> results
      </p>
    </div>
    <div className="flex flex-1 justify-between sm:justify-end">
      {page > 0 && <Link
        to={previous}
        className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
      >
        Previous
      </Link>}
      {((page + 1) * size) < (total) && <Link
        to={next}
        className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
      >
        Next
      </Link>}
    </div>
  </nav>;
}
