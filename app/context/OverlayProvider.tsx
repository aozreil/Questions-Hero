import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "@remix-run/react";

interface IOverlayContext {
  overlayVisible: boolean;
  setOverlayVisible: (visible: boolean) => void;
  focusedOverlayStyles: string;
}

const FOCUSED_OVERLAY = 'z-[100]';
const OverlayContext = createContext<IOverlayContext | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export default function OverlayProvider({ children }: Props) {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const hideOverlay = useCallback(() => setOverlayVisible(false), []);
  const location = useLocation();

  useEffect(() => {
    if (overlayVisible) {
      setOverlayVisible(false);
    }
  }, [location]);

  return (
    <div className="relative min-h-screen bg-[#f7f8fa] flex flex-col">
      {(
        <Link to='/ask-question' className='lg:hidden fixed z-50 right-2 bottom-20 w-16 h-16 bg-[#0b39dc] rounded-full flex items-center justify-center'>
          <img src='/assets/images/chat-icon.png' alt='ask-question' className='w-10 h-10' />
        </Link>
      )}
      {overlayVisible && (
        <div
          className="fixed inset-0 z-50 w-screen h-screen bg-black/30 backdrop-blur-sm"
          aria-hidden="true"
          onClick={hideOverlay}
        />
      )}
      <OverlayContext.Provider value={{
        overlayVisible,
        setOverlayVisible,
        focusedOverlayStyles: overlayVisible ? FOCUSED_OVERLAY : '',
      }}>
        {children}
      </OverlayContext.Provider>
    </div>
  )
}

export function useOverlay() {
  const context = useContext(OverlayContext);
  if (context === undefined) {
    throw new Error("useOverlay must be used within an Overlay");
  }
  return context;
}