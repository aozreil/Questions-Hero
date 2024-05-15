import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";


interface IProps {
  items: { title: string, value: string }[],
  selected?: string | { title: string, value: string }
  setSelected?: (param: { title: string, value: string }) => void
  placeholder?: string
  required?: boolean
  optionsContainerWidth?: string
  useDropIcon?: boolean;
  variant?: 'ask-question-page';
}

export default function Dropdown({ selected, setSelected, items, placeholder, required, optionsContainerWidth, useDropIcon, variant }: IProps) {

  const selectedItem = items.find(el => {
    if (typeof selected === "string") {
      return el.value === selected;
    }
    return el.value === selected?.value;
  });
  return (
    <Listbox value={selectedItem} onChange={setSelected}>
      {({ open }) => (
        <>
          <div className="relative">
            <Listbox.Button
              className={clsx("relative cursor-pointer top-0 w-full bg-white pl-3 pr-10 text-left text-gray-900 shadow-sm sm:text-sm sm:leading-6",
                variant === 'ask-question-page' ? 'rounded-lg py-[3px]' : 'rounded-md py-1.5',
                variant === 'ask-question-page' && !selectedItem ? 'border border-[#dd5251]' : 'ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600'
              )}>
              <span
                className="block truncate min-h-6">
                {selectedItem?.title ? selectedItem.title : placeholder}
                {!selectedItem && <span className={`ml-0.5 text-red-600 ${required ? 'inline' : 'hidden'}`}>*</span>}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                {useDropIcon
                  ? (
                    <img
                      src='/assets/images/drop-down.svg'
                      alt='arrow-down'
                      className={`w-3 mr-2 transition-all duration-200 ${open ? '-rotate-90' : 'rotate-90'}`}
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                  )
                }
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className={clsx(
                  `absolute z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`,
                  optionsContainerWidth ? optionsContainerWidth : 'w-full',
                )}>
                {items.map((el) => (
                  <Listbox.Option
                    key={el.value}
                    className={({ active }) =>
                      clsx(
                        active ? "bg-indigo-600 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 px-4"
                      )
                    }
                    value={el}
                  >
                    {({ selected }) => (
                      <>
                        <span className={clsx(selected ? "font-semibold" : "font-normal", "block truncate")}>
                          {el.title}
                        </span>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
              <div className='absolute h-72 w-2' />
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
