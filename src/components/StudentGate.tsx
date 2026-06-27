import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, ArrowLeft, Loader2, Send } from "lucide-react";
import { getStudent, loginStudent, logEvent, type Student, type ProgressKind } from "@/lib/students";

/**
 * Gates protected content (practice / office / calls) behind a name + Telegram
 * form. Only students added to the allowlist by the admin can pass.
 */
export function StudentGate({
  children,
  kind,
  itemId,
}: {
  children: ReactNode;
  kind?: ProgressKind;
  itemId?: string;
}) {
  const [student, setStudentState] = useState<Student | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = getStudent();
    setStudentState(s);
    setReady(true);
    if (s) void logEvent("enter", kind ?? null, itemId ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  if (!ready) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">…</div>;
  }

  if (!student) {
    return (
      <StudentLoginForm
        onSuccess={(s) => {
          setStudentState(s);
          void logEvent("enter", kind ?? null, itemId ?? null);
        }}
      />
    );
  }

  return <>{children}</>;
}

function StudentLoginForm({ onSuccess }: { onSuccess: (s: Student) => void }) {
  const [name, setName] = useState("");
  const [telegram, setTelegram] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !telegram.trim() || pending) return;
    setPending(true);
    setError(null);
    try {
      const s = await loginStudent(name.trim(), telegram.trim());
      if (!s) {
        setError("Тебя нет в списке группы. Обратись к преподавателю, чтобы он тебя добавил.");
        return;
      }
      onSuccess(s);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось войти. Попробуй ещё раз.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-subtle px-4 py-10">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-card space-y-5"
      >
        <div className="text-center space-y-2">
          <div className="size-12 mx-auto rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
            <GraduationCap className="size-6 text-white" />
          </div>
          <h1 className="text-xl font-bold">Вход в практику</h1>
          <p className="text-sm text-muted-foreground">
            Представься, чтобы мы сохраняли твой прогресс. Доступ только для учеников группы.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sg-name">Имя</Label>
          <Input
            id="sg-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Как тебя зовут"
            autoComplete="name"
            autoFocus
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sg-tg">Telegram-ник</Label>
          <Input
            id="sg-tg"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            placeholder="@username"
            autoComplete="off"
            disabled={pending}
          />
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              Войти <Send className="size-4" />
            </>
          )}
        </Button>

        <Link
          to="/course"
          className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> К курсу
        </Link>
      </form>
    </div>
  );
}
