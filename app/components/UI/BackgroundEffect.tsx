import { ReactNode } from "react";
import clsx from "clsx";

interface Props {
  className?: string;
  children: ReactNode;
}

export default function BackgroundEffect({ className, children }: Props) {
  return (
    <div className={clsx('w-full h-[35vw] md:h-[17vw] -my-4 sm:-my-8 md:my-0 xl:-my-10 relative flex items-center justify-center', className)}>
      <div className='absolute h-full left-0 top-0 w-full z-10'>
        <img src='/assets/images/mobile-highlight.png' className='md:hidden bg-effect w-full object-fill' />
        <img src='/assets/images/background-effect-thin.png' className='max-md:hidden bg-effect w-full object-fill' />
      </div>
      {children}
    </div>
  )
}