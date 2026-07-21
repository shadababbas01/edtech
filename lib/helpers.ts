import type { Course } from "@/lib/data";
import type { ProgressMap } from "@/lib/types";

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function getChapterProgress(course: Course, progress: ProgressMap, chapterId: string) {
  const chapter = course.chapters.find((item) => item.id === chapterId);

  if (!chapter) {
    return 0;
  }

  const values = chapter.lessons.map((lesson) => progress[lesson.id] ?? 0);
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

export function getNextLesson(course: Course, progress: ProgressMap) {
  const allLessons = course.chapters.flatMap((chapter) => chapter.lessons);
  return allLessons.find((lesson) => (progress[lesson.id] ?? 0) < 100) ?? allLessons[0];
}

export function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getDashboardMetrics(course: Course, progress: ProgressMap) {
  const allLessons = course.chapters.flatMap((chapter) => chapter.lessons);
  const completed = allLessons.filter((lesson) => (progress[lesson.id] ?? 0) >= 100).length;
  const total = allLessons.length;
  const totalProgress =
    total === 0 ? 0 : allLessons.reduce((sum, lesson) => sum + (progress[lesson.id] ?? 0), 0) / total;

  return {
    completed,
    total,
    totalProgress
  };
}
