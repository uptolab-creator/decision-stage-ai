import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminListStudents,
  adminAddStudent,
  adminRemoveStudent,
  type StudentRow,
} from "@/lib/students";
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
import { Search, Plus, Trash2, UserPlus, ShieldCheck, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

export function AdminAccess() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-students"],
    queryFn: adminListStudents,
  });

  const [name, setName] = useState("");
  const [telegram, setTelegram] = useState("");

  const addMutation = useMutation({
    mutationFn: () => adminAddStudent(name, telegram),
    onSuccess: () => {
      toast.success("Студент добавлен");
      setName("");
      setTelegram("");
      queryClient.invalidateQueries({ queryKey: ["admin-students"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Ошибка"),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => adminRemoveStudent(id),
    onSuccess: () => {
      toast.success("Студент удалён");
      queryClient.invalidateQueries({ queryKey: ["admin-students"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Ошибка"),
  });

  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    if (!data) return [] as StudentRow[];
    if (!q) return data;
    const lq = q.toLowerCase();
    return data.filter(
      (s) => s.name.toLowerCase().includes(lq) || s.telegram.toLowerCase().includes(lq),
    );
  }, [data, q]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !telegram.trim()) return;
    addMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
          <Plus className="size-4" /> Добавить ученика в группу
        </h3>
        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3">
          <div className="space-y-1 flex-1 min-w-[160px]">
            <Label htmlFor="access-name">Имя</Label>
            <Input
              id="access-name"
              required
              placeholder="Иван Иванов"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1 flex-1 min-w-[160px]">
            <Label htmlFor="access-tg">Telegram-ник</Label>
            <Input
              id="access-tg"
              required
              placeholder="@username"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={addMutation.isPending}>
            {addMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <UserPlus className="size-4" />
            )}
            Добавить
          </Button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">
          Войти в практику смогут только добавленные сюда ученики — по имени и Telegram-нику.
        </p>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b flex items-center gap-3">
          <ShieldCheck className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            Ученики группы{data ? ` (${data.length})` : ""}
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
            {q ? "Ничего не найдено." : "Пока никого нет. Добавь первого ученика выше."}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Telegram</TableHead>
                <TableHead>Добавлен</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground inline-flex items-center gap-1.5">
                    <Send className="size-3.5 text-primary" /> {s.telegram}
                  </TableCell>
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
