import { useCallback, useRef, useState } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";
import CustomModal from "~/components/UI/CustomModal";
import CustomButton from "~/components/UI/CustomButton";
import Compressor from 'compressorjs';
import { getPreSignedUrls, uploadFile } from "~/apis/questionsAPI";
import { searchByImage } from "~/apis/searchAPI";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import ContentLoader from "~/components/UI/ContentLoader";
import { ATTACHMENTS_BASE, RECAPTCHA_PUBLIC_KEY } from "~/config/enviromenet";
import ReCAPTCHA from "react-google-recaptcha";

enum UIState {
  'IMAGE_PICKING' = 'IMAGE_PICKING',
  'UPLOADING' = 'UPLOADING',
  'PROCESSING' = 'PROCESSING',
}

interface Props {
  onClose: () => void;
}

export default function OcrSearch({ onClose }: Props) {
  const [imageDataURL, setImageDataURL] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [uiState, setUiState] = useState<UIState>(UIState.IMAGE_PICKING);
  const navigate = useNavigate();
  const cropperRef = useRef<ReactCropperElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const onChange = useCallback((e: any) => {
    e.preventDefault();
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    setImageFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataURL(reader.result as any);
    };
    reader.readAsDataURL(files[0]);
  }, []);

  const handleImageChange = useCallback(() => {
    inputFileRef.current && inputFileRef.current.click();
  }, []);

  const getCropData = useCallback(async () => {
    setUiState(UIState.UPLOADING);
    if (!recaptchaRef.current) return;
    const token = await recaptchaRef.current.executeAsync();
    if (typeof cropperRef.current?.cropper !== "undefined" && imageFile && token) {
      cropperRef.current?.cropper.getCroppedCanvas({
        fillColor: '#fff'
      }).toBlob(function(blob) {
        if (blob) {
          new Compressor(
            blob,
            {
              quality: 0.6,
              success: async (result) => {
                try {
                  const preSignedRes = await getPreSignedUrls([{ filename: imageFile.name }]);
                  const preSignedLink = preSignedRes?.[0]?.pre_signed_url;
                  const preSignedKey = preSignedRes?.[0]?.key;

                  await uploadFile(
                    preSignedLink,
                    result,
                    () => {},
                  );

                  setUiState(UIState.PROCESSING);
                  const searchRes = await searchByImage(
                    `${ATTACHMENTS_BASE}/${preSignedKey}`,
                    token
                  );

                  if (searchRes?.data) {
                    navigate({
                      pathname: '/search',
                      search: `?term=${searchRes.data?.ocr_result}`
                    }, { state: { ai_answer: searchRes.data?.answer } })
                  }
                } catch (e) {
                  setUiState(UIState.IMAGE_PICKING);
                  toast.error('Something went wrong, please try again');
                  console.error(e);
                }
              },
              error(err) {
                setUiState(UIState.IMAGE_PICKING);
                toast.error('Something went wrong, please try again');
                console.log(err.message);
              },
            }
          )
        }
      }, imageFile?.type);
    }
  }, [imageFile]);

  return (
    <CustomModal open={true} closeModal={onClose} className='max-sm:items-start max-sm:mt-10'>
      {!!imageFile && (
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={RECAPTCHA_PUBLIC_KEY}
          size='invisible'
        />
      )}
      <div className='w-[95vw] max-w-[60rem] h-[80vh] z-50 bg-white rounded-md px-5 py-6 flex flex-col'>
        <div className='flex justify-between items-start'>
          <div className='flex flex-col text-black'>
            <p className='text-xl font-bold'>Search by image</p>
            <p className='text-sm'>Crop your image to get the best search results</p>
          </div>
          <button onClick={onClose}>
            <img src='/assets/images/close-rounded.svg' alt='close' className='w-7 h-7' />
          </button>
        </div>
        <div className='w-full border-t border-[#f4f4f4] my-4' />
        <input
          ref={inputFileRef}
          type="file"
          onChange={onChange}
          className='hidden'
          accept="image/png, image/gif, image/jpeg"
          id="ocr-image"
        />
        <div className='flex-1 rounded-md overflow-hidden'>
          {uiState === UIState.IMAGE_PICKING && (
            imageDataURL
              ? <Cropper
                ref={cropperRef}
                style={{ height: "100%", width: "100%" }}
                src={imageDataURL}
                initialAspectRatio={1}
                guides={true}
                dragMode='move'
                viewMode={2}
              />
              : <div
                className='h-full w-full bg-gray-300 text-xl font-medium cursor-pointer flex items-center justify-center'
                onClick={handleImageChange}
              >
                Upload Image here
              </div>
          )}
          {uiState === UIState.UPLOADING && <StateLoader text='Uploading...' />}
          {uiState === UIState.PROCESSING && <StateLoader text='Proccessing Your Image...' />}
        </div>
        {uiState === UIState.IMAGE_PICKING && (
          <div className='flex space-x-2 mt-5'>
            <CustomButton
              className='flex-1 h-10 text-black bg-[#f8f8f8] rounded-xl'
              onClick={handleImageChange}
            >
              {imageDataURL ? 'Change Image' : 'Upload Image'}
            </CustomButton>
            <CustomButton
              className='flex-1 h-10 text-white font-semibold bg-black rounded-xl'
              onClick={getCropData}
            >
              Search
            </CustomButton>
          </div>
        )}
      </div>
    </CustomModal>
  )
}

const StateLoader = ({ text }: { text: string }) => (
  <div className='relative h-full w-full bg-transparent flex items-center justify-center'>
    <ContentLoader tailwindStyles='absolute w-full h-full top-0 left-0 z-10' />
    <p className='z-20 text-3xl text-[#adadad]'>{text}</p>
  </div>
)