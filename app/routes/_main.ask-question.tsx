import { FormEvent, lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import Loader from "~/components/UI/Loader";
import { postQuestion } from "~/apis/questionsAPI";
import { useNavigate } from "react-router";
import { useAuth } from "~/context/AuthProvider";
import toast from "react-hot-toast";
import { Transition } from "@headlessui/react";
import ReCAPTCHA from "react-google-recaptcha";
import { BASE_URL, RECAPTCHA_PUBLIC_KEY } from "~/config/enviromenet";
import { LinksFunction, MetaFunction } from "@remix-run/node";
import { getSeoMeta } from "~/utils/seo";
import { loader } from "~/routes/_main.search";
import Footer from "~/components/UI/Footer";
import { getKatexLink } from "~/utils/external-links";
import SimilarQuestions, { isThereExactMatch } from "~/components/askQuestion/SimilarQuestions";
import { useAnalytics } from "~/hooks/useAnalytics";
import { LexicalExportRef } from "~/components/lexical/plugins/ExportHtmlPlugin";
import QuestionTypeDropdown from "~/components/widgets/QuestionTypeDropdown";
import QuestionTopicDropdown from "~/components/widgets/QuestionTopicDropdown";
import { Form } from "@remix-run/react";
const LexicalEditor = lazy(() => import("~/components/lexical/LexicalEditor"));

export const meta: MetaFunction<typeof loader> = () => {
  return [
    ...getSeoMeta({
      title: 'Askgram - Ask Question',
      canonical: `${BASE_URL}/ask-question`
    })
  ];
};

export const links: LinksFunction = () => {
  return [
    ...getKatexLink()
  ];
}

export default function AskQuestion() {
  const [searchTerm, setSearchTerm] = useState('');
  const [hasExactMatch, setHasExactMatch] = useState(false);
  const [showMatchError, setShowMatchError] = useState(false);
  const [isSearchingForSimilar, setIsSearchingForSimilar] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postPendingOnUser, setPostPendingOnUser] = useState(false);
  const [shouldLoadRecaptcha, setShouldLoadRecaptcha] = useState(false);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(true);
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { user, openSignUpModal } = useAuth();
  const lexicalRef = useRef<LexicalExportRef>(null);
  const hasValue = !!searchTerm;
  const isPostingDisabled = !hasValue || isPosting || isSearchingForSimilar;
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent("ask-question-view-page");
  }, []);

  useEffect(() => {
    if (!hasExactMatch && showMatchError) {
      setShowMatchError(false);
    }
  }, [hasExactMatch]);

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

  const handleQuestionPost = useCallback(async (questionType?: string, questionTopicId?: number) => {
    if (!user) {
      setPostPendingOnUser(true);
      openSignUpModal();
      return;
    }
    if (!lexicalRef.current) return;
    const { textOutput, htmlOutput, isUploadingImages, haveImages } = lexicalRef.current.getEditorState();
    if (isUploadingImages) {
      setIsPosting(true);
      setTimeout(() => {
        handleQuestionPost();
      }, 1000);
      return;
    }

    if (!haveImages && hasExactMatch) {
      setIsPosting(false);
      setShowMatchError(true);
      return;
    } else if (!haveImages) {
      const haveExactMatch = await isThereExactMatch(textOutput);
      if (haveExactMatch) {
        setIsPosting(false);
        setShowMatchError(true);
        return;
      }
    } else {
      setShowMatchError(false);
    }

    if (textOutput && hasValue && recaptchaRef.current) {
      setIsPosting(true);
      try {
        const token = await recaptchaRef.current.executeAsync();
        const res = await postQuestion(htmlOutput, textOutput, token, questionType, questionTopicId);
        if (res?.slug || res?.id) {
          trackEvent("ask-question-post-success");
          toast.success('Your question added successfully!');
          navigate(`/question/${res?.slug ?? res?.id}`);
        }
      } catch (e) {
        console.error(e);
        trackEvent("ask-question-post-failure");
        toast.error('Something went wrong, please try again');
        setIsPosting(false);
      }
    }
  }, [hasValue, user, hasExactMatch]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const type = formData.get("type") as string;
    const topic = formData.get("topic");
    if (type && topic) {
      handleQuestionPost(type, Number(topic))
    }
  }

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
        <section className='w-full flex max-lg:flex-col max-lg:space-y-12 lg:space-x-5 pb-40 sm:pb-10'>
          <div className='relative w-full lg:w-[60%] flex flex-col justify-between h-fit min-h-[8rem] sm:min-h-[13rem] pb-0 bg-[#f8f8f8] rounded-lg border border-[#99a7af]'>
            <section data-cy='question-editor' className='text-black h-[8rem] sm:h-[13rem]'>
              <Suspense>
                <LexicalEditor
                  ref={lexicalRef}
                  placeholder='Type your question here'
                  layoutStyles='h-full'
                  onCharDifference={(textOutput) => setSearchTerm(textOutput)}
                />
              </Suspense>
            </section>
            <Form onSubmit={handleSubmit} className='w-full p-4 flex-1 py-2 flex items-center justify-end space-x-2 text-sm'>
              <QuestionTypeDropdown />
              <QuestionTopicDropdown />
              <button
                disabled={isPostingDisabled}
                className={`${!isPostingDisabled ? 'bg-[#163bf3]' : 'bg-[#afafb0]'} flex items-center space-x-2 rounded-lg text-white font-bold px-3.5 py-1.5`}
                title={hasExactMatch ? 'An exact match to your question is found.' : ''}
                data-cy='post-question-button'
                type='submit'
              >
                {isPosting && <Loader className="w-5 h-5" />}
                <p>{isPosting ? 'Posting...' : isSearchingForSimilar ? 'Searching for similar questions' : 'Ask your question'}</p>
              </button>
            </Form>
            {showMatchError && (
              <div className='absolute -bottom-10 right-0 w-fit bg-red-500 p-1 px-4 rounded-md'>
                <p className='text-base text-white'>An exact match to your question is found!</p>
              </div>
            )}
          </div>
          <SimilarQuestions
            searchTerm={searchTerm}
            setIsDescriptionVisible={setIsDescriptionVisible}
            textareaHasValue={hasValue}
            setHasExactMatch={setHasExactMatch}
            setIsSearchingForSimilar={setIsSearchingForSimilar}
          />
        </section>
      </div>
      <div className='mt-auto w-full'>
        <Footer />
      </div>
    </div>
  )
}
