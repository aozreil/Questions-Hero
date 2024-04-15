import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {FORMAT_TEXT_COMMAND, TextFormatType} from 'lexical';
import LexicalActionButton from "~/components/lexical/ui/LexicalActionButton";

export const CustomTextActions = () => {
  const [editor] = useLexicalComposerContext();

  const handleOnClick = (formatType: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType)
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
          />
        )
      })}
    </div>
  );
}