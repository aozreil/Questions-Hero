export const getKatexLink = (baseUrl: string) => {
  return [
    {
      tagName: "link",
      rel: 'prefetch',
      href: `${baseUrl}/assets/katex.min.css`,
    },
    {
      tagName: "link",
      rel: "stylesheet",
      href: `${baseUrl}/assets/katex.min.css`,
    }];
}