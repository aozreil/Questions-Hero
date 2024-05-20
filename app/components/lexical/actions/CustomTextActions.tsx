import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  TextFormatType,
} from 'lexical';
import LexicalActionButton from "~/components/lexical/ui/LexicalActionButton";

interface Props {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
}

export const CustomTextActions = ({ isBold, isItalic, isUnderline }: Props) => {
  const [editor] = useLexicalComposerContext();

  const handleOnClick = (formatType: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType)
  }

  const isSelected = (key: string) => {
    switch (key) {
      case 'Bold': return isBold;
      case 'Italic': return isItalic;
      case 'Underline': return isUnderline;
      default: return false;
    }
  }

  return (
    <div className='flex items-center space-x-2 h-fit'>
      {[
        'Bold',
        'Italic',
        'Underline',
      ].map(value => {
        return (
          <LexicalActionButton
            key={value}
            command={value}
            onClick={() => handleOnClick(value.toLowerCase() as TextFormatType)}
            isSelected={isSelected(value)}
          />
        )
      })}
    </div>
  );
}