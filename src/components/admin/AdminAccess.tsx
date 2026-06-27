import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  getAllowedStudents,
  addAllowedStudent,
  removeAllowedStudent,
  type AllowedStudent,
} from "@/lib/admin/admin.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Trash2, Mail, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AdminAccess() {
  const queryClient = useQueryClient();
  const fetchStudents = useServerFn(getAllowedStudents);
  const addStudent = useServerFn(addAllowedStudent);
  const removeStudent = useServerFn(removeAllowedStudent);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-allowed-students"],
    queryFn: () => fetchStudents() as Promise<AllowedStudent[]>,
  });

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");

  const addMutation = useMutation({
    mutationFn: () => addStudent({ data: { email, displayName } }),
    onSuccess: () => {
      toast.success("Студент добавлен");
      setEmail("");
      setDisplayName("");
      queryClient.invalidateQueries({ queryKey: ["admin-allowed-students"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Ошибка"),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => removeStudent({ data: { id } }),
    onSuccess: () => {
      toast.success("Доступ отозван");
      queryClient.invalidateQueries({ queryKey: ["admin-allowed-students"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Ошибка"),
  });

  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    if (!data) return [];
    if (!q) return data;
    return data.filter(
      (s) =>
        s.email.toLowerCase().includes(q.toLowerCase()) ||
        (s.display_name ?? "").toLowerCase().includes(q.toLowerCase()),
    );
  }, [data, q]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    addMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
          <Plus className="size-4" /> Добавить студента
        </h3>
        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3">
          <div className="space-y-1 flex-1 min-w-[200px]">
            <Label htmlFor="access-email">Email студента</Label>
            <Input
              id="access-email"
              type="email"
              required
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1 flex-1 min-w-[160px]">
            <Label htmlFor="access-name">Имя (необязательно)</Label>
            <Input
              id="access-name"
              placeholder="Иван Иванов"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={addMutation.isPending}>
            {addMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Mail className="size-4" />
            )}
            Предоставить доступ
          </Button>
        </form>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b flex items-center gap-3">
          <ShieldCheck className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            Студенты с доступом{data ? ` (${data.length})` : ""}
          </span>
          <div className="relative ml-auto">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Поиск…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-8 w-[200px] pl-8"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-muted-foreground text-sm">Загрузка…</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">
            {q ? "Ничего не найдено." : "Пока нет студентов с доступом."}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Имя</TableHead>
                <TableHead>Добавлен</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.email}</TableCell>
                  <TableCell className="text-muted-foreground">{s.display_name || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString("ru-RU")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMutation.mutate(s.id)}
                      disabled={removeMutation.isPending}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
