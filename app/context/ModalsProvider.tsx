import { createContext, lazy, ReactNode, Suspense, useContext, useState } from "react";
const OcrSearch = lazy(() => import('~/components/UI/OcrSearch'));

interface IModalsContext {
  setOcrOpened: (open: boolean) => void;
  ocrOpened: boolean;
}

interface Props {
  children: ReactNode;
}

const ModalsContext = createContext<IModalsContext | undefined>(undefined);

export default function ModalsProvider({ children }: Props) {
  const [ocrOpened, setOcrOpened] = useState(false);

  return (
    <>
      {ocrOpened && <Suspense>
        <OcrSearch onClose={() => setOcrOpened(false)} />
      </Suspense>}
      <ModalsContext.Provider value={{ setOcrOpened, ocrOpened }}>
        {children}
      </ModalsContext.Provider>
    </>
  )
}

export function useModals() {
  const context = useContext(ModalsContext);
  if (context === undefined) {
    throw new Error("useModals must be used within an Overlay");
  }
  return context;
}