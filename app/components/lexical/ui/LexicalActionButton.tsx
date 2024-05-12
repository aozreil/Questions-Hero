import clsx from "clsx";

interface Props {
  command: string;
  onClick: () => void;
  isSelected?: boolean;
}

const ASSETS_MAPPER: { [key: string]: string } = {
  'Bold': '/assets/images/lexical/bold.png',
  'Italic': '/assets/images/lexical/italic.png',
  'Underline': '/assets/images/lexical/underline.png',
  'user_image': '/assets/images/lexical/attach.png',
  'list-numbered': '/assets/images/lexical/numbered.png',
  'list-unordered': '/assets/images/lexical/unordered.png',
  'text-larger': '/assets/images/lexical/larger.png',
  'text-smaller': '/assets/images/lexical/smaller.png',
}

export default function LexicalActionButton({ command, onClick, isSelected }: Props) {
  if (!ASSETS_MAPPER.hasOwnProperty(command)) return null;
  return (
    <button
      key={command}
      onClick={onClick}
      className={clsx('w-7', isSelected && 'border-b-[3px] border-b-[#070707]')}
    >
      <img src={ASSETS_MAPPER[command]} alt={command} className='w-full' />
    </button>
  )
}