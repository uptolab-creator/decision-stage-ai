import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { isEmailAllowed } from "@/lib/admin/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Loader2, KeyRound } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Вход — PM Симулятор" },
      {
        name: "description",
        content: "Войдите, чтобы проходить уроки симулятора проектного менеджмента.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkAccess = useServerFn(isEmailAllowed);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/course" });
    });
  }, [navigate]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const isAdminLogin = mode === "signin" && !email.includes("@");
      const loginEmail = isAdminLogin ? `${email.trim()}@admin.com` : email;

      if (loginEmail.includes("@") && loginEmail !== "admin@admin.com") {
        const { allowed } = await checkAccess({ data: { email: loginEmail } });
        if (!allowed) {
          throw new Error("У вас нет доступа к курсу. Обратитесь к администратору.");
        }
      }

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: loginEmail,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/course",
            data: { display_name: name },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
        if (error) throw error;
      }
      navigate({ to: "/course" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/course",
    });
    if (result.error) {
      setError("Не удалось войти через Google");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/course" });
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-subtle px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
            <GraduationCap className="size-5 text-white" />
          </div>
          <span className="text-lg font-bold">PM Симулятор</span>
        </Link>

        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <h1 className="text-xl font-bold text-center">
            {mode === "signin" ? "Вход" : "Регистрация"}
          </h1>
          <p className="text-sm text-muted-foreground text-center mt-1">
            {mode === "signin"
              ? "Войдите, чтобы продолжить обучение"
              : "Создайте аккаунт для старта"}
          </p>
          <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
            <KeyRound className="size-3" /> Доступ только для студентов, добавленных администратором
          </p>

          <form onSubmit={handleEmail} className="mt-5 space-y-3">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Алекс"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">{mode === "signin" ? "Email или логин" : "Email"}</Label>
              <Input
                id="email"
                type={mode === "signin" ? "text" : "email"}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={mode === "signin" ? "you@example.com или admin000" : "you@example.com"}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {mode === "signin" ? "Войти" : "Зарегистрироваться"}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            или
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={handleGoogle}>
            Продолжить с Google
          </Button>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            >
              {mode === "signin" ? "Регистрация" : "Войти"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
