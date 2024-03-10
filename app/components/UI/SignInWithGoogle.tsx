import { useEffect, useRef } from "react";
import clsx from "clsx";

interface Props {
  type?: string;
  isReady: boolean;
}

export default function SignInWithGoogle({isReady, type}: Props) {
  const googleSignInRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!googleSignInRef.current || !type) {
      return;
    }
    if(googleSignInRef.current.hasChildNodes()){
      return;
    }
    google.accounts.id.renderButton(googleSignInRef.current, {
      theme: "outline",
      size: "large",
      type: "standard",
      shape: "pill",
      text: "continue_with",
      width: 400,
      locale: "en-US",
      logo_alignment: "center",
    });
  }, [googleSignInRef, isReady, type]);


  return (
    <div className={'max-h-10'}>
      <div className={clsx('scale-75 xs:scale-100 sm:scale-125')} ref={googleSignInRef} />
    </div>
  );
}