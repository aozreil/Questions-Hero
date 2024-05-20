import {
  LexicalNode,
  ParagraphNode,
  $getRoot,
  BaseSelection,
  ElementNode,
  $isElementNode,
  $isRootOrShadowRoot,
  $isLineBreakNode,
  $isTextNode,
} from 'lexical';
import invariant from "tiny-invariant";

export const isUploadingImages = (jsonState: any) => {
  for (const child of jsonState?.root?.children) {
    if (child.type === 'user_image' && child.uploadStatus === 'UPLOADING') {
      return true;
    }
  }
  return false;
};

export const doesIncludeImages = (jsonState: any) => {
  for (const child of jsonState?.root?.children) {
    if (child.type === 'user_image') {
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

export function INTERNAL_$isBlock(node: LexicalNode): node is ElementNode {
  if (!$isElementNode(node) || $isRootOrShadowRoot(node)) {
    return false;
  }

  const firstChild = node.getFirstChild();
  const isLeafElement =
    firstChild === null ||
    $isLineBreakNode(firstChild) ||
    $isTextNode(firstChild) ||
    firstChild.isInline();

  return !node.isInline() && node.canBeEmpty() !== false && isLeafElement;
}

export function $setBlocksType(
  selection: BaseSelection | null,
  createElement: () => ElementNode,
): void {
  if (selection === null) {
    return;
  }
  const anchorAndFocus = selection.getStartEndPoints();
  const anchor = anchorAndFocus ? anchorAndFocus[0] : null;

  if (anchor !== null && anchor.key === 'root') {
    const element = createElement();
    const root = $getRoot();
    const firstChild = root.getFirstChild();

    if (firstChild) {
      firstChild.replace(element, true);
    } else {
      root.append(element);
    }

    return;
  }

  const nodes = selection.getNodes();
  const firstSelectedBlock =
    anchor !== null ? $getAncestor(anchor.getNode(), INTERNAL_$isBlock) : false;
  if (firstSelectedBlock && nodes.indexOf(firstSelectedBlock) === -1) {
    nodes.push(firstSelectedBlock);
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (!INTERNAL_$isBlock(node)) {
      continue;
    }

    invariant($isElementNode(node), 'Expected block node to be an ElementNode');

    const targetElement = createElement();
    targetElement.setFormat(node.getFormatType());
    targetElement.setIndent(node.getIndent());
    node.replace(targetElement, true);
  }
}

export function $getAncestor<NodeType extends LexicalNode = LexicalNode>(
  node: LexicalNode,
  predicate: (ancestor: LexicalNode) => ancestor is NodeType,
) {
  let parent = node;
  while (parent !== null && parent.getParent() !== null && !predicate(parent)) {
    parent = parent.getParentOrThrow();
  }
  return predicate(parent) ? parent : null;
}