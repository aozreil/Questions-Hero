import sanitizeHtml from "sanitize-html";
import clsx from "clsx";

interface Props {
  html: string;
  className?: string;
}

export default function SanitizedText({ html, className }: Props) {
  if (!html) return null;
  const sanitizedText = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags,
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height'],
      '*': ['class', 'style'],
    },
  });
  return (
    <div
      className={clsx("relative", className)}
      dangerouslySetInnerHTML={{ __html: sanitizedText }}
    />
  );
}
