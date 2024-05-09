import CustomModal from "~/components/UI/CustomModal";
import { useCallback, useEffect, useRef, useState } from "react";
import { postAnswer } from "~/apis/questionsAPI";
import Loader from "~/components/UI/Loader";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_PUBLIC_KEY } from "~/config/enviromenet";
import { useSubmit } from "@remix-run/react";
import { countRealCharacters } from "~/utils";
import { useAnalytics } from "~/hooks/useAnalytics";

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
  const [shouldLoadRecaptcha, setShouldLoadRecaptcha] = useState(false);
  const submit = useSubmit();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (hasValue && !shouldLoadRecaptcha) {
      setShouldLoadRecaptcha(true);
    }
  }, [hasValue, shouldLoadRecaptcha]);

  const handlePostAnswer = useCallback(async () => {
    try {
      const answer = textAreaRef.current ? textAreaRef.current.value : '';
      if (answer && questionId && recaptchaRef.current) {
        setIsPosting(true);
        const token = await recaptchaRef.current.executeAsync();
        await postAnswer(answer, questionId, token);

        const formData = new FormData();
        formData.append("postedAnswer", answer);
        submit(formData, { method: "post" });

        toast.success('Your answer added successfully!');
        trackEvent('question-page-post-answer-success');
        onSuccess();
      }
    } catch (e) {
      console.log(e);
      toast.error('Something went wrong, please try again');
      trackEvent('question-page-post-answer-failure');
    }

    setIsPosting(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e?.target?.value;
    const textLength = countRealCharacters(text)
    if (hasValue && textLength < 10) setHasValue(false);
    if (!hasValue && textLength >= 10) setHasValue(true);
  }

  return (
    <CustomModal open={open} closeModal={onClose}>
      {shouldLoadRecaptcha && (
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={RECAPTCHA_PUBLIC_KEY}
          size='invisible'
        />
      )}
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
              className='answer-scrollable focus:outline-none w-full h-full rounded-xl resize-none bg-transparent text-lg placeholder:text-[#4d6473] px-4 py-5 border-0 focus:ring-0'
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