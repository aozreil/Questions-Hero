import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { CookieConstants } from "~/services/cookie.service";

const getFaviconPath = (isDarkMode = false) => {
  return `/assets/favicon-${isDarkMode ? "light" : "dark"}.ico`;
};

interface Props {
  prefersDarkColorScheme?: string;
}

export default function FavIcon({ prefersDarkColorScheme }: Props) {
  const [faviconHref, setFaviconHref] = useState(() => {
    return getFaviconPath(prefersDarkColorScheme === 'true');
  });

  useEffect(() => {
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    const isDarkMode = matcher.matches;
    
    if (Cookies.get(CookieConstants.PREFERS_DARK_COLOR_SCHEME) !== String(isDarkMode)) {
      Cookies.set(CookieConstants.PREFERS_DARK_COLOR_SCHEME, String(isDarkMode));
      setFaviconHref(getFaviconPath(matcher.matches));
    }
  }, []);

  return (
    <link rel="icon" href={faviconHref} />
  )
}