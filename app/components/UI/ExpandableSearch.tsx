import { Form } from "@remix-run/react";
export default function ExpandableSearch() {
    return (
      <Form  action="/search" className='relative mt-2 h-fit w-full min-h-14'>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
          <img src="/assets/images/search-icon.svg" alt="search" className="cursor-pointer" width={24}
               height={24} />
        </div>
        <input
          type='search'
          name='term'
          placeholder='Search for acadmic answers...'
          className='text-xl placeholder:text-xl min-h-14 w-full rounded-full border-0 py-1.5 pl-14 pr-6 bg-[#f8f8f8] ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600  sm:leading-6 '
        />
      </Form>
    )
}