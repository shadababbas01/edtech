import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell">
      <section className="hero">
        <span className="eyebrow">Page not found</span>
        <h1 className="title">That lesson or workspace does not exist yet.</h1>
        <p className="lede">Use the catalogue to jump back into the seeded learning path.</p>
        <div className="actions">
          <Link href="/catalog" className="button">
            Open catalogue
          </Link>
        </div>
      </section>
    </main>
  );
}
