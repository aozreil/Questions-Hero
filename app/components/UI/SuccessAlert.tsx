import { ReactNode } from "react";
import clsx from "clsx";

interface IProps {
  children: ReactNode,
  className?: string
}

export default function SuccessAlert({ children, className }: IProps) {
  return (
    <div className={clsx("bg-green-50 p-4", className)}>
      <div className="flex container text-green-500">
        {children}
      </div>
    </div>
  );
}