export function SectionHeading({ eyebrow, title, children, align = 'left' }) {
  return (
    <div className={`section-heading section-heading-${align}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
    </div>
  );
}
