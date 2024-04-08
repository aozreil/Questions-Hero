import { useOverlay } from "~/context/OverlayProvider";
import React from "react";
import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function MainContainer({ children, className }: Props) {
  const { overlayVisible } = useOverlay();

  return (
    <div className={clsx(
      'pb-5 search-page-scroll max-h-[calc(100vh-6rem)] w-full',
      `${overlayVisible ? 'overflow-hidden pr-[12px]' : 'overflow-y-auto'}`,
      className,
    )}>
      {children}
    </div>
  )
}