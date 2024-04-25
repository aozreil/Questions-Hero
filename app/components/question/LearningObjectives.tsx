import {IObjective} from "~/models/questionModel";
import { useTranslation } from "react-i18next";

interface Props {
  objectives: IObjective[];
}

export default function LearningObjectives({ objectives }: Props) {
  const { t } = useTranslation();
  return (
    <div className='w-full bg-[#eaf1fa] text-sm font-medium text-[#344f60] p-3 border border-[#e0e0e0] rounded-lg flex flex-col items-center'>
      <img src='/assets/images/objectives.svg' alt='objectives' className='w-18 h-18 mb-6' />
      <h2 className='text-[#002237] text-2xl font-semibold mb-2'>{t("Learning Objectives")}</h2>
      <ul className='list-disc pl-4 w-full'>
          {objectives?.map((objective, index) => <li key={index} className='mb-2'>{objective?.text}</li>)}
      </ul>
      {/*<div className='w-full mb-[10px]  border-t-[1px] border-[#bedcff]' />*/}
      {/*<div className='w-full py-3 bg-white text-[13px] text-[#070707] rounded-xl border border-[#e0e0e0] flex items-center justify-center'>*/}
      {/*    Read More*/}
      {/*</div>*/}
    </div>
  )
}