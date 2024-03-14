import Header from "~/components/UI/Header";
import { Outlet } from "@remix-run/react";
import { createContext, useCallback, useContext, useState } from "react";

interface IOverlayContext {
  overlayVisible: boolean;
  setOverlayVisible: (visible: boolean) => void;
  focusedOverlayStyles: string;
}

const FOCUSED_OVERLAY = 'z-[100]';
const OverlayContext = createContext<IOverlayContext | undefined>(undefined);

export default function Main() {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const hideOverlay = useCallback(() => setOverlayVisible(false), []);
  return (
    <div className="relative min-h-screen bg-[#f7f8fa] flex flex-col">
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
        <Header />
        <Outlet />
      </OverlayContext.Provider>
    </div>
  );
}

export function useOverlay() {
  const context = useContext(OverlayContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}