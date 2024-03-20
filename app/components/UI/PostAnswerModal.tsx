import CustomModal from "~/components/UI/CustomModal";
import { useCallback, useRef, useState } from "react";
import { postAnswer } from "~/apis/questionsAPI";
import Loader from "~/components/UI/Loader";

interface Props {
  open: boolean;
  onClose: () => void;
  questionText: string;
  questionId: string;
  onSuccess: () => void;
}

export default function PostAnswerModal({ open, onClose, questionText, questionId, onSuccess }: Props) {
  const [isPosting, setIsPosting] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handlePostAnswer = useCallback(async () => {
    try {
      const answer = textAreaRef.current ? textAreaRef.current.value : '';
      if (answer && questionId) {
        setIsPosting(true);
        await postAnswer(answer, questionId);
        onSuccess();
      }
    } catch (e) {
      console.log(e);
    }

    setIsPosting(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (hasValue && !e?.target?.value?.length) setHasValue(false);
    if (!hasValue && e?.target?.value?.length) setHasValue(true);
  }

  return (
    <CustomModal open={open} closeModal={onClose}>
      <div className='w-full mx-4 sm:w-[58rem] z-10 h-[80%] max-h-[48rem] text-black bg-white rounded-2xl flex sm:space-x-5 p-5'>
        <div className='max-sm:hidden w-[40%] overflow-hidden flex flex-col'>
          <p className='text-xl font-bold mb-3'>Question</p>
          <div className='flex-1 thin-scrollbar pr-4 overflow-y-auto'>
            <p className='text-lg' dangerouslySetInnerHTML={{ __html: questionText }} />
          </div>
        </div>
        <div className='flex-1 flex flex-col space-y-3'>
          <div className='flex items-center justify-between'>
            <p className='text-xl font-bold'>Answer</p>
            <button onClick={onClose}>
              <img src='/assets/images/close-rounded.svg' alt='close' className='w-6 h-6' />
            </button>
          </div>
          <div className='flex-1 border border-[#99a7af] bg-[#f7fbff] p-2 rounded-xl overflow-hidden'>
            <textarea
              className='answer-scrollable focus:outline-none w-full h-full rounded-xl resize-none bg-transparent text-lg placeholder:text-[#4d6473] px-4 py-5'
              placeholder='Type your answer here'
              ref={textAreaRef}
              onChange={handleChange}
            />
          </div>
          <button
            className={`${hasValue ? 'bg-[#002237]' : 'bg-[#afafb0]'} flex items-center space-x-2 text-sm py-2 px-7 text-white rounded-xl self-end`}
            onClick={handlePostAnswer}
            disabled={isPosting || !hasValue}
          >
            {isPosting && <Loader className="w-5 h-5" />}
            <p>{isPosting ? 'Submitting...' : 'Submit'}</p>
          </button>
        </div>
      </div>
    </CustomModal>
  )
}