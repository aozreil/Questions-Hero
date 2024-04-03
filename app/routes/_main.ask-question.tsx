import { useCallback, useEffect, useRef, useState } from "react";
import Loader from "~/components/UI/Loader";
import { postQuestion } from "~/apis/questionsAPI";
import { useNavigate } from "react-router";
import { useAuth } from "~/context/AuthProvider";
import { searchQuestionsAPI } from "~/apis/searchAPI";
import { countRealCharacters, debounceLeading } from "~/utils";
import AskQuestionSearchCard from "~/components/question/AskQuestionSearchCard";
import { SearchQuestionResponse } from "~/models/searchModel";
import toast from "react-hot-toast";
import { Transition } from "@headlessui/react";
import ReCAPTCHA from "react-google-recaptcha";
import { BASE_URL, RECAPTCHA_PUBLIC_KEY } from "~/config/enviromenet";
import Attachments, { AttachmentFile, AttachmentsStatus } from "~/components/askQuestion/Attachments";
import { MetaFunction } from "@remix-run/node";
import { getSeoMeta } from "~/utils/seo";
import { loader } from "~/routes/_main.search";
import Footer from "~/components/UI/Footer";
import { getKatexLink } from "~/utils/external-links";

export const meta: MetaFunction<typeof loader> = ({ location }) => {
  return [
    ...getSeoMeta({
      title: 'Askgram - Ask Question',
      canonical: `${BASE_URL}/ask-question`
    }),
    ...getKatexLink(),
  ];
};

const AttachmentsInitialState = { files: [], status: AttachmentsStatus.completed }
const CHAR_CHANGE_UPDATE = 10;

export default function AskQuestion() {
  const [searchData, setSearchData] = useState<SearchQuestionResponse[]>([]);
  const [hasValue, setHasValue] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postPendingOnUser, setPostPendingOnUser] = useState(false);
  const [shouldLoadRecaptcha, setShouldLoadRecaptcha] = useState(false);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(true);
  const [attachmentsState, setAttachmentsState] = useState<{
    files: AttachmentFile[], status: AttachmentsStatus }>(AttachmentsInitialState);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const searchRequestedWithLength = useRef(0);
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { user, openSignUpModal } = useAuth();
  const textareaHistory = useRef('');
  const isUploadingFiles = attachmentsState?.status === AttachmentsStatus.uploading;

  useEffect(() => {
    if (searchData?.length && isDescriptionVisible) {
      if (window.innerWidth < 640) {
        setIsDescriptionVisible(false);
      }
    }
  }, [searchData, isDescriptionVisible]);

  useEffect(() => {
    if (hasValue && !shouldLoadRecaptcha) {
      setShouldLoadRecaptcha(true);
    }
  }, [hasValue, shouldLoadRecaptcha]);

  useEffect(() => {
    if (user && postPendingOnUser) {
      setPostPendingOnUser(false);
      handleQuestionPost();
    }
  }, [user, postPendingOnUser]);

  useEffect(() => {
    const pasteEventListener = () => {
      const textLength = textAreaRef.current ? textAreaRef.current.value.length : 0;
      shouldRequestSearch(textLength, true);
    }

    textAreaRef.current && textAreaRef.current.addEventListener('paste', pasteEventListener)

    return () => {
      textAreaRef.current && textAreaRef.current.removeEventListener('paste', pasteEventListener)
    }
  }, [textAreaRef]);

  const handleQuestionPost = useCallback(async () => {
    if (!user) {
      setPostPendingOnUser(true);
      openSignUpModal();
      return;
    }
    if (hasValue && textAreaRef?.current?.value && recaptchaRef.current) {
      setIsPosting(true);
      try {
        const token = await recaptchaRef.current.executeAsync();
        const attachments = attachmentsState?.files?.map(file => ({
          filename: file.filename,
          key: file.key
        }));
        const questionBody = textAreaRef.current.value?.trim();
        const res = await postQuestion(questionBody, token, attachments);
        if (res?.slug || res?.id) {
          toast.success('Your question added successfully!');
          navigate(`/question/${res?.slug ?? res?.id}`);
        }
      } catch (e) {
        console.error(e);
        toast.error('Something went wrong, please try again');
        setIsPosting(false);
      }
    }
  }, [hasValue, user, attachmentsState]);

  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e?.target?.value;
    const textLength = text?.length ? countRealCharacters(text) : 0;
    if (hasValue && textLength < 10) {
      setHasValue(false);
      clearSearchData();
    }
    if (!hasValue && textLength >= 10) setHasValue(true);

    shouldRequestSearch(textLength);
  }

  const shouldRequestSearch = debounceLeading(async (textLength: number, forceUpdate?: boolean) => {
    const prevLength = searchRequestedWithLength.current;
    if (forceUpdate || (
      textLength && Math.abs(textLength - prevLength) > CHAR_CHANGE_UPDATE
    )) {
      searchRequestedWithLength.current = textLength;
      const searchTerm = textAreaRef.current ? textAreaRef.current.value : undefined;
      if (!searchTerm) return;
      try {
        const searchRes = await searchQuestionsAPI(searchTerm)
        if (searchRes?.data) {
          setSearchData(searchRes.data?.filter(item => item?.relevant_score > 0.8));
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, 600);

  const clearTextArea = useCallback(() => {
    if (textAreaRef?.current) {
      textareaHistory.current = textAreaRef.current.value;
      textAreaRef.current.value = '';
      setHasValue(false);
      clearSearchData();
    }
  }, []);

  const clearSearchData = useCallback(() => {
    setTimeout(() => {
      setSearchData([]);
      searchRequestedWithLength.current = 0;
    }, 500);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
      if (textareaHistory.current && textAreaRef.current) {
        event.preventDefault();
        textAreaRef.current.value = textareaHistory.current;
        const textLength = textareaHistory.current.length;

        if (!hasValue && textLength >= 10) setHasValue(true);
        shouldRequestSearch(textLength);

        textareaHistory.current = '';
      }
    }
  }, []);

  return (
    <div className='flex-1 relative max-h-[calc(100vh-6rem)] flex flex-col overflow-y-auto bg-[#070707] pt-4 sm:pt-14'>
      {shouldLoadRecaptcha && (
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={RECAPTCHA_PUBLIC_KEY}
          size='invisible'
        />
      )}
      <div className='container w-full flex flex-col text-white px-4 md:px-10'>
        <Transition
          show={isDescriptionVisible}
          leave="transition-[opacity,max-height] duration-400"
          leaveFrom="opacity-1 max-h-96"
          leaveTo="opacity-0 max-h-0"
        >
          <h1 className='text-4xl lg:text-5xl font-bold mb-4'>Ask your question</h1>
          <p className='text-xl lg:text-3xl w-full mb-7' >Need assistance with your homework? Feel free to ask your question here
            and get the help<br className='max-xl:hidden' /> you need to complete your assignment!</p>
        </Transition>
        <section className='w-full flex max-lg:flex-col max-lg:space-y-5 lg:space-x-5 pb-40 sm:pb-10'>
          <div className='w-full lg:w-[60%] flex flex-col justify-between h-fit min-h-[8rem] sm:min-h-[13rem] p-4 pb-0 bg-[#f8f8f8] rounded-lg border border-[#99a7af]'>
            <section className='flex items-start justify-between space-x-2 pb-2 h-[8rem] sm:h-[13rem] border-b border-[#d8d8d8]'>
              <img src='/assets/images/chat-icon.svg' alt='ask' className='w-6 h-6' />
              <textarea
                ref={textAreaRef}
                placeholder='Type your question here'
                className='h-full flex-1 text-md text-[#4d6473] bg-[#f8f8f8] p-1 focus:outline-none resize-none'
                onKeyDown={handleKeyDown}
                onChange={handleChange}
              />
              {hasValue && <img
                src='/assets/images/close-rounded.svg'
                alt='close'
                className='cursor-pointer w-5 h-5'
                onClick={clearTextArea}
              />}
            </section>
            <section className='w-full flex-1 py-2 flex items-start justify-between text-sm'>
              <Attachments
                onChange={(status, files) => setAttachmentsState({status, files})}
              />
              <button
                disabled={!hasValue || isPosting || isUploadingFiles}
                className={`${hasValue && !isUploadingFiles ? 'bg-[#163bf3]' : 'bg-[#afafb0]'} flex items-center space-x-2 rounded-lg text-white font-bold px-3.5 py-1.5`}
                onClick={handleQuestionPost}
              >
                {isPosting && <Loader className="w-5 h-5" />}
                <p>{isPosting ? 'Posting...' : 'Ask your question'}</p>
              </button>
            </section>
          </div>
          <Transition
            show={!!searchData?.length && hasValue}
            enter='transition-opacity duration-400'
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-400"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {!!searchData?.length && (
              <div className='w-full lg:w-[28rem] xl:w-[35rem] flex flex-col text-white'>
                <div className='flex items-center space-x-3'>
                  <img src='/assets/images/search-questions-hi.svg' alt='questions' className='h-[4.1rem]' />
                  <div className='flex flex-col'>
                    <p className='text-2xl font-bold'>Hi There!</p>
                    <p className='text-lg'>We've already got answers to this question.<br /> See them below</p>
                  </div>
                </div>
                <div className='w-full flex-col space-y-2 p-2.5 bg-[#1e1e1e] border border-[#99a7af] rounded-xl mt-3 text-black'>
                  {searchData.map(el => (
                    <AskQuestionSearchCard
                      key={el.id}
                      text={el.text}
                      questionId={el.id}
                      slug={el.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </Transition>
        </section>
      </div>
      <div className='mt-auto w-full'>
        <Footer />
      </div>
    </div>
  )
}