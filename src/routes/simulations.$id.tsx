import { createFileRoute, Outlet } from "@tanstack/react-router";
import { StudentGate } from "@/components/StudentGate";

function GatedSimulation() {
  const { id } = Route.useParams();
  return (
    <StudentGate kind="simulation" itemId={id}>
      <Outlet />
    </StudentGate>
  );
}

export const Route = createFileRoute("/simulations/$id")({
  component: GatedSimulation,
});
