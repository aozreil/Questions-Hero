import { useCallback, useEffect, useRef } from "react";
import { loginWithGoogle } from "~/apis/userAPI";
import { GOOGLE_SIGN_IN_CLIENT_ID } from "~/config/enviromenet";
import { useScript } from 'usehooks-ts';
import { AuthContextType } from "~/context/AuthProvider";

interface Props {
  updateState: AuthContextType['updateState'];
  isLoggedIn: boolean;
}

export default function useGoogleOneTab({ updateState, isLoggedIn }: Props) {
  const status = useScript('https://accounts.google.com/gsi/client',  {
    removeOnUnmount: true,
  });
  const refLoggedIn = useRef(false);

  useEffect(() => {
    if (!isLoggedIn && status === 'ready') {
      setTimeout(() => {
        if (refLoggedIn.current) return;
        google.accounts.id.initialize({
          client_id: GOOGLE_SIGN_IN_CLIENT_ID,
          callback: handleGoogleLogin,
        });

        google.accounts.id.prompt();
      }, 7000);
    }
  }, [status, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && status === 'ready') {
      refLoggedIn.current = true;
      google.accounts.id.cancel();
    } else {
      refLoggedIn.current = false;
    }
  }, [isLoggedIn]);

  const handleGoogleLogin = useCallback(async (response: any) => {
    try {
      if (response?.credential) {
        const userResponse = await loginWithGoogle(response.credential);
        if (userResponse?.id) { updateState(userResponse) }
      }
    } catch (e) {
      console.log(e);
    }
  }, []);
}