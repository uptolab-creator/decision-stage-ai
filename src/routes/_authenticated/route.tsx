import { createFileRoute, Outlet } from "@tanstack/react-router";

// Авторизация отключена: все страницы доступны без регистрации/входа.
// SSR оставлен включённым: ssr:false ломает прямую загрузку этих маршрутов
// на Vercel (Nitro vercel preset) — отдаётся лендинг вместо страницы.
// Компоненты обращаются к window/localStorage только в эффектах, поэтому
// серверный рендер безопасен.
export const Route = createFileRoute("/_authenticated")({
  component: () => <Outlet />,
});
