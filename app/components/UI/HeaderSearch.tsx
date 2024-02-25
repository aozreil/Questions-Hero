import { Form } from "@remix-run/react";

export default function HeaderSearch() {
  return (
    <Form action="/search" className="relative mt-2 rounded-md">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <img src="/assets/images/search-icon.svg" alt="search" className="cursor-pointer" width={18}
             height={18} />
      </div>
      <input
        type="search"
        name="term"
        className="hidden sm:block w-full rounded-md border-0 py-1.5 pl-10 pr-2 bg-[#f8f8f8] ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="Search for acadmic answers..."
      />
    </Form>
  );
}