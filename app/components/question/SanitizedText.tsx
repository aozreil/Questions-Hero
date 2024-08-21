import sanitizeHtml from "sanitize-html";
import clsx from "clsx";

interface Props {
  html: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
}

export default function SanitizedText({ html, className, tag }: Props) {
  if (!html) return null;
  const sanitizedText = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height'],
      '*': ['class', 'style'],
    },
  });
  
  let WrapperTag: keyof JSX.IntrinsicElements = 'div';
  if (tag) {
    WrapperTag = tag;
  }
  
  return (
    <WrapperTag
      className={clsx("relative", className)}
      dangerouslySetInnerHTML={{ __html: sanitizedText }}
    />
  );
}
