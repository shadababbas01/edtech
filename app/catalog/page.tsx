import Link from "next/link";

import { course } from "@/lib/data";

export default function CatalogPage() {
  return (
    <main className="shell stack">
      <section className="hero">
        <span className="eyebrow">Catalogue and curriculum map</span>
        <h1 className="title">{course.title}</h1>
        <p className="lede">{course.promise}</p>
      </section>

      <section className="grid-2">
        {course.chapters.map((chapter) => (
          <div key={chapter.id} className="panel">
            <h2>{chapter.title}</h2>
            <p className="muted">{chapter.summary}</p>
            <p className="small">{chapter.target}</p>
            <div className="card-list">
              {chapter.lessons.map((lesson) => (
                <Link key={lesson.id} href={`/learn/${lesson.slug}`} className="lesson-card">
                  <div className="inline">
                    <strong>{lesson.title}</strong>
                    <span className={lesson.isFree ? "status" : "status locked"}>{lesson.isFree ? "Free" : "Paid"}</span>
                  </div>
                  <p className="small muted">{lesson.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
