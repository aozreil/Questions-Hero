import CustomModal from "~/components/UI/CustomModal";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { postAnswer } from "~/apis/questionsAPI";
import Loader from "~/components/UI/Loader";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_PUBLIC_KEY } from "~/config/enviromenet";
import { useSubmit } from "@remix-run/react";
import { countRealCharacters } from "~/utils";
import { useAnalytics } from "~/hooks/useAnalytics";
import { LexicalExportRef } from "~/components/lexical/plugins/ExportHtmlPlugin";
import SanitizedText from "~/components/question/SanitizedText";
const LexicalEditor = lazy(() => import("~/components/lexical/LexicalEditor"));

interface Props {
  open: boolean;
  onClose: () => void;
  questionText: string;
  questionId: string;
  onSuccess: () => void;
}

export default function PostAnswerModal({ open, onClose, questionText, questionId, onSuccess }: Props) {
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState('');
  const [shouldLoadRecaptcha, setShouldLoadRecaptcha] = useState(false);
  const submit = useSubmit();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const lexicalRef = useRef<LexicalExportRef>(null);
  const { trackEvent } = useAnalytics();

  const handlePostAnswer = useCallback(async () => {
    if (lexicalRef.current) {
      const { textOutput, htmlOutput, isUploadingImages } = lexicalRef.current.getEditorState();
      if (isUploadingImages) {
        setIsPosting(true);
        setTimeout(() => {
          handlePostAnswer();
        }, 1000);
        return;
      }
      if (!textOutput || !htmlOutput) {
        setError('Something went wrong, please try again');
        return;
      }
      if (countRealCharacters(textOutput) < 10) {
        setError('Your answer must be at least 10 characters long');
        return;
      }

      try {
        if (questionId && recaptchaRef.current) {
          setIsPosting(true);
          setError('');
          const token = await recaptchaRef.current.executeAsync();
          await postAnswer(htmlOutput, textOutput, questionId, token);

          const formData = new FormData();
          formData.append("postedAnswer", textOutput);
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
    }

    return () => {
      setError('');
    }
  }, []);

  const handleFocus = useCallback(() => {
    setShouldLoadRecaptcha(true);
  }, []);

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
        <div className='max-sm:hidden w-[40%] overflow-hidden flex flex-col space-y-4'>
          <p className='text-xl font-bold'>Question</p>
          <div className='flex-1 thin-scrollbar pr-4 overflow-y-auto'>
            <SanitizedText className='text-lg' html={questionText} />
          </div>
        </div>
        <div className='flex-1 flex flex-col space-y-4'>
          <div className='relative flex items-center justify-between'>
            <p className='text-xl font-bold'>Answer</p>
            <button onClick={onClose}>
              <img src='/assets/images/close-rounded.svg' alt='close' className='w-6 h-6' />
            </button>
            {error && <p className='absolute w-full top-6 left-0 text-xs text-red-500'>{error}</p>}
          </div>
          <Suspense>
            <LexicalEditor
              onFocus={handleFocus}
              ref={lexicalRef}
            />
          </Suspense>
          <button
            className={`bg-[#002237] flex items-center space-x-2 text-sm py-2 px-7 text-white rounded-xl self-end`}
            onClick={handlePostAnswer}
            disabled={isPosting}
          >
            {isPosting && <Loader className="w-5 h-5" />}
            <p>{isPosting ? 'Submitting...' : 'Submit'}</p>
          </button>
        </div>
      </div>
    </CustomModal>
  )
}
