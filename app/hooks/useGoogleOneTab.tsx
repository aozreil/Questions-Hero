import { useCallback, useEffect } from "react";
import { loginWithGoogle } from "~/apis/userAPI";
import { GOOGLE_SIGN_IN_CLIENT_ID } from "~/config/enviromenet";
import { useScript } from 'usehooks-ts';
import { AuthContextType, useAuth } from "~/context/AuthProvider";

interface Props {
  updateState: AuthContextType['updateState'],
  isLoggedIn: boolean,
}

export default function useGoogleOneTab({ updateState, isLoggedIn }: Props) {
  const status = useScript('https://accounts.google.com/gsi/client',  {
    removeOnUnmount: true,
  });

  useEffect(() => {
    if (!isLoggedIn && status === 'ready') {
      google.accounts.id.initialize({
        client_id: GOOGLE_SIGN_IN_CLIENT_ID,
        callback: handleGoogleLogin,
      });

      google.accounts.id.prompt();
    }
  }, [status, isLoggedIn]);

  const handleGoogleLogin = useCallback(async (response: any) => {
    try {
      if (response?.credential) {
        const userResponse = await loginWithGoogle(response.credential);
        if (userResponse?.user_id) { updateState(userResponse) }
      }
    } catch (e) {
      console.log(e);
    }
  }, []);
}