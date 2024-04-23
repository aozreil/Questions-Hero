import { ASKGRAM_BASE } from "~/config/enviromenet";

export const getKatexLink = () => {
  return [
    {
      rel: 'prefetch',
      href: `${ASKGRAM_BASE}/assets/katex.min.css`,
    },
    {
      rel: "stylesheet",
      href: `${ASKGRAM_BASE}/assets/katex.min.css`,
    }];
}
