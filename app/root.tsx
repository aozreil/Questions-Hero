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
import { GOOGLE_ANALYTICS_KEY, SMARTLOOK_KEY } from "~/config/enviromenet";
import AuthProvider, { useAuth } from "~/context/AuthProvider";
import { useIsBot } from "~/context/IsBotContext";
import OverlayProvider from "~/context/OverlayProvider";
import ModalsProvider from "~/context/ModalsProvider";
import { LoaderFunctionArgs } from "@remix-run/router";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next/react";
import i18next from "~/i18next.server";
import Smartlook from 'smartlook-client'


export const meta: MetaFunction = () => ([
  ...getSeoMeta({})
]);

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "preload", href: stylesheet, as: "style" },
  { rel: "stylesheet", href: stylesheet }
];

export async function loader({ request }: LoaderFunctionArgs) {
  let locale = await i18next.getLocale(request);
  return json({ locale });
}

export let handle = { i18n: "common" };function Document({ children , locale}: { children: ReactNode , locale?: string }) {
  let { i18n } = useTranslation();

  useEffect(()=>{
    if(!Smartlook.initialized()){
      Smartlook.init(SMARTLOOK_KEY)
    }
  }, [])

  return (
    <html lang={locale ?? "en"} dir={i18n.dir()}>
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
  </html>);
}

export default function App() {
  let { locale } = useLoaderData<typeof loader>();
  const isBot = useIsBot();
  useChangeLanguage(locale)

  return (
    <Document locale={locale}>
      <RouterOutletWithContext />
      <ScrollRestoration />
      {isBot ? null : <Scripts />}
      <LiveReload />
    </Document>
  );
}

export function RouterOutletWithContext() {
  const { user } = useAuth();
  return <Outlet context={user} />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const loaderData = useRouteLoaderData<typeof loader>("root");
  const locale = loaderData?.locale;

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
    <Document locale={locale}>
      {getErrorBody()}
    </Document>
  )
}
