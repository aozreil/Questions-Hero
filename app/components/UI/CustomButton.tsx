import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function CustomButton({ children, className, onClick }: Props) {
  return (
    <button
      className={clsx('flex items-center justify-center', className)}
      onClick={onClick}
    >
      {children}
    </button>
  )
}