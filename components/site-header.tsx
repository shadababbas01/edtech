import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand">
          Project Ganit
        </Link>
        <nav className="nav">
          <Link href="/catalog">Catalogue</Link>
          <Link href="/learn/real-numbers-foundations">Continue</Link>
          <Link href="/practice">Practice</Link>
          <Link href="/live">Live</Link>
          <Link href="/doubts">Doubts</Link>
          <Link href="/parent">Parent Dashboard</Link>
          <Link href="/admin">Admin</Link>
          <Link href="/support">Support</Link>
        </nav>
      </div>
    </header>
  );
}
