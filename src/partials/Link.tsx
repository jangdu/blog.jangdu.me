type LinkProps = {
  href: string;
  children: React.ReactNode;
  target?: '_blank' | '_self';
  className?: string;
};

export const Link = ({
  href,
  children,
  target = '_self',
  className,
}: LinkProps) => {
  const linkClassName =
    className ?? 'text-foreground text-sm hover:underline rounded-md';

  return (
    <a href={href} target={target} className={linkClassName}>
      {children}
    </a>
  );
};
