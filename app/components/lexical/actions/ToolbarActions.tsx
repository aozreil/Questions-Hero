import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
} from 'lexical';
import {
  $findMatchingParent,
  $getNearestNodeOfType,
} from '@lexical/utils';
import {
  $isListNode,
  ListNode,
} from '@lexical/list';
import { useCallback, useEffect, useState } from "react";
import { CustomTextActions } from "~/components/lexical/actions/CustomTextActions";
import { CustomFontSizeActions } from "~/components/lexical/actions/CustomFontSizeActions";
import { CustomListActions } from "~/components/lexical/actions/CustomListActions";
import { CustomImageActions } from "~/components/lexical/actions/CustomImageActions";

// reference : packages/lexical-playground/src/plugins/ToolbarPlugin/index.tsx:100
export const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
};

export default function ToolbarActions() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>('paragraph');

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
            const parent = e.getParent();
            return parent !== null && $isRootOrShadowRoot(parent);
          });
      if (element) {
        const elementKey = element.getKey();
        const elementDOM = activeEditor.getElementByKey(elementKey);
        if (elementDOM !== null && $isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
        }
      }
    }
  }, [activeEditor])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    activeEditor.registerUpdateListener(({editorState}) => {
      editorState.read(() => {
        $updateToolbar();
      });
    });
  }, [activeEditor]);

  return (
    <div className='max-w-[470px] flex items-center justify-between space-x-10'>
      <CustomTextActions isBold={isBold} isItalic={isItalic} isUnderline={isUnderline} />
      <CustomFontSizeActions />
      <CustomListActions blockType={blockType} />
      <CustomImageActions />
    </div>
  )
}