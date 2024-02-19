import { useEffect, useState } from "react";

const getFaviconPath = (isDarkMode = false) => {
  return `/assets/favicon-${isDarkMode ? "light" : "dark"}.ico`;
};

export default function FavIcon() {
  const [faviconHref, setFaviconHref] = useState("/assets/favicon-dark.ico");

  useEffect(() => {
    // Get current color scheme.
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    // Set favicon initially.
    setFaviconHref(getFaviconPath(matcher.matches));
    // Change favicon if the color scheme changes.
    matcher.onchange = () => setFaviconHref(getFaviconPath(matcher.matches));
  }, [faviconHref]);

  return (
    <link rel="icon" href={faviconHref} />
  )
}