import type {WebSite, WithContext} from 'schema-dts';
import { PRODUCT_NAME, SITE_BASE } from "~/config/enviromenet";

export function getWebSiteSchema():WithContext<WebSite>  {
  return {
    "@context" : "https://schema.org",
    "@type" : "WebSite",
    "name" : PRODUCT_NAME,
    "url" : SITE_BASE,
  }
}