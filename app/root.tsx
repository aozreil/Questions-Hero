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
import {MetaFunction} from "@remix-run/node";
import {getSeoMeta} from "~/utils/seo";
import NotFoundPage from "~/components/UI/NotFoundPage";
import { ReactNode } from "react";

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
    <title>Ask Gram</title>
  </head>
  <body>
    {children}
  </body>
  </html>;
}

export default function App() {
  return (
    <Document>
      <Outlet />
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if(error.status === 404){
      return  <Document>
        <NotFoundPage/>
      </Document>;
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
