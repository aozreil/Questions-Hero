import {
  EditorConfig,
  ElementNode,
  LexicalEditor,
  SerializedElementNode,
  Spread,
  $createParagraphNode,
  LexicalNode,
  RangeSelection,
  DOMExportOutput,
} from "lexical";
import { ATTACHMENTS_BASE } from "~/config/enviromenet";

export type SerializedImageNode = Spread<
  { file: File; dataURL: string, awsSrc?: string, preSignedKey?: string },
  SerializedElementNode
>;

export class ImageNode extends ElementNode {
  __dataURL: string;
  __file: File;
  __awsSrc?: string;
  __preSignedKey?: string;
  __width?: number;
  __height?: number;

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
    const element = document.createElement('img');
    element.setAttribute('src', this.__dataURL);
    element.className = _config.theme.user_image;

    const updateImageDimensions = (imageWidth?: number, imageHeight?: number) => {
      if (imageWidth && imageHeight) {
        _editor.update(() => {
          this.setWidthAndHeight(imageWidth, imageHeight)
        })
      }
    }
    element.onload = function() {
      const imageRef = this as HTMLImageElement;
      const imageWidth = imageRef.width;
      const imageHeight = imageRef.height;
      updateImageDimensions(imageWidth, imageHeight)
    }

    return element;
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const element = document.createElement('img');
    element.setAttribute('src', this.__awsSrc || '');
    element.setAttribute('key', this.__preSignedKey || '');
    if (this.__width) element.setAttribute('width', this.__width?.toString());
    if (this.__height) element.setAttribute('height', this.__height?.toString());
    return { element };
  }

  setAWSPreSigned(preSigned: string): void {
    const self = this.getWritable();
    self.__preSignedKey = preSigned;
    self.__awsSrc = `${ATTACHMENTS_BASE}/${preSigned}`;
  }

  setWidthAndHeight(width: number, height: number): void {
    const self = this.getWritable();
    self.__width = width;
    self.__height = height;
  }

  constructor(file: File, dataURL: string, awsSrc?: string, preSignedKey?: string, width?: number, height?: number) {
    super();
    this.__file = file;
    this.__dataURL = dataURL;
    this.__awsSrc = awsSrc;
    this.__preSignedKey = preSignedKey;
    this.__width = width;
    this.__height = height;
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__file,
      node.__dataURL,
      node.__awsSrc,
      node.__preSignedKey,
      node.__width,
      node.__height,
    );
  }

  static getType(): string {
    return "user_image";
  }

  updateDOM(
    _prevNode: unknown,
    _dom: HTMLElement,
    _config: EditorConfig,
  ): boolean {
    return false;
  }

  collapseAtStart(_: RangeSelection): boolean {
    const paragraphNode = $createParagraphNode();
    this.replace(paragraphNode);
    return true;
  }

  insertNewAfter(
    _: RangeSelection,
    restoreSelection?: boolean,
  ): LexicalNode | null {
    const paragraph = $createParagraphNode();
    const direction = this.getDirection();
    paragraph.setDirection(direction);
    this.insertAfter(paragraph, restoreSelection);

    return paragraph;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return new ImageNode(serializedNode.file, serializedNode.dataURL);
  }

  exportJSON(): SerializedImageNode {
    return {
      type: "user_image",
      version: 1,
      children: [],
      file: this.__file,
      dataURL: this.__dataURL,
      awsSrc: this.__awsSrc,
      preSignedKey: this.__preSignedKey,
      format: "",
      indent: 1,
      direction: null,
    };
  }
}