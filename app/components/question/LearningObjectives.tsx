import {IObjective} from "~/models/questionModel";

interface Props {
    objectives: IObjective[];
}

export default function LearningObjectives({ objectives }: Props) {
    return (
        <div className='hidden lg:block w-full lg:w-[340px]'>
            <div className='w-full bg-[#eaf1fa] text-sm font-medium text-[#344f60] p-3 border border-[#e0e0e0] rounded-lg flex flex-col items-center'>
                <img src='/assets/images/objectives.svg' alt='objectives' className='w-[71px] h-[71px] mb-[26px]' />
                <h2 className='text-[#002237] text-[21px] font-semibold mb-[9px]'>Learning Objectives</h2>
                <ul className='list-disc pl-4 w-full'>
                    {objectives?.map((objective, index) => <li key={index} className='mb-2'>{objective?.text}</li>)}
                </ul>
                {/*<div className='w-full mb-[10px]  border-t-[1px] border-[#bedcff]' />*/}
                {/*<div className='w-full py-3 bg-white text-[13px] text-[#070707] rounded-xl border border-[#e0e0e0] flex items-center justify-center'>*/}
                {/*    Read More*/}
                {/*</div>*/}
            </div>
        </div>
    )
}