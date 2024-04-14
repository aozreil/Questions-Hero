import CloseIcon from "~/components/icons/CloseIcon";
import { useCallback, useEffect, useRef, useState } from "react";
import { getPreSignedUrls, uploadFile } from "~/apis/questionsAPI";
import toast from "react-hot-toast";
import { useAuth } from "~/context/AuthProvider";
import { useAnalytics } from "~/hooks/useAnalytics";

export enum AttachmentsStatus {
  'uploading' = 'uploading',
  'completed' = 'completed',
}

interface Props {
  onChange: (status: AttachmentsStatus, files: AttachmentFile[]) => void;
}

export interface AttachmentFile {
  file: File;
  uploaded: boolean;
  pre_signed_url: string;
  key: string;
  filename: string;
}

const SUPPORTED_FILES = ["image/png", "image/jpeg", "image/webp"];

export default function Attachments({ onChange }: Props) {
  const [files, setFiles] = useState<AttachmentFile[]>([]);
  const { user, openSignUpModal } = useAuth();
  const isFirstLoad = useRef(true);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (isFirstLoad.current) { isFirstLoad.current = false; return }

    onChange(
      files?.find(file => file?.uploaded === false) ? AttachmentsStatus.uploading : AttachmentsStatus.completed,
      files
    );
  }, [files]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // filtered files without duplicates & with correct format
      const filteredFiles: File[] = [];
      for (const file of e.target.files) {
        if (SUPPORTED_FILES.includes(file.type)) {
          if (!files.filter(addedFile => isSameFile(addedFile?.file, file))?.length) {
            filteredFiles.push(file);
          }
        } else {
          toast.error(`${file.type} not supported yet`);
        }
      }

      if (filteredFiles?.length === 0) return;

      try {
        const preSignedRes = await getPreSignedUrls(filteredFiles?.map(file => ({ filename: file?.name })));
        const addedFiles = filteredFiles.map(file => ({
          file,
          uploaded: false,
          ...preSignedRes.find(preSigned => preSigned?.filename === file?.name),
        }))

        setFiles([...files, ...addedFiles as AttachmentFile[] ]);
        trackEvent("ask-question-attached-files");
      } catch (e) {
        console.log(e);
        toast.error('Something went wrong, please try again');
      }
    }
  }, [files]);

  const removeFile = useCallback((file: File) => {
    setFiles(files.filter(addedFile => !isSameFile(addedFile?.file, file)))
  }, [files]);

  const onFileUpload = useCallback((key: string) => {
    setFiles(prevFiles => prevFiles?.map(file => ({
      ...file,
      uploaded: file?.key === key ? true : file?.uploaded,
    })));
  }, [setFiles])

  return (
    <div className='flex space-x-2 w-[50%]'>
      <input
        className='hidden'
        accept="image/png, image/jpeg, image/webp"
        multiple id="upload-files"
        type="file"
        onChange={handleFileChange}
      />
      <label
        className='cursor-pointer py-2 px-2.5 h-fit border border-black rounded-lg'
        htmlFor={user ? 'upload-files' : ''}
        onClick={() => !user && openSignUpModal()}
      >
        <img src='/assets/images/attachments.svg' alt='close' className='w-4 h-4' />
      </label>
      {!!files?.length && (
        <div className='flex-1 space-y-2 overflow-hidden '>
          {files?.map(file => (
            <AttachedFile
              key={file.key}
              attachment={file}
              removeFile={removeFile}
              onComplete={onFileUpload}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const AttachedFile = ({ attachment, removeFile, onComplete}: {
  attachment: AttachmentFile,
  removeFile: (file: File) => void,
  onComplete: (key: string) => void,
}) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (error) {
      removeFile(attachment?.file);
    }
  }, [removeFile, error]);

  useEffect(() => {
    const controller = new AbortController();
    uploadFile(
      attachment?.pre_signed_url,
      attachment?.file,
      (progress) => progress && setProgress(Math.ceil(progress * 100)),
      { signal: controller.signal },
    ).catch((e) => {
      if (e?.code !== "ERR_CANCELED") {
        console.log(e);
        toast.error(`Uploading file failed, please try again`);
        setError(true);
      }
    }).finally(() => {
      onComplete(attachment?.key);
    });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className='overflow-hidden w-[80%] xl:w-[60%] bg-[#dfe4ea] flex-1 rounded-lg space-x-2.5 text-[#002237] py-1.5 px-2 flex items-center justify-between'>
      <p className='truncate w-full'>{attachment?.file?.name}</p>
      {progress === 0 || progress === 100
        ? <CloseIcon
          colorfill='#002237'
          className='w-2.5 h-2.5 mt-1 cursor-pointer'
          onClick={() => removeFile(attachment?.file)}
        />
        : <p>{progress}<span>%</span></p>
      }
    </div>
  )
}

const isSameFile = (file1: File, file2: File) => {
  return file1?.name === file2?.name && file1?.size === file2?.size
}