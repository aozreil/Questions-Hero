import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({ children, className, onClick, disabled }: Props) {
  return (
    <button
      className={clsx('flex items-center justify-center', className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}