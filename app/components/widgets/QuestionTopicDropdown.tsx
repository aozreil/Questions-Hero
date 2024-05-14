import { useState } from "react";
import Dropdown from "~/components/UI/Dropdown";
import { SUBJECTS_MAPPER } from "~/models/subjectsMapper";

const TOPICS = Object.keys(SUBJECTS_MAPPER).map((key) => {
  return {
    value: key,
    title: SUBJECTS_MAPPER[Number(key)].label,
  };
});

export default function QuestionTopicDropdown() {
  const [selected, setSelected] = useState<{ title: string, value: string } | undefined>(undefined);
  const value = selected?.value ? selected?.value : undefined;
  return <div className='w-32 relative'>
    <Dropdown
      items={TOPICS}
      selected={selected}
      setSelected={setSelected}
      placeholder='Topic'
      required={true}
      optionsContainerWidth='w-[250px]'
    />
    <input className="w-0 h-0 top-5 bg-transparent absolute border-none pointer-events-none focus:ring-0" name="topic" id="topic" required
           key={value}
           autoComplete='off'
           defaultValue={value} />
  </div>;
}