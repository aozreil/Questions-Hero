import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$getSelection, $isRangeSelection, COMMAND_PRIORITY_NORMAL, createCommand, $getNodeByKey} from "lexical";
import {
  $setBlocksType
} from "@lexical/selection";
import {ImageNode} from "../nodes/ImageNode";
import React, { useCallback } from "react";
import { getPreSignedUrls, uploadFile } from "~/apis/questionsAPI";

export const $createImageNode = (file: File, dataURL: string): ImageNode =>
  new ImageNode({ file, dataURL });

export const INSERT_IMAGE_COMMAND = createCommand("create_image");

export const CustomImagePlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext();

  if (!editor.hasNode(ImageNode)) {
    throw new Error('ImagePlugin: "ImageNode" not registered on editor');
  }

  const uploadToAws = useCallback(async (file: File, imageKey: string) => {
    try {
      const preSignedRes = await getPreSignedUrls([{ filename: file.name }]);
      const preSigned = preSignedRes?.[0];
      if (preSigned) {
        editor.update(() => {
          const node = $getNodeByKey(imageKey) as ImageNode;
          node.setAWSPreSigned(preSigned.key);
        });
        await uploadFile(
          preSigned.pre_signed_url,
          file,
          () => {},
        )
        editor.update(() => {
          const node = $getNodeByKey(imageKey) as ImageNode;
          node.setUploadStatus('FINISHED');
        });
      }
    } catch (e) {
      console.log(e);
      editor.update(() => {
        const node = $getNodeByKey(imageKey) as ImageNode;
        node.setUploadStatus('FAILED');
      });
    }
  }, []);

  editor.registerCommand(
    INSERT_IMAGE_COMMAND,
    ({ file, dataURL }: { file: File, dataURL: string }) => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const imageNode = $createImageNode(file, dataURL);
        $setBlocksType(selection, () => imageNode);
        uploadToAws(file, imageNode.getKey());
      }
      return true;
    },
    COMMAND_PRIORITY_NORMAL,
  );

  return null;
};