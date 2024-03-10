import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import LoginModal from "~/components/LoginModal";
import { getMe, loginWithGoogle, logoutAPI } from "~/apis/userAPI";
import { AxiosError } from "axios";

interface Props {
  children: ReactNode;
}

export interface AuthContextType {
  openLoginModal: () => void;
  openSignUpModal: () => void;
  user?: IUser;
  logout: () => void;
  isLoadingUserData: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: Props) {
  const [authModal, setAuthModal] = useState<undefined | "LOGIN" | "SIGNUP">(undefined);
  const [user, setUser] = useState<undefined | IUser>(undefined);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  useEffect(() => {
    getUserData()
      .finally(() => {
        setIsLoadingUserData(false);
      });
  }, []);

  const getUserData = async () => {
    try {
      const data = await getMe();
      if (data?.view_name) {
        setUser(data);
      }
    } catch (e) {
      if (e instanceof AxiosError && e.status !== 401) {
        console.error(e);
      }
    }
  };

  const logout = useCallback(async () => {
    setUser(undefined);
    await logoutAPI();
  }, []);

  const openLoginModal = () => {
    if (user) {
      return;
    }
    setAuthModal("LOGIN");
  };

  const openSignUpModal = () => {
    if (user) {
      return;
    }
    setAuthModal("SIGNUP");
  };

  const googleLogin = async (credential: string) => {
    const user = await loginWithGoogle(credential);
    if (user?.id) {
      setUser(user);
    }
  };

  const closeModal = useCallback(() => {
    setAuthModal(undefined);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        openLoginModal,
        openSignUpModal,
        user,
        logout,
        isLoadingUserData
      }}
    >
      {children}
      {!user && !isLoadingUserData && <LoginModal
        type={authModal}
        closeModal={closeModal}
        openLoginModal={openLoginModal}
        openSignupModal={openSignUpModal}
        googleLogin={googleLogin}
      />}

    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}