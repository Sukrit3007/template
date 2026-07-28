/**
 * `[ Label ]` link in mono caps.
 *
 * The brackets are separate spans so they can be animated independently of the
 * label — no hover transform is wired up by default.
 */
export function BracketLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={typeof children === "string" ? children : undefined}
      className="group relative flex cursor-pointer flex-row items-center gap-10 overflow-clip py-4 font-mono text-12 uppercase outline-ink outline-offset-4 focus-visible:outline-2"
    >
      <span>[</span>
      <span className="mt-2 shrink-0">{children}</span>
      <span>]</span>
    </a>
  );
}
