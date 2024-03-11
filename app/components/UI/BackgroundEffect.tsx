import { ReactNode } from "react";
import clsx from "clsx";

interface Props {
  className?: string;
  children: ReactNode;
}

export default function BackgroundEffect({ className, children }: Props) {
  return (
    <div className={clsx('w-full h-[17vw] sm:-my-6 lg:-my-12 xl:-my-14 relative flex items-center justify-center', className)}>
      <div className='absolute h-full left-0 top-0 w-full z-10'>
        <img src='/assets/images/background-effect.png' className='bg-effect w-full object-fill' />
      </div>
      {children}
    </div>
  )
}