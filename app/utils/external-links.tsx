export const getKatexLink = () => {
  return [
    {
      rel: "prefetch",
      href: `/assets/katex.min.css`
    },
    {
      rel: "stylesheet",
      href: `/assets/katex.min.css`
    }];
};
