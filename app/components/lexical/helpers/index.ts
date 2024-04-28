import { LexicalNode, ParagraphNode, $getRoot } from 'lexical';

export const isUploadingImages = (jsonState: any) => {
  for (const child of jsonState?.root?.children) {
    if (child.type === 'user_image' && child.uploadStatus === 'UPLOADING') {
      return true;
    }
  }
  return false;
};

export const filterEmptyNodes = (nodes: [string, LexicalNode][]) => {
  for (const [, node] of nodes) {
    if (node instanceof ParagraphNode) {
      const content = node.getTextContent().trim();

      if (content) {
        break;
      }

      node.remove();
    }
  }
};

export const getEditorTextOutput = () => {
  const textOutput = $getRoot()?.getTextContent();
  return cleanText(textOutput);
}

function cleanText(text: string) {
  // Replace multiple spaces with a single space
  // Replace newline characters with a space
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n/g, ' ');
}