import { ASKGRAM_BASE } from "~/config/enviromenet";

export const getKatexLink = () => {
  return [
    {
      tagName: "link",
      rel: 'prefetch',
      href: `${ASKGRAM_BASE}/assets/katex.min.css`,
    },
    {
      tagName: "link",
      rel: "stylesheet",
      href: `${ASKGRAM_BASE}/assets/katex.min.css`,
    }];
}