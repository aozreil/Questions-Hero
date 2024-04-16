import React, { useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalActionButton from "~/components/lexical/ui/LexicalActionButton";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';


export const CustomListActions: React.FC = () => {
  const [editor] = useLexicalComposerContext();

  const dispatchUnorderedList = useCallback(() => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  }, []);

  const dispatchOrderedList = useCallback(() => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  }, []);

  return (
    <div className='flex items-center space-x-2 h-fit'>
      <LexicalActionButton
        command='list-numbered'
        onClick={dispatchOrderedList}
      />
      <LexicalActionButton
        command='list-unordered'
        onClick={dispatchUnorderedList}
      />
    </div>
  )
}