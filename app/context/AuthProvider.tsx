import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import LoginModal from "~/components/LoginModal";
import { Dialog } from '@headlessui/react'

interface Props {
  children: ReactNode;
}

interface AuthContextType {
  openLoginModal: () => void;
  openSignUpModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: Props) {
  const [authModal, setAuthModal] = useState<undefined | 'LOGIN' | 'SIGNUP'>(undefined);

  const openLoginModal = useCallback(() => {
    setAuthModal('LOGIN')
  },[]);

  const openSignUpModal = useCallback(() => {
    setAuthModal("SIGNUP");
  },[]);

  const closeModal = useCallback(() => {
    setAuthModal(undefined);
  },[]);

  const switchModal = useCallback(() => {
    setAuthModal(authModal === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
  },[authModal]);

  return (
    <AuthContext.Provider
      value={{
        openLoginModal,
        openSignUpModal
      }}
    >
      {children}
      <Dialog open={!!authModal} onClose={closeModal}>
        <LoginModal
          type={!!authModal ? authModal : 'LOGIN'}
          closeModal={closeModal}
          openLoginModal={openLoginModal}
          openSignupModal={openSignUpModal}
        />
      </Dialog>
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}