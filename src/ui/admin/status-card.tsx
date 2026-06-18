export function StatusCard({
  title,
  children
}: Readonly<{
  title: string;
  children: string;
}>) {
  return (
    <section className="status-card" aria-label={title}>
      <h2>{title}</h2>
      <p>{children}</p>
    </section>
  );
}
