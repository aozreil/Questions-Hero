import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {DRAG_DROP_PASTE} from '@lexical/rich-text';
import {mediaFileReader} from '@lexical/utils';
import {COMMAND_PRIORITY_LOW} from 'lexical';
import {useEffect} from 'react';
import { INSERT_IMAGE_COMMAND } from "./CustomImagePlugin";
import toast from "react-hot-toast";

const ACCEPTABLE_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

export default function DragDropPaste(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      DRAG_DROP_PASTE,
      (files) => {
        (async () => {
          const filesResult = await mediaFileReader(
            files,
            [ACCEPTABLE_IMAGE_TYPES].flatMap((x) => x),
          );

          const { file, result } = filesResult?.[0];
          if (!file) return;

          if (!ACCEPTABLE_IMAGE_TYPES.includes(file?.type)) {
            toast.error(`Please select supported image files`);
            return;
          }

          editor.dispatchCommand(
            INSERT_IMAGE_COMMAND,
            { file: file, dataURL: result },
          );
        })();
        return true;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  return null;
}
