import { forwardRef, useImperativeHandle } from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$generateHtmlFromNodes} from '@lexical/html';

export interface LexicalExportRef {
  getEditorState: () => { htmlOutput: string, textOutput: string }
}

export const ExportHtmlPlugin = forwardRef((props, ref) => {
  const [editor] = useLexicalComposerContext();

  useImperativeHandle(ref, () => ({
    getEditorState: () => {
      let htmlOutput = '', textOutput = '';

      editor.update(() => {
        htmlOutput = $generateHtmlFromNodes(editor);
        const jsonState = editor.toJSON();

        textOutput = '';
        for (const child of jsonState?.editorState?.root?.children) {
          // @ts-ignore
          for (const subChild of child.children) {
            if (subChild.type === 'text' && subChild.text) {
              textOutput = textOutput + ' ' + subChild.text;
            }
          }
        }
      });

      return { htmlOutput, textOutput };
    }
  }));

  return null;
})