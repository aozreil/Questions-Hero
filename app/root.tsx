import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration, useRouteError
} from "@remix-run/react";
import stylesheet from "~/styles/tailwind.css";
import { MetaFunction } from "@remix-run/node";
import {getSeoMeta} from "~/utils/seo";
import NotFoundPage from "~/components/UI/NotFoundPage";
import { ReactNode } from "react";
import Header from "~/components/UI/Header";
import FavIcon from "~/components/UI/FavIcon";
import { GOOGLE_ANALYTICS_KEY } from "~/config/enviromenet";
import AuthProvider from "~/context/AuthProvider";
import { useIsBot } from "~/context/IsBotContext";
import OverlayProvider from "~/context/OverlayProvider";
import ModalsProvider from "~/context/ModalsProvider";

export const meta: MetaFunction = () => ([
  ...getSeoMeta({}),
]);

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "preload", href: stylesheet, as: "style"},
  { rel: "stylesheet", href: stylesheet },
];

function Document({children}: {children: ReactNode}) {
  return <html lang="en">
  <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <Meta />
    <Links />
    <FavIcon />
    <title>Ask Gram</title>
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_KEY}`}></script>
    <script dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', '${GOOGLE_ANALYTICS_KEY}');`
    }}>
    </script>
  </head>
  <body>
    <AuthProvider>
      <OverlayProvider>
        <ModalsProvider>
          {children}
        </ModalsProvider>
      </OverlayProvider>
    </AuthProvider>
  </body>
  </html>;
}

export default function App() {
  const isBot = useIsBot();
  return (
    <Document>
      <Outlet />
      <ScrollRestoration />
      {isBot ? null : <Scripts />}
      <LiveReload />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <Document>
        <Header />
        <NotFoundPage />
      </Document>;
    }
    return (
      <Document>
        <div>
          <h1>
            {error.status} {error.statusText}
          </h1>
          <p>{error.data}</p>
        </div>
      </Document>
    );
  } else if (error instanceof Error) {
    return (
      <Document>
        <div>
          <h1>Error</h1>
          <p>{error.message}</p>
          <p>The stack trace is:</p>
          <pre>{error.stack}</pre>
        </div>
      </Document>
    );
  } else {
    return <Document><h1>Unknown Error</h1></Document>;
  }
}
