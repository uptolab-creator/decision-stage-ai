import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { LESSONS, lessonStepCount, lessonSlug, SKILL_TAGS, lessonSkills } from "@/lib/course";
import { MISSIONS } from "@/lib/missions";
import { getMyProgress } from "@/lib/course/progress.functions";
import { Button } from "@/components/ui/button";
import { GraduationCap, CheckCircle2, PlayCircle, Building2, ArrowRight, ShieldCheck, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/course")({
  head: () => ({
    meta: [
      { title: "Курс — PM Симулятор" },
      { name: "description", content: "21+ урок практики проектного менеджмента: теория, задания и звонки с AI." },
    ],
  }),
  component: CoursePage,
});

type ProgressRow = { lesson_id: string; current_step: number; status: string; completed_at: string | null };

function CoursePage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [skillFilter, setSkillFilter] = useState<string | null>(null);
  const fetchProgress = useServerFn(getMyProgress);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user));
  }, []);

  const { data: progress } = useQuery({
    queryKey: ["my-progress"],
    queryFn: () => fetchProgress() as Promise<ProgressRow[]>,
    enabled: authed === true,
  });

  const progressMap = new Map((progress ?? []).map((p) => [p.lesson_id, p]));
  const completedCount = (progress ?? []).filter((p) => p.status === "completed").length;

  const visibleLessons = skillFilter
    ? LESSONS.filter((l) => lessonSkills(l.id).includes(skillFilter))
    : LESSONS;
  const firstMissionId = MISSIONS[0]?.id;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b bg-card/70 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
              <GraduationCap className="size-4 text-white" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-sm">PM Симулятор</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Курс практики</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="ghost">
              <Link to="/admin">
                <ShieldCheck className="size-4" /> Админ
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Введение в проектный менеджмент в IT</h1>
          <p className="text-muted-foreground mt-1">
            {LESSONS.length} тестов по темам PM плюс практика в офисе — отдельный трек с реальными рабочими ситуациями.
          </p>
          {authed && (
            <div className="mt-4 flex items-center gap-3">
              <div className="h-2 flex-1 max-w-xs rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-gradient-primary transition-all"
                  style={{ width: `${(completedCount / LESSONS.length) * 100}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {completedCount} / {LESSONS.length} пройдено
              </span>
            </div>
          )}
        </div>

        {/* ---------------- Практика в офисе (вход напрямую в офис) ---------------- */}
        {firstMissionId && (
          <Link
            to="/practice/$id"
            params={{ id: firstMissionId }}
            className="group mb-10 block rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 to-card p-5 transition-shadow hover:shadow-card"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 shrink-0 rounded-xl bg-gradient-primary grid place-items-center text-white shadow-glow">
                <Building2 className="size-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase tracking-[0.16em] text-primary font-semibold">
                  Практика в офисе · симулятор
                </div>
                <div className="font-bold leading-snug">Войти в офис проектного менеджера</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  Реальные рабочие ситуации PM: звонки, переписка, встречи и решения за рабочим ноутбуком.
                </div>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                Открыть <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        )}

        {/* ---------------- Тесты ---------------- */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <ListChecks className="size-4" />
            </span>
            <h2 className="text-lg font-bold">Тесты</h2>
            <span className="text-xs text-muted-foreground">· {visibleLessons.length} из {LESSONS.length}</span>
          </div>

          {/* Фильтр по навыкам */}
          <div className="mb-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSkillFilter(null)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                skillFilter === null ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-secondary",
              )}
            >
              Все навыки
            </button>
            {SKILL_TAGS.map((s) => {
              const active = skillFilter === s.id;
              const count = LESSONS.filter((l) => lessonSkills(l.id).includes(s.id)).length;
              if (count === 0) return null;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSkillFilter(active ? null : s.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors inline-flex items-center gap-1.5",
                    active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-secondary",
                  )}
                >
                  <span>{s.emoji}</span> {s.label}
                  <span className={cn("text-[10px]", active ? "text-primary-foreground/70" : "text-muted-foreground")}>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {visibleLessons.map((lesson) => {
              const p = progressMap.get(lesson.id);
              const done = p?.status === "completed";
              const started = !!p && !done;
              const totalSteps = lessonStepCount(lesson);
              const skills = lessonSkills(lesson.id);

              return (
                <div
                  key={lesson.id}
                  className="rounded-xl border bg-card p-4 flex items-start gap-3 transition-shadow hover:shadow-card"
                >
                  <div
                    className={cn(
                      "size-9 shrink-0 rounded-lg grid place-items-center text-sm font-bold",
                      done ? "bg-emerald-500 text-white" : started ? "bg-primary text-white" : "bg-secondary text-foreground",
                    )}
                  >
                    {done ? <CheckCircle2 className="size-5" /> : lesson.number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm leading-snug">{lesson.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{lesson.theory}</div>
                    {skills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {skills.map((sid) => {
                          const tag = SKILL_TAGS.find((t) => t.id === sid);
                          if (!tag) return null;
                          return (
                            <span key={sid} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                              {tag.emoji} {tag.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        {started ? `Шаг ${(p?.current_step ?? 0) + 1}/${totalSteps}` : `${totalSteps} шагов`}
                      </span>
                      <Link
                        to="/lessons/$slug"
                        params={{ slug: lessonSlug(lesson) }}
                        className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline"
                      >
                        <PlayCircle className="size-4" />
                        {done ? "Повторить" : started ? "Продолжить" : "Начать"}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {visibleLessons.length === 0 && (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              Нет тестов по этому навыку.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
