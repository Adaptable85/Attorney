import type { PublicServiceGroup } from "./public-content";

export function ServiceCard({ group }: Readonly<{ group: PublicServiceGroup }>) {
  return (
    <article className="service-card">
      <h2>{group.title}</h2>
      <p>{group.summary}</p>
      <ul>
        {group.services.map((service) => (
          <li key={service}>{service}</li>
        ))}
      </ul>
    </article>
  );
}
