import { PRODUCT_LOGO_IMAGE } from "~/config/enviromenet";

export default function Header() {
    return (
      <header className={
        `sticky top-0 z-40 h-24 w-full bg-[#f7f8fa] flex items-center justify-center border-t-[3px] border-t-[#070707] max-sm:px-4 pt-7 pb-6`
      }>
          <img src={PRODUCT_LOGO_IMAGE} alt='logo' className='h-8 sm:h-10 w-fit min-w-14 object-contain' height={32} />
        </header>
    )
}