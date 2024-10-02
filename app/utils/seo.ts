import { getWebSiteSchema } from "~/utils/seo-schema";
import { PRODUCT_NAME } from "~/config/enviromenet";

export const DEFAULT_META_TITLE = `${PRODUCT_NAME} - Your Homework Help Community`;
export const DEFAULT_META_DESCRIPTION = `${PRODUCT_NAME} provides a platform for students, educators, and enthusiasts to collaborate, ask questions, and find answers in a supportive environment.`;

export function getSeoMeta({ title, description, canonical } : { title?: string, description?: string, canonical?: string }) {
  const metaTitle = `${title || DEFAULT_META_TITLE}`;
  const metaDescription = description || DEFAULT_META_DESCRIPTION;

  return [
    { charset: "utf-8" },
    { name: 'viewport', content: "width=device-width,initial-scale=1" },
    { name:"msapplication-TileColor", content: "#ffffff" },
    { name: "msapplication-TileImage", content: "/assets/ms-icon-144x144.png" },
    { name: "theme-color", content: "#ffffff" },
    { title: metaTitle },
    { name: 'description', content: metaDescription },
    { name: "robots", content: "index,follow" },
    { name: "googlebot", content: "index,follow" },
    ... canonical ? [{ tagName: "link", rel: "canonical", href: canonical }] : [],

    // site names data structure
    { "script:ld+json": getWebSiteSchema(), },
  ];
}
