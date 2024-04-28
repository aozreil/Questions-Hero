import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
import { countRealCharacters, debounceLeading } from "~/utils";
import { getEditorTextOutput } from "~/components/lexical/helpers";

const CHAR_CHANGE_UPDATE = 10;

interface Props {
  onCharDifference?: (textOutput: string) => void;
}

export function OnUpdatePlugin({ onCharDifference }: Props) {
  const [editor] = useLexicalComposerContext();
  const lastTextLengthReq = useRef(0);

  useEffect(() => {
    if (!onCharDifference) {
      return;
    }

    return editor.registerUpdateListener(() => {
      onCharNumUpdate();
    });
  }, [editor]);

  // this function is used on 10 characters update
  const onCharNumUpdate = debounceLeading(() => {
    editor.update(() => {
      if (!onCharDifference) return;
      let textOutput = getEditorTextOutput();

      if (!textOutput) onCharDifference('');
      if (Math.abs(countRealCharacters(textOutput) - lastTextLengthReq.current) >= CHAR_CHANGE_UPDATE) {
        onCharDifference(textOutput);
        lastTextLengthReq.current = countRealCharacters(textOutput);
      }
    });
  }, 600);

  return null;
}