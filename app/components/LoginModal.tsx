import { Dialog } from "@headlessui/react";
import { Link } from "@remix-run/react";
import clsx from "clsx";
import SignInWithGoogle from "~/components/UI/SignInWithGoogle";

interface Props {
  closeModal: () => void;
  openLoginModal: () => void;
  openSignupModal: () => void;
  type: 'LOGIN' | 'SIGNUP';
}

export default function LoginModal({ closeModal, openLoginModal, openSignupModal, type }: Props) {
  const pageTitle = type === 'LOGIN' ? 'Get answers within seconds' : 'Explore more';
  const pageDesc = type === 'LOGIN' ? 'Welcome Back' : 'Get your free answers now!';
  const bottomText = type === 'LOGIN' ? "Don't have an account?" : 'Already have an account?';
  return (
    <Dialog.Panel className="w-screen h-screen sm:min-h-screen overflow-y-auto fixed sm:absolute bg-transparent sm:h-screen z-50 sm:top-0 bottom-0">
      <div
        className="sm:hidden fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
        onClick={closeModal}
      />
      <div className='max-sm:absolute bottom-0 w-full h-fit sm:min-h-[100vh] max-sm:rounded-t-3xl bg-[#f7f8fa] flex flex-col items-center'>
        <section className='w-full hidden sm:flex justify-between items-center border-t-[3px] border-t-[#070707] px-4 md:px-14 pt-7 pb-6'>
          <Link to='/' className='block w-fit'>
            <img src='/assets/images/logo.svg' alt='logo' className='h-7' />
          </Link>
          <img
            src='/assets/images/close-button.svg'
            alt='close'
            className='cursor-pointer'
            width={40}
            height={40}
            onClick={closeModal}
          />
        </section>
        <div className='absolute top-4 right-4 sm:hidden'>
          <img
            src='/assets/images/close-button.svg'
            alt='close'
            className='cursor-pointer'
            width={30}
            height={30}
            onClick={closeModal}
          />
        </div>
        <section className='w-full flex flex-col items-center gap-4 sm:gap-8 mt-12 sm:mt-12 text-[#070707]'>
          <p className='text-xl sm:text-4xl font-semibold'>{pageTitle}</p>
          <p className='text-2xl sm:text-5xl font-bold'>{pageDesc}</p>
        </section>
        <section className='w-full mt-12 gap-4 flex flex-col items-center font-semibold text-xl'>
          <SignInWithGoogle isSignUp={type === 'SIGNUP'} onSuccess={closeModal} />
        </section>
        <p className='max-sm:w-[90%] text-center sm:text-lg text-[#4d6473] mt-6 sm:mt-12'>
          By creating an account, you accept the Askgram
          <Link to={'/terms/terms-of-use'} className='text-black font-medium ml-1'>Terms of Service &amp; Privacy Policy</Link>
        </p>
        <section className='w-full pt-10 mt-auto bottom-0 flex flex-col items-center gap-4 sm:gap-6 pb-5'>
          <p className='text-lg text-[#4d6473] '>{bottomText}</p>
          <div className='max-sm:hidden border border-t-[#ebf2f6] broder-t-4 w-full' />
          <div className='bg-[#afafb0] flex rounded-full px-5 py-1.5 text-sm text-[#d7d8da] gap-6'>
            <p className={clsx('cursor-pointer', { 'text-[#f9fafc]': type === 'LOGIN' })} onClick={openLoginModal}>
              Log in
            </p>
            <p className={clsx('cursor-pointer', { 'text-[#f9fafc]': type === 'SIGNUP' })} onClick={openSignupModal}>
              Sign up
            </p>
          </div>
        </section>
      </div>
    </Dialog.Panel>
  )
}