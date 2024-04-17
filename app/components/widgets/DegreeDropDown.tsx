import { useState } from "react";
import { UserDegreeEnum } from "~/models/general";
import Dropdown from "~/components/UI/Dropdown";


function degreeEnumMapper(key: UserDegreeEnum) {
  switch (key) {
    case UserDegreeEnum.BACHELOR:
      return "Bachelor";
    case UserDegreeEnum.DIPLOMA:
      return "Diploma";
    case UserDegreeEnum.DOCTORATE:
      return "Doctorate";
    case UserDegreeEnum.HIGH_SCHOOL:
      return "High School";
    case UserDegreeEnum.MASTER:
      return "Master";
    default:
      return key;
  }
}

const DEGREE_OPTIONS = Object.values(UserDegreeEnum).map((key: UserDegreeEnum) => {
  return {
    value: key,
    title: degreeEnumMapper(key)
  };
});

export function DegreeDropDown() {
  const [selected, setSelected] = useState<{title: string, value: string} | undefined>(undefined);
  return <>
    <Dropdown items={DEGREE_OPTIONS} selected={selected} setSelected={setSelected}/>
    <input className='hidden' name='degree' id='degree' value={selected?.value}/>
  </>

}
