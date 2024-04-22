import { useState } from "react";
import Dropdown from "~/components/UI/Dropdown";
import { UserDegreeEnum } from "~/models/questionModel";


export function degreeEnumMapper(key: UserDegreeEnum) {
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

interface IProps {
  defaultValue?: string | { title: string, value: string };
}

export function DegreeDropDown({ defaultValue }: IProps) {
  const [selected, setSelected] = useState<string | { title: string, value: string } | undefined>(undefined);
  const value = (typeof selected === "string" ? selected : selected?.value) ?? (typeof defaultValue === "string" ? defaultValue : defaultValue?.value);
  return <>
    <Dropdown items={DEGREE_OPTIONS} selected={selected ?? defaultValue} setSelected={setSelected} />
    <input className="hidden" name="degree" id="degree" required
           key={value}
           defaultValue={value} />
  </>;

}
