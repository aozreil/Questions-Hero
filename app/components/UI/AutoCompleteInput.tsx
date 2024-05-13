import { Combobox, Transition } from "@headlessui/react";
import { ChangeEvent, Fragment, useState } from "react";

export interface IAutoCompleteItem { id: string | number; name: string }

interface Props {
  filteredList: IAutoCompleteItem[];
  selectedItem?: IAutoCompleteItem;
  setSelectedItem: (item: IAutoCompleteItem) => void;
  onQueryChange?: (query: string) => void;
  notFoundComponent?: (query: string) => JSX.Element;
  inputId?: string;
  required?: boolean;
}

export default function AutoCompleteInput(
  {filteredList, selectedItem, setSelectedItem, onQueryChange, notFoundComponent, inputId, required}: Props) {
  const [query, setQuery] = useState('');

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    onQueryChange && onQueryChange(event.target.value);
  }

  return (
    <Combobox name={inputId} value={selectedItem} onChange={setSelectedItem}>
      <div className="relative mt-1">
        <div className="relative w-full">
          <input className='hidden' name={inputId} id={inputId} value={selectedItem?.id} />
          <Combobox.Input
            id={inputId}
            required={required}
            className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            displayValue={(item: IAutoCompleteItem) => item.name}
            onChange={handleQueryChange}
            autoComplete='off'
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <UpDownIcon />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filteredList.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                {notFoundComponent ? notFoundComponent(query) : <p>Nothing found.</p>}
              </div>
            ) : (
              filteredList.map((item) => (
                <Combobox.Option
                  key={item.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-teal-600 text-white' : 'text-gray-900'
                    }`
                  }
                  value={item}
                >
                  {({ selected, active }) => (
                    <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {item.name}
                        </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-teal-600'
                          }`}
                        >
                            <CheckIcon />
                          </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )
}

function UpDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-5 w-5"
      aria-hidden='true'
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}
