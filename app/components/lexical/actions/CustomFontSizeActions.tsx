import React, { useCallback } from "react";
import LexicalActionButton from "~/components/lexical/ui/LexicalActionButton";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {$getSelection, $isRangeSelection } from "lexical";
import { $patchStyleText, $getSelectionStyleValueForProperty } from '@lexical/selection';

const MIN_ALLOWED_FONT_SIZE = 8;
const MAX_ALLOWED_FONT_SIZE = 24;
const DEFAULT_FONT_SIZE = 15;

enum UpdateFontSizeType {
  increment = 1,
  decrement,
}

export const CustomFontSizeActions: React.FC = () => {
  const [editor] = useLexicalComposerContext();

  const updateFontSize = useCallback((type: UpdateFontSizeType) => {
    editor.update(() => {
      if (editor.isEditable()) {
        const selection = $getSelection();
        if (selection !== null && $isRangeSelection(selection)) {
          const selectedFontSize = $getSelectionStyleValueForProperty(selection, 'font-size', `${DEFAULT_FONT_SIZE}px`).slice(0, -2);
          const fontSizeValue = Number(selectedFontSize);

          switch (type) {
            case UpdateFontSizeType.increment: fontSizeValue + 4 < MAX_ALLOWED_FONT_SIZE &&
              $patchStyleText(selection, { 'font-size': `${fontSizeValue + 4 }px` }); break;
            case UpdateFontSizeType.decrement: fontSizeValue - 4 > MIN_ALLOWED_FONT_SIZE &&
              $patchStyleText(selection, { 'font-size': `${fontSizeValue - 4 }px` }); break;
          }
        }
      }
    });
  }, []);

  return (
    <div className='flex items-center space-x-2 h-fit'>
      <LexicalActionButton
        command='text-larger'
        onClick={() => updateFontSize(UpdateFontSizeType.increment)}
      />
      <LexicalActionButton
        command='text-smaller'
        onClick={() => updateFontSize(UpdateFontSizeType.decrement)}
      />
    </div>
  )
}