import { useCallback, useEffect, useRef, useState } from "react";
import CloseIcon from "~/components/icons/CloseIcon";
import Loader from "~/components/UI/Loader";
import { postQuestion } from "~/apis/questionsAPI";
import { useNavigate } from "react-router";
import { useAuth } from "~/context/AuthProvider";
import { searchQuestionsAPI } from "~/apis/searchAPI";
import { debounceLeading } from "~/utils";
import AskQuestionSearchCard from "~/components/question/AskQuestionSearchCard";
import { SearchQuestionResponse } from "~/models/searchModel";

const CHAR_CHANGE_UPDATE = 10;

export default function AskQuestion() {
  const [files, setFiles] = useState<File[]>([]);
  const [searchData, setSearchData] = useState<SearchQuestionResponse[]>([]);
  const [hasValue, setHasValue] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postPendingOnUser, setPostPendingOnUser] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const searchRequestedWithLength = useRef(0);
  const navigate = useNavigate();
  const { user, openSignUpModal } = useAuth();

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
    if (hasValue && textAreaRef?.current?.value) {
      setIsPosting(true);
      try {
        const res = await postQuestion(textAreaRef.current.value);
        if (res?.slug || res?.id) {
          navigate(`/question/${res?.slug ?? res?.id}`);
        }
      } catch (e) {
        console.error(e);
        setIsPosting(false);
      }
    }
  }, [hasValue, user]);

  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textLength = e?.target?.value?.length ?? 0;
    if (hasValue && textLength < 10) {
      setHasValue(false);
      setSearchData([]);
      searchRequestedWithLength.current = 0;
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

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filteredFiles = [];
      for (const file of e.target.files) {
        if (!files.filter(addedFile => isSameFile(addedFile, file))?.length) {
          filteredFiles.push(file);
        }
      }

      setFiles([...files, ...filteredFiles]);
    }
  }, [files]);

  const removeFile = useCallback((file: File) => {
    setFiles(files.filter(addedFile => !isSameFile(addedFile, file)))
  }, [files]);

  const clearTextArea = useCallback(() => {
    if (textAreaRef?.current) {
      textAreaRef.current.value = '';
      setHasValue(false);
      setSearchData([]);
      searchRequestedWithLength.current = 0;
    }
  }, [])

  return (
    <div className='flex-1 max-h-[calc(100vh-6rem)] overflow-y-auto bg-[#070707] px-4 md:px-10 pt-14'>
      <div className='container w-full flex flex-col text-white'>
        <h1 className='text-4xl lg:text-5xl font-bold mb-4'>Ask your question</h1>
        <p className='text-2xl lg:text-3xl w-[70%]' >Need assistance with your homework? Feel free to ask your question here and get the help you need to complete your assignment!</p>
        <section className='w-full flex max-lg:flex-col max-lg:space-y-5 lg:space-x-5 mt-7 pb-40'>
          <div className='w-full lg:w-[60%] flex flex-col justify-between h-fit min-h-[16rem] p-4 pb-0 bg-[#f8f8f8] rounded-lg border border-[#99a7af]'>
            <section className='flex items-start justify-between space-x-2 pb-2 h-[13rem] border-b border-[#d8d8d8]'>
              <img src='/assets/images/chat-icon.svg' alt='ask' className='w-6 h-6' />
              <textarea
                ref={textAreaRef}
                placeholder='Type your question here'
                className='h-full flex-1 text-md text-[#4d6473] bg-[#f8f8f8] p-1 focus:outline-none resize-none'
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
              <div className='flex space-x-2 w-[60%]'>
                {/*<input className='hidden' accept="image/png, image/gif, image/jpeg" multiple id="upload-files" type="file" onChange={handleFileChange} />*/}
                {/*<label className='cursor-pointer py-2 px-2.5 h-fit border border-black rounded-lg' htmlFor='upload-files'>*/}
                {/*  <img src='/assets/images/attachments.svg' alt='close' className='w-4 h-4' />*/}
                {/*</label>*/}
                {/*{!!files?.length && (*/}
                {/*  <div className='flex-1 space-y-2 overflow-hidden '>*/}
                {/*    {files?.map(file => (*/}
                {/*      <div key={file.lastModified} className='overflow-hidden bg-[#dfe4ea] flex-1 rounded-lg space-x-2.5 text-[#002237] py-1.5 px-2 flex items-center justify-between'>*/}
                {/*        <p className='truncate w-full'>{file?.name}</p>*/}
                {/*        <CloseIcon*/}
                {/*          colorfill='#002237'*/}
                {/*          className='w-2.5 h-2.5 mt-1 cursor-pointer'*/}
                {/*          onClick={() => removeFile(file)}*/}
                {/*        />*/}
                {/*      </div>*/}
                {/*    ))}*/}
                {/*  </div>*/}
                {/*)}*/}
              </div>
              <button
                disabled={!hasValue || isPosting}
                className={`${hasValue ? 'bg-[#163bf3]' : 'bg-[#afafb0]'} flex items-center space-x-2 rounded-lg text-white font-bold px-3.5 py-1.5`}
                onClick={handleQuestionPost}
              >
                {isPosting && <Loader className="w-5 h-5" />}
                <p>{isPosting ? 'Posting...' : 'Ask your question'}</p>
              </button>
            </section>
          </div>
          {!!searchData?.length && (
            <div className='w-full lg:w-[35rem] flex flex-col text-white'>
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
        </section>
      </div>
    </div>
  )
}

const isSameFile = (file1: File, file2: File) => {
  return file1?.name === file2?.name && file1?.size === file2?.size
}