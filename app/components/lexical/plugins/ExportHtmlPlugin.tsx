import { forwardRef, useImperativeHandle } from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$generateHtmlFromNodes} from '@lexical/html';
import sanitizeHtml from "sanitize-html";
import { filterEmptyNodes, getEditorTextOutput, isUploadingImages } from "~/components/lexical/helpers";

export interface LexicalExportRef {
  getEditorState: () => { htmlOutput: string, textOutput: string, isUploadingImages: boolean }
}

export const ExportHtmlPlugin = forwardRef((props, ref) => {
  const [editor] = useLexicalComposerContext();

  useImperativeHandle(ref, () => ({
    getEditorState: () => {
      let htmlOutput = '', textOutput = '', uploadingImages = false;

      editor.update(() => {
        const editorState = editor.getEditorState();
        const nodes = Array.from(editorState._nodeMap);

        const jsonState = editor.getEditorState().toJSON();
        uploadingImages = isUploadingImages(jsonState);
        if (uploadingImages) {
          return;
        }

        filterEmptyNodes(nodes);
        filterEmptyNodes(nodes.reverse());

        htmlOutput = $generateHtmlFromNodes(editor);
        htmlOutput = sanitizeHtml(htmlOutput, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ]),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt', 'width', 'height'],
            '*': ['class', 'style'],
          },
        });

        textOutput = getEditorTextOutput();
      });

      return { htmlOutput, textOutput, isUploadingImages: uploadingImages };
    }
  }));

  return null;
})