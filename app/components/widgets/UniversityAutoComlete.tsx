import AutoCompleteInput, { IAutoCompleteItem } from "~/components/UI/AutoCompleteInput";
import { useEffect, useState } from "react";
import { postUniversity } from "~/apis/questionsAPI";
import { getUniversities } from "~/apis/searchAPI";
import toast from "react-hot-toast";

interface Props {
  defaultSelected?: IAutoCompleteItem;
}

export default function UniversityAutoComplete({ defaultSelected }: Props) {
  const [selectedUniversity, setSelectedUniversity] = useState<IAutoCompleteItem | undefined>(undefined)
  const [filteredList, setFilteredList] = useState<IAutoCompleteItem[]>([]);

  useEffect(() => {
    onQueryChange('');
  }, []);

  const onQueryChange = async (query: string) => {
    try {
      const res = await getUniversities({ params: { prefix: query } });
      if (res?.data?.universities) {
        setFilteredList(res?.data?.universities);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleAddingUniversity = async (name: string) => {
    try {
      const res = await postUniversity(name);
      if (res?.id) {
        setSelectedUniversity(res);
        setFilteredList([res]);
      } else {
        toast.error(`Failed to add university, Please try again`);
      }
    } catch (e) {
      console.log(e);
      toast.error(`Failed to add university, Please try again`);
    }
  }

  return (
    <div className="flex items-center w-full h-full">
      <label className="sr-only">
        University
      </label>
      <div className="relative w-full">
        <AutoCompleteInput
          inputId='university'
          filteredList={filteredList}
          selectedItem={selectedUniversity ?? defaultSelected}
          setSelectedItem={setSelectedUniversity}
          onQueryChange={onQueryChange}
          notFoundComponent={(query) => (
            <button
              className='flex items-center space-x-2 font-semibold text-green-200'
              onClick={() => handleAddingUniversity(query)}
            >
              <AddIcon />
              <p>add <span className='font-bold'>{query}</span> as a new university</p>
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