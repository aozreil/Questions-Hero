import { Dialog } from "@headlessui/react";
import { Link, useLocation } from "@remix-run/react";
import clsx from "clsx";
import SignInWithGoogle from "~/components/UI/SignInWithGoogle";
import { useScript } from "usehooks-ts";
import { useEffect, useState } from "react";
import { GOOGLE_SIGN_IN_CLIENT_ID } from "~/config/enviromenet";

interface Props {
  closeModal: () => void;
  openLoginModal: () => void;
  openSignupModal: () => void;
  googleLogin: (credential: string) => Promise<void>
  type: "LOGIN" | "SIGNUP" | undefined;
}

export default function LoginModal({ closeModal, openLoginModal, openSignupModal, type, googleLogin }: Props) {
  const pageTitle = type === "LOGIN" ? "Get answers within seconds" : "Explore more";
  const pageDesc = type === "LOGIN" ? "Welcome Back" : "Get your free answers now!";
  const bottomText = type === "LOGIN" ? "Don't have an account?" : "Already have an account?";
  const [currentLocation, setCurrentSolution] = useState<string | undefined>(undefined);
  const location = useLocation();

  const status = useScript("https://accounts.google.com/gsi/client", {
    removeOnUnmount: true
  });

  useEffect(() => {
    // handle location change so that modal should be closed
    if (type && !currentLocation) {
      setCurrentSolution(location?.pathname);
    } else if (type && location?.pathname !== currentLocation){
      setCurrentSolution(undefined);
      closeModal();
    }

    if (!type && currentLocation) {
      setCurrentSolution(undefined);
    }
  }, [location, type, currentLocation]);

  useEffect(() => {
    if(status !== 'ready'){
      return;
    }
    google.accounts.id.initialize({
      client_id: GOOGLE_SIGN_IN_CLIENT_ID,
      callback: async (response) => {
        try {
          if (response.credential) {
            await googleLogin(response.credential);
            closeModal();
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
    google.accounts.id.prompt()
    return () =>{
      if(status === 'ready'){
        google.accounts.id.cancel()
      }
    }
  }, [status]);


  useEffect(() => {
    if(status !== 'ready'){
      return;
    }
    if(!type){
      google.accounts.id.prompt()
    }else{
      google.accounts.id.cancel()
    }
  }, [status, type]);


  return (
    <Dialog open={Boolean(type)} onClose={closeModal} unmount={false}>
      <Dialog.Panel
        className="w-screen h-screen sm:min-h-screen overflow-hidden fixed sm:absolute bg-transparent sm:h-screen z-50 sm:top-0 bottom-0">
        <div
          className="sm:hidden fixed inset-0 bg-black/30 backdrop-blur-sm"
          aria-hidden="true"
          onClick={closeModal}
        />
        <div
          className="max-sm:absolute bottom-0 w-full h-fit sm:min-h-[100vh] max-sm:rounded-t-3xl bg-[#f7f8fa] flex flex-col items-center">
          <section
            className="w-full hidden sm:flex justify-between items-center border-t-[3px] border-t-[#070707] px-4 md:px-14 pt-7 pb-6">
            <Link to="/" className="block w-fit" onClick={closeModal}>
              <img src="/assets/images/logo.svg" alt="logo" className="h-7" />
            </Link>
            <button onClick={closeModal}>
              <img
                src="/assets/images/close-button.svg"
                alt="close"
                className="cursor-pointer"
                width={40}
                height={40}
              />
            </button>
          </section>
          <div className="absolute top-4 right-4 sm:hidden">
            <button onClick={closeModal}>
              <img
                src="/assets/images/close-button.svg"
                alt="close"
                className="cursor-pointer"
                width={30}
                height={30}
              />
            </button>

          </div>
          <section className="w-full flex flex-col items-center gap-4 sm:gap-8 mt-12 sm:mt-12 text-[#070707]">
            <p className="text-xl sm:text-4xl font-semibold">{pageTitle}</p>
            <p className="text-2xl sm:text-5xl font-bold">{pageDesc}</p>
          </section>
          <section className="w-full mt-12 gap-4 flex flex-col items-center font-semibold text-xl">
             <SignInWithGoogle isReady={status === 'ready'} type={type}/>
          </section>
          {type === "SIGNUP" && (
            <p className="max-sm:w-[90%] text-center sm:text-sm text-[#4d6473] mt-6 sm:mt-12">
              By creating an account, you accept the Askgram
              <Link to={"/terms/terms-of-use"} target="_blank" className="text-black font-medium ml-1">Terms of Service</Link>
              <span className="mx-1">&amp;</span>
              <Link to="/terms/privacy-policy" target="_blank" className="text-black font-medium ml-1">Privacy
                Policy</Link>
            </p>
          )}
          <section className="w-full pt-10 mt-auto bottom-0 flex flex-col items-center gap-4 sm:gap-6 pb-5">
            <p className="text-sm text-[#4d6473]">{bottomText}</p>
            <div className="max-sm:hidden border border-t-[#ebf2f6] broder-t-4 w-full" />
            <div className="bg-[#afafb0] flex rounded-full px-5 py-1.5 text-sm text-[#d7d8da] gap-6">
              <button className={clsx("cursor-pointer hover:text-[#f9fafc]", { "text-[#f9fafc]": type === "LOGIN" })}
                      onClick={openLoginModal}>
                Log in
              </button>
              <button className={clsx("cursor-pointer hover:text-[#f9fafc]", { "text-[#f9fafc]": type === "SIGNUP" })}
                      onClick={openSignupModal}>
                Sign up
              </button>
            </div>
          </section>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}