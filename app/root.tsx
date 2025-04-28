import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
 useLoaderData,
  useRouteError,
  useRouteLoaderData,
} from "@remix-run/react";
import stylesheet from "~/styles/tailwind.css";
import { json, MetaFunction } from "@remix-run/node";
import {getSeoMeta} from "~/utils/seo";
import NotFoundPage from "~/components/UI/NotFoundPage";
import { ReactNode, useEffect } from "react";
import Header from "~/components/UI/Header";
import FavIcon from "~/components/UI/FavIcon";
import { GOOGLE_ANALYTICS_KEY, PRODUCT_NAME, SMARTLOOK_KEY } from "~/config/enviromenet";
import { useIsBot } from "~/context/IsBotContext";
import { LoaderFunctionArgs } from "@remix-run/router";
import { getRequestCookie } from "~/utils/text-formatting-utils";
import { CookieConstants } from "~/services/cookie.service";

export const meta: MetaFunction = () => ([
  ...getSeoMeta({})
]);

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "preload", href: stylesheet, as: "style" },
  { rel: "stylesheet", href: stylesheet }
];

export async function loader({ request }: LoaderFunctionArgs) {
  const prefersDarkColorScheme = getRequestCookie(CookieConstants.PREFERS_DARK_COLOR_SCHEME, request);

  return json({ prefersDarkColorScheme });
}


function Document({ children , locale, prefersDarkColorScheme }:
{ 
  children: ReactNode,
  locale?: string,
  prefersDarkColorScheme?: string,
}) {

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <FavIcon prefersDarkColorScheme={prefersDarkColorScheme} />
        <title>{PRODUCT_NAME}</title>
      </head>
      <body>
          {children}
      </body>
    </html>
  );
}

export default function App() {
  let { prefersDarkColorScheme } = useLoaderData<typeof loader>();
  const isBot = useIsBot();

  return (
    <Document prefersDarkColorScheme={prefersDarkColorScheme}>
      <RouterOutletWithContext />
      <ScrollRestoration />
      {isBot ? null : <Scripts />}
      <LiveReload />
    </Document>
  );
}

export function RouterOutletWithContext() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const loaderData = useRouteLoaderData<typeof loader>("root");

  const getErrorBody = () => {
    if (isRouteErrorResponse(error)) {
      if (error.status === 404) {
        return <>
          <Header />
          <NotFoundPage />
        </>;
      }
      return (
        <div>
          <h1>
            {error.status} {error.statusText}
          </h1>
          <p>{error.data}</p>
        </div>
      );
    } else if (error instanceof Error) {
      return (
        <div>
          <h1>Error</h1>
          <p>{error.message}</p>
          <p>The stack trace is:</p>
          <pre>{error.stack}</pre>
        </div>
      );
    } else {
      return <h1>Unknown Error</h1>;
    }
  }

  return (
    <Document>
      {getErrorBody()}
    </Document>
  )
}
