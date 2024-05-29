import React, { useCallback, useRef } from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {INSERT_IMAGE_COMMAND} from "../plugins/CustomImagePlugin";
import LexicalActionButton from "~/components/lexical/ui/LexicalActionButton";
import toast from "react-hot-toast";

const SUPPORTED_FILES = ["image/png", "image/jpeg", "image/webp"];

export const CustomImageActions: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnClick = () => {
    inputRef.current && inputRef.current.click();
  };

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if(!SUPPORTED_FILES.includes(file.type)) {
        toast.error(`Please select supported image files`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        editor.dispatchCommand(
          INSERT_IMAGE_COMMAND,
          { file: file, dataURL: reader.result },
        );
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }, []);

  return (
    <div className='flex items-center space-x-2 h-fit'>
      <input
        className='hidden'
        accept="image/png, image/jpeg, image/webp"
        id="upload-files"
        type="file"
        onChange={handleFileChange}
        ref={inputRef}
      />
      <LexicalActionButton
        command='user_image'
        onClick={handleOnClick}
      />
    </div>
  );
};