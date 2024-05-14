import { useState } from "react";
import Dropdown from "~/components/UI/Dropdown";
import { QUESTION_TYPES, UserDegreeEnum } from "~/models/questionModel";

const TYPES = QUESTION_TYPES.map((type) => {
  return {
    value: type.value,
    title: type.label,
  };
});

export default function QuestionTypeDropdown() {
  const [selected, setSelected] = useState<{ title: string, value: string } | undefined>(undefined);
  const value = selected?.value ? selected?.value : undefined;
  return <div className='w-32 relative'>
    <Dropdown
      items={TYPES}
      selected={selected}
      setSelected={setSelected}
      placeholder='Type'
      required={true}
      optionsContainerWidth='w-38'
    />
    <input className="w-0 h-0 top-5 bg-transparent absolute border-none pointer-events-none focus:ring-0" name="type" id="type" required
           key={value}
           autoComplete='off'
           defaultValue={value} />
  </div>;
}