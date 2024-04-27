import { forwardRef, useImperativeHandle } from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$generateHtmlFromNodes} from '@lexical/html';
import sanitizeHtml from "sanitize-html";

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
        htmlOutput = sanitizeHtml(htmlOutput, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ]),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt', 'width', 'height'],
            '*': ['class', 'style'],
          },
        });
        const jsonState = editor.getEditorState().toJSON();

        textOutput = '';
        for (const child of jsonState?.root?.children) {
          if (child.type === 'paragraph' && child.children?.length) {
            for (const subChild of child.children) {
              if (subChild.type === 'text' && subChild.text) {
                textOutput = textOutput + subChild.text;
              }
            }
          } else if (child.type === 'paragraph') {
            textOutput += '\n'
          } else if (child.type === 'user_image') {
            textOutput += `[user-image=${child.awsSrc}]`;
          } else if (child.type === 'list' && child.children?.length) {
            for (const subChild of child.children) {
              const listItem = subChild?.children?.[0];
              if (subChild.type === 'listitem' && listItem?.type === 'text') {
                textOutput = textOutput + ' ' + listItem.text;
              }
            }
          }
        }
      });

      return { htmlOutput, textOutput };
    }
  }));

  return null;
})