export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto container gap-2 sm:gap-0 text-xs sm:text-[15px] border-t-[2px] border-[#ebf2f6] px-4 md:px-[55px] py-[27px] text-[#6e777f] flex justify-center sm:justify-between items-center flex-wrap">
      <p>
        All copyrights are reserved to{" "}
        <span className="font-bold">{`QUETIONS ® ${currentYear}`}</span>
      </p>
      <div className="flex gap-[30px]">
        <p>Help</p>
        <p>Privacy</p>
        <p>Terms</p>
        <p>About</p>
      </div>
    </footer>
  );
}
