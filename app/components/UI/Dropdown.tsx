import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";

// import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'


interface IProps {
  items: { title: string, value: string }[],
  selected?: string | { title: string, value: string }
  setSelected?: (param: { title: string, value: string }) => void
}

export default function Dropdown({ selected, setSelected, items }: IProps) {

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          = <div className="relative mt-2">
          <Listbox.Button
            className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
            {selected &&
              <span className="block truncate">{typeof selected === "string" ? selected : selected.title}</span>}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                {/*<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />*/}
              </span>
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {items.map((el) => (
                <Listbox.Option
                  key={el.value}
                  className={({ active }) =>
                    clsx(
                      active ? "bg-indigo-600 text-white" : "text-gray-900",
                      "relative cursor-default select-none py-2 pl-8 pr-4"
                    )
                  }
                  value={el}
                >
                  {({ selected, active }) => (
                    <>
                        <span className={clsx(selected ? "font-semibold" : "font-normal", "block truncate")}>
                          {el.title}
                        </span>

                      {selected ? (
                        <span
                          className={clsx(
                            active ? "text-white" : "text-indigo-600",
                            "absolute inset-y-0 left-0 flex items-center pl-1.5"
                          )}
                        >
                            {/*<CheckIcon className="h-5 w-5" aria-hidden="true" />*/}
                          </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
        </>
      )}
    </Listbox>
  );
}
