import AutoCompleteInput, { IAutoCompleteItem } from "~/components/UI/AutoCompleteInput";
import { useEffect, useState } from "react";
import { getMajors } from "~/apis/searchAPI";
import { postMajor } from "~/apis/questionsAPI";
import toast from "react-hot-toast";

interface Props {
  defaultSelected?: IAutoCompleteItem;
}

export default function MajorAutoComplete({ defaultSelected }: Props) {
  const [selectedMajor, setSelectedMajor] = useState<IAutoCompleteItem | undefined>(undefined)
  const [filteredList, setFilteredList] = useState<IAutoCompleteItem[] | undefined>(undefined);

  const onQueryChange = async (query: string) => {
    try {
      const res = await getMajors({ params: { prefix: query } });
      if (res?.data?.studyFields) {
        setFilteredList(res?.data?.studyFields);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleAddingMajor = async (name: string) => {
    try {
      const res = await postMajor(name);
      if (res?.id) {
        setSelectedMajor(res);
        setFilteredList([res]);
      } else {
        toast.error(`Failed to add university, Please try again`);
      }
    } catch (e) {
      console.log(e);
      toast.error(`Failed to add Major, Please try again`);
    }
  }

  return (
    <div className="flex items-center w-full h-full">
      <label className="sr-only">
        Majors
      </label>
      <div className="relative w-full">
        <AutoCompleteInput
          inputId='study_field'
          filteredList={filteredList}
          selectedItem={selectedMajor ?? defaultSelected}
          setSelectedItem={setSelectedMajor}
          onQueryChange={onQueryChange}
          required={true}
          notFoundComponent={(query) => (
            <button
              className='flex items-center space-x-2 font-semibold text-green-200'
              onClick={() => handleAddingMajor(query)}
              type="button"
            >
              <AddIcon />
              <p>add <span className='font-bold'>{query}</span> as a new major</p>
            </button>
          )}
        />
      </div>
    </div>
  )
}

const AddIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5 flex-shrink-0"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}