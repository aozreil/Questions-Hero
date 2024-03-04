interface Props {
  tailwindStyles: React.ComponentProps<'div'>['className'];
}

export default function ContentLoader({ tailwindStyles }: Props) {
  return (
    <div className={`content-loader-component ${tailwindStyles || ''}`}>
      <div className="animated-background" />
    </div>
  )
}