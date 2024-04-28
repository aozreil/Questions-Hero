import React, { useMemo, forwardRef } from "react";
import {InitialConfigType, LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import { ImageNode } from "./nodes/ImageNode";
import {ListItemNode, ListNode} from '@lexical/list';
import { CustomImagePlugin } from "./plugins/CustomImagePlugin";
import { CustomTextActions } from "./actions/CustomTextActions";
import { CustomImageActions } from "./actions/CustomImageActions";
import { ExportHtmlPlugin } from "~/components/lexical/plugins/ExportHtmlPlugin";
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CustomListActions } from "~/components/lexical/actions/CustomListActions";
import { CustomFontSizeActions } from "~/components/lexical/actions/CustomFontSizeActions";
import { OnUpdatePlugin } from "~/components/lexical/plugins/OnUpdatePlugin";
import clsx from "clsx";

interface Props {
  onFocus?: () => void;
  onCharDifference?: (textOutput: string) => void;
  placeholder?: string;
  layoutStyles?: string;
}

const LexicalEditor = forwardRef(({
  onFocus,
  onCharDifference,
  placeholder,
  layoutStyles,
}: Props, ref) => {
  const CustomContent = useMemo(() => {
    return (
      <ContentEditable
        className='focus:outline-none h-full w-full cursor-text relative max-w-[90%]'
        onFocus={onFocus}
      />
    )
  }, []);

  const CustomPlaceholder = useMemo(() => {
    return (
      <div className='absolute top-5 left-5 pointer-events-none'>
        {placeholder ?? 'Enter some text...'}
      </div>
    )
  }, []);

  const lexicalConfig: InitialConfigType = {
    namespace: 'AskGram Rich Text Editor',
    theme: {
      text: {
        bold: "lexicalEditorTheme-text-bold",
        italic: "lexicalEditorTheme-text-italic",
        underline: "lexicalEditorTheme-text-underline",
      },
      user_image: 'lexicalEditorTheme-user_image',
      list: {
        ol: 'lexicalEditorTheme-ordered-list',
        ul: 'lexicalEditorTheme-unOrdered-list'
      }
    },
    nodes: [ImageNode, ListItemNode, ListNode],
    onError: (e) => {
      console.log('ERROR:', e)
    },
  }

  return (
    <div className={clsx('p-5 pb-14 relative flex-1 bg-[#f7fbff] border border-[#99a7af] rounded-lg overflow-hidden', layoutStyles)}>
      <div className='overflow-y-auto w-full h-full answer-scrollable max-h-full'>
        <LexicalComposer initialConfig={lexicalConfig}>
          <RichTextPlugin
            contentEditable={CustomContent}
            placeholder={CustomPlaceholder}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <CustomImagePlugin />
          <ListPlugin />
          <ExportHtmlPlugin ref={ref} />
          <OnUpdatePlugin onCharDifference={onCharDifference} />
          <div className='absolute bottom-0 left-0 w-full h-10 bg-white rounded-t-xl
           border-t border-[#99a7af] flex items-center justify-center px-5'>
            <div className='max-w-[470px] flex items-center justify-between space-x-10'>
              <CustomTextActions />
              <CustomFontSizeActions />
              <CustomListActions />
              <CustomImageActions />
            </div>
          </div>
        </LexicalComposer>
      </div>
    </div>
  );
});

export default LexicalEditor