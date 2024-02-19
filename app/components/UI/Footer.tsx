export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto container gap-2 sm:gap-0 text-xs sm:text-base border-t-0.2 border-[#ebf2f6] px-4 md:px-14 py-7 text-[#6e777f] flex justify-center sm:justify-between items-center flex-wrap">
      <p>
        All copyrights are reserved to{" "}
        <span className="font-bold">{`Askgram ® ${currentYear}`}</span>
      </p>
      <div className="flex gap-7">
        <p>Help</p>
        <p>Privacy</p>
        <p>Terms</p>
        <p>About</p>
      </div>
    </footer>
  );
}
