import { useEffect, useState } from "react";

interface Props {
  id: string;
  label: string;
  value: string;
  count?: string;
  defaultChecked?: boolean;
  onChecked?: (value: string, isChecked: boolean) => void;
}

export default function CheckboxWithLabel({ id, label, value, count, defaultChecked, onChecked }: Props) {
  const [isChecked, setIsChecked] = useState<boolean>(defaultChecked ?? false);

  useEffect(() => {
    defaultChecked !== undefined && setIsChecked(defaultChecked);
  }, [defaultChecked]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    onChecked && onChecked(event.target.value, event.target.checked);
  };

  return (
    <div className="flex items-center me-4 overflow-x-hidden">
      <input
        id={id}
        type="checkbox"
        value={value}
        className="w-4 h-4 cursor-pointer ms-1 text-[#010101] bg-white border-[#aebccb] rounded focus:ring-[#010101] focus:ring-1"
        onChange={handleCheckboxChange}
        checked={isChecked}
      />
      <label htmlFor={id} className="ms-2.5 text font-medium text-black whitespace-nowrap truncate">{label}</label>
      {count && <p className='text-[#99a7af] text-sm ml-auto'>{count}</p>}
    </div>
  )
}