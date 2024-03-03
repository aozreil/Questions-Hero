import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import LoginModal from "~/components/LoginModal";
import { Dialog } from '@headlessui/react'
import useGoogleOneTab from "~/hooks/useGoogleOneTab";
import { getMe, logoutAPI } from "~/apis/userAPI";

interface Props {
  children: ReactNode;
}

export interface AuthContextType {
  openLoginModal: () => void;
  openSignUpModal: () => void;
  user?: IUser;
  logout: () => void;
  updateState: (user?: IUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: Props) {
  const [authModal, setAuthModal] = useState<undefined | 'LOGIN' | 'SIGNUP'>(undefined);
  const [user, setUser] = useState<undefined | IUser>(undefined);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = useCallback(async () => {
    try {
      const data = await getMe();
      if (data?.view_name) {
        setUser(data);
      }
    } catch (e) {
      console.log(e);
    }

    setIsLoadingUserData(false);
  }, []);

  const logout = useCallback(() => {
    setUser(undefined);
    logoutAPI();
  }, []);

  const openLoginModal = useCallback(() => {
    setAuthModal('LOGIN')
  },[]);

  const openSignUpModal = useCallback(() => {
    setAuthModal("SIGNUP");
  },[]);

  const closeModal = useCallback(() => {
    setAuthModal(undefined);
  },[]);

  const updateState = useCallback((user?: IUser) => {
    !!user ? setUser(user) : getUserData();
    closeModal();
  }, []);

  useGoogleOneTab({ isLoggedIn: isLoadingUserData || !!user, updateState });

  return (
    <AuthContext.Provider
      value={{
        openLoginModal,
        openSignUpModal,
        user,
        logout,
        updateState
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