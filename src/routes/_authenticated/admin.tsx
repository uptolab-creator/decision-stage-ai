import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminLessons } from "@/components/admin/AdminLessons";
import { AdminCallLogs } from "@/components/admin/AdminCallLogs";
import { AdminStudents } from "@/components/admin/AdminStudents";
import { AdminAccess } from "@/components/admin/AdminAccess";
import {
  LayoutDashboard,
  BookOpen,
  PhoneCall,
  ShieldCheck,
  ArrowLeft,
  Users,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Админ-панель — PM Симулятор" }] }),
  component: AdminPage,
});

// Simple local admin gate. App auth is disabled, so the panel is protected by a
// fixed login instead of a Supabase session. Credentials come from env vars
// (set in .env / deployment) so they aren't hardcoded in the repo.
const ADMIN_LOGIN = import.meta.env.VITE_ADMIN_LOGIN ?? "admin";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? "";
const ADMIN_FLAG = "pp:admin-auth";

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ADMIN_PASSWORD) {
      toast.error("Пароль администратора не настроен (VITE_ADMIN_PASSWORD).");
      return;
    }
    if (login.trim() === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(ADMIN_FLAG, "1");
      } catch {}
      onSuccess();
    } else {
      toast.error("Неверный логин или пароль");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={submit} className="max-w-sm w-full rounded-xl border bg-card p-6 space-y-4">
        <div className="text-center space-y-2">
          <ShieldCheck className="size-10 mx-auto text-primary" />
          <h1 className="text-xl font-bold">Вход в админ-панель</h1>
          <p className="text-sm text-muted-foreground">Введите логин и пароль администратора.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-login">Логин</Label>
          <Input
            id="admin-login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            autoComplete="username"
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-password">Пароль</Label>
          <Input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" className="w-full">
          Войти
        </Button>
        <Link to="/course" className="block text-center text-sm text-primary hover:underline">
          ← Вернуться к курсу
        </Link>
      </form>
    </div>
  );
}

function AdminPage() {
  const [authed, setAuthed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(ADMIN_FLAG) === "1";
    } catch {
      return false;
    }
  });

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/70 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-primary grid place-items-center">
              <LayoutDashboard className="size-4 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-sm">Админ-панель</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Контроль симулятора PM
              </div>
            </div>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/course">
              <ArrowLeft className="size-4" /> К курсу
            </Link>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">
              <LayoutDashboard className="size-4" /> Общая аналитика
            </TabsTrigger>
            <TabsTrigger value="lessons">
              <BookOpen className="size-4" /> Аналитика по урокам
            </TabsTrigger>
            <TabsTrigger value="students">
              <Users className="size-4" /> Студенты
            </TabsTrigger>
            <TabsTrigger value="calls">
              <PhoneCall className="size-4" /> AI-проверки и звонки
            </TabsTrigger>
            <TabsTrigger value="access">
              <KeyRound className="size-4" /> Доступ
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <AdminOverview />
          </TabsContent>
          <TabsContent value="lessons">
            <AdminLessons />
          </TabsContent>
          <TabsContent value="students">
            <AdminStudents />
          </TabsContent>
          <TabsContent value="calls">
            <AdminCallLogs />
          </TabsContent>
          <TabsContent value="access">
            <AdminAccess />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
