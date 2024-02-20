import type {WebSite, WithContext} from 'schema-dts';

export function getWebSiteSchema():WithContext<WebSite>  {
  return {
    "@context" : "https://schema.org",
    "@type" : "WebSite",
    "name" : 'AskGram',
    "url" : "https://askgram.work"
  }
}