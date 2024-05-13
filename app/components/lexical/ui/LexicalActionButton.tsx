import clsx from "clsx";
import {
  BoldIcon,
  ItalicIcon,
  ImagesIcon,
  NumberedListIcon,
  UnorderedListIcon,
  UnderlineIcon,
  TextLarger,
  TextSmaller
} from "~/components/lexical/ToolbarIcons";

interface Props {
  command: string;
  onClick: () => void;
  isSelected?: boolean;
}

const ASSETS_MAPPER: { [key: string]: JSX.Element } = {
  'Bold': <BoldIcon />,
  'Italic': <ItalicIcon />,
  'Underline': <UnderlineIcon />,
  'user_image': <ImagesIcon />,
  'list-numbered': <NumberedListIcon />,
  'list-unordered': <UnorderedListIcon />,
  'text-larger': <TextLarger />,
  'text-smaller': <TextSmaller />,
}

export default function LexicalActionButton({ command, onClick, isSelected }: Props) {
  if (!ASSETS_MAPPER.hasOwnProperty(command)) return null;
  return (
    <button
      key={command}
      onClick={onClick}
      className={clsx('p-1 rounded-md', isSelected ? 'bg-neutral-400' : 'hover:bg-neutral-300')}
    >
      {ASSETS_MAPPER.hasOwnProperty(command) ? ASSETS_MAPPER[command] : null}
    </button>
  )
}