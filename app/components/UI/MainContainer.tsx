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
      'pb-5 search-page-scroll h-full w-full mb-48',
      `${overlayVisible ? 'overflow-hidden pr-[12px]' : 'overflow-y-auto'}`,
      className,
    )}>
      {children}
    </div>
  )
}
