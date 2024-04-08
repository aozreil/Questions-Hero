import { useEffect } from "react";

interface Props {
    expandedImage?: string;
    onClose?: () => void;
}

export default function ExpandImage({ expandedImage, onClose }: Props) {
  useEffect(() => {
    const handleKeyboardClose = (e: KeyboardEvent) => {
      if(e.code == 'Escape') {
        e.preventDefault();
        onClose && onClose();
      }
    }

    document.addEventListener('keyup', handleKeyboardClose);
    return () => document.removeEventListener('keyup', handleKeyboardClose);
  }, []);

  return (
    !expandedImage ? null :  (
      <div className='fixed w-screen h-screen top-0 right-0 z-50 flex items-center justify-center'>
        <div
          className="fixed z-10 inset-0 bg-black/30 backdrop-blur-sm cursor-pointer"
          aria-hidden="true"
          onClick={onClose}
        />
        <img
          src={expandedImage}
          alt='question-image'
          className='h-fit z-50 max-h-[90%] max-w-full sm:max-w-[90%] w-fit object-contain'
        />
      </div>
    )
  )
}