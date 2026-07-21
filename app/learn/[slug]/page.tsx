import { notFound } from "next/navigation";

import { LessonActions } from "@/components/lesson-actions";
import { allLessons, course } from "@/lib/data";

export default function LessonPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const lesson = allLessons.find((item) => item.slug === slug);

  if (!lesson) {
    notFound();
  }

  const chapter = course.chapters.find((item) => item.id === lesson.chapterId);

  return (
    <main className="shell stack">
      <section className="grid-2">
        <div className="video-shell">
          <span className="eyebrow">{lesson.topic}</span>
          <h1>{lesson.title}</h1>
          <p>{lesson.videoPrompt}</p>
          <p className="small">Playback model: short-lived demo token, visible watermark, entitlement-gated premium lessons.</p>
          <div className="watermark">For learner demo use only</div>
        </div>
        <div className="panel">
          <h3>Lesson notes</h3>
          <p className="muted">
            {chapter?.title} • {lesson.duration} • {lesson.isFree ? "Free sample" : "Premium lesson"}
          </p>
          <div className="card-list">
            {lesson.notes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
        </div>
      </section>

      <LessonActions lesson={lesson} />
    </main>
  );
}
