import Link from "next/link";

export default function Home() {
  return (
    <main className="home-page" aria-labelledby="home-title">
      <section className="home-page__panel">
        <p className="home-page__eyebrow">Burgess Attorneys</p>
        <h1 id="home-title">Admin Platform Foundation</h1>
        <p>
          Protected internal admin shell for future legal-admin workflows. Current screens use
          safe placeholder data only; production auth, saves and sending remain disabled.
        </p>
        <Link className="home-page__link" href="/admin">
          Open admin shell
        </Link>
      </section>
    </main>
  );
}
