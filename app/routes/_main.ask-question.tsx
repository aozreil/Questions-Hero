import { useCallback, useEffect, useRef, useState } from "react";
import CloseIcon from "~/components/icons/CloseIcon";
import Loader from "~/components/UI/Loader";
import { postQuestion } from "~/apis/questionsAPI";
import { useNavigate } from "react-router";
import { useAuth } from "~/context/AuthProvider";

export default function AskQuestion() {
  const [files, setFiles] = useState<File[]>([]);
  const [hasValue, setHasValue] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postPendingOnUser, setPostPendingOnUser] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { user, openSignUpModal } = useAuth();

  useEffect(() => {
    if (user && postPendingOnUser) {
      setPostPendingOnUser(false);
      handleQuestionPost();
    }
  }, [user, postPendingOnUser]);

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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (hasValue && e?.target?.value?.length < 10) setHasValue(false);
    if (!hasValue && e?.target?.value?.length >= 10) setHasValue(true);
  }

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
    }
  }, [])

  return (
    <div className='flex-1 bg-[#070707] px-4 md:px-10 pt-14'>
      <div className='container flex flex-col text-white'>
        <h1 className='text-4xl lg:text-5xl font-bold mb-4'>Ask your question</h1>
        <p className='text-2xl lg:text-3xl w-[70%]' >Need assistance with your homework? Feel free to ask your question here and get the help you need to complete your assignment!</p>
        <div className='w-[100%] sm:w-[33rem] flex flex-col justify-between min-h-[16rem] p-4 pb-0 bg-[#f8f8f8] mt-7 rounded-lg border border-[#99a7af]'>
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
              <input className='hidden' accept="image/png, image/gif, image/jpeg" multiple id="upload-files" type="file" onChange={handleFileChange} />
              <label className='cursor-pointer py-2 px-2.5 h-fit border border-black rounded-lg' htmlFor='upload-files'>
                <img src='/assets/images/attachments.svg' alt='close' className='w-4 h-4' />
              </label>
              {!!files?.length && (
                <div className='flex-1 space-y-2 overflow-hidden '>
                  {files?.map(file => (
                    <div key={file.lastModified} className='overflow-hidden bg-[#dfe4ea] flex-1 rounded-lg space-x-2.5 text-[#002237] py-1.5 px-2 flex items-center justify-between'>
                      <p className='truncate w-full'>{file?.name}</p>
                      <CloseIcon
                        colorfill='#002237'
                        className='w-2.5 h-2.5 mt-1 cursor-pointer'
                        onClick={() => removeFile(file)}
                      />
                    </div>
                  ))}
                </div>
              )}
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
      </div>
    </div>
  )
}

const isSameFile = (file1: File, file2: File) => {
  return file1?.name === file2?.name && file1?.size === file2?.size
}