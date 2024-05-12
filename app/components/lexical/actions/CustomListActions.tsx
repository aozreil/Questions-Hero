import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalActionButton from "~/components/lexical/ui/LexicalActionButton";
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
} from 'lexical'
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import { blockTypeToBlockName } from "~/components/lexical/actions/ToolbarActions";
import { $setBlocksType } from "~/components/lexical/helpers";

interface Props {
  blockType?: keyof typeof blockTypeToBlockName;
}

export const CustomListActions = ({ blockType }: Props) => {
  const [editor] = useLexicalComposerContext();

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  return (
    <div className='flex items-center space-x-2 h-fit'>
      <LexicalActionButton
        command='list-numbered'
        onClick={formatNumberedList}
        isSelected={blockType === 'number'}
      />
      <LexicalActionButton
        command='list-unordered'
        onClick={formatBulletList}
        isSelected={blockType === 'bullet'}
      />
    </div>
  )
}