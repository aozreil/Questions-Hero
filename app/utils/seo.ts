const DEFAULT_META_TITLE = 'Ask Gram';
const DEFAULT_META_DESCRIPTION = 'Ask inquire about any subject within your academic realm';

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
  ];
}
