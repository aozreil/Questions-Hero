import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import LoginModal from "~/components/LoginModal";
import { getMe, loginWithGoogle, logoutAPI } from "~/apis/userAPI";
import { IMeUser } from "~/models/questionModel";
import { useAnalytics } from "~/hooks/useAnalytics";
import { CanceledError } from "axios";

interface Props {
  children: ReactNode;
}

export interface AuthContextType {
  openLoginModal: () => void;
  openSignUpModal: () => void;
  user?: IMeUser;
  logout: () => void;
  isLoadingUserData: boolean;
  updateUserInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: Props) {
  const [authModal, setAuthModal] = useState<undefined | "LOGIN" | "SIGNUP">(undefined);
  const [user, setUser] = useState<undefined | IMeUser>(undefined);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const { trackSignUpEvent, trackLoginEvent, trackEvent, identifyUserById } = useAnalytics();

  async function getMeUser(controller?: AbortController) {
    try {
      const data = await getMe({
        signal: controller?.signal
      });
      if (data?.view_name) {
        setUser({
          ...data, user_info: {
            ...data.user_info,
          }
        });
        setIsLoadingUserData(false);
      } else {
        setIsLoadingUserData(false);
      }
    } catch (e) {
      if (!(e instanceof CanceledError)) {
        setIsLoadingUserData(false);
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    getMeUser(controller)
      .then(() => {

      });
    return () => {
      controller.abort();
    };
  }, []);


  useEffect(() => {
    if (user?.id) {
      identifyUserById(`${user.id}`);
    }
  }, [user]);

  const logout = async () => {
    setUser(undefined);
    trackEvent("logout");
    await logoutAPI();
  };

  const openLoginModal = () => {
    if (user) {
      return;
    }
    trackEvent("login_open_login");
    setAuthModal("LOGIN");
  };

  const updateUserInfo = async () => {
    return await getMeUser();
  };

  const openSignUpModal = () => {
    if (user) {
      return;
    }
    trackEvent("login_open_sign_up");
    setAuthModal("SIGNUP");
  };

  const googleLogin = async (credential: string) => {
    const user = await loginWithGoogle(credential);
    if (user?.id) {
      setUser(user);
      if (authModal === "LOGIN") {
        trackLoginEvent("Google");
      } else if (authModal === "SIGNUP") {
        trackSignUpEvent("Google");
      } else {
        trackSignUpEvent("Google");
      }
    }
  };

  const closeModal = () => {
    trackEvent("login_close_login");
    setAuthModal(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        openLoginModal,
        openSignUpModal,
        user,
        logout,
        isLoadingUserData,
        updateUserInfo
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
