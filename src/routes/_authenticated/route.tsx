import { createFileRoute, Outlet } from "@tanstack/react-router";

// Авторизация отключена: все страницы доступны без регистрации/входа.
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: () => <Outlet />,
});
