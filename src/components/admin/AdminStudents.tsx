import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  adminListStudents,
  adminStudentDetail,
  type StudentRow,
  type ProgressDetail,
} from "@/lib/students";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Users, ChevronDown, ChevronRight, Send, CheckCircle2 } from "lucide-react";

const KIND_LABEL: Record<string, string> = {
  lesson: "Урок",
  practice: "Практика",
  simulation: "Симуляция",
};

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminStudents() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-students"],
    queryFn: adminListStudents,
  });
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = useMemo(() => {
    let r = data ?? [];
    if (q) {
      const lq = q.toLowerCase();
      r = r.filter((s) => s.name.toLowerCase().includes(lq) || s.telegram.toLowerCase().includes(lq));
    }
    return r;
  }, [data, q]);

  if (isLoading) {
    return <div className="text-muted-foreground py-12 text-center">Загрузка учеников…</div>;
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-10 text-center text-sm text-muted-foreground">
        Пока нет учеников. Добавь их во вкладке «Доступ».
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-4 border-b flex items-center gap-3">
        <Users className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">Ученики и прогресс ({data.length})</span>
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8" />
            <TableHead>Ученик</TableHead>
            <TableHead className="text-center">Уроки</TableHead>
            <TableHead className="text-center">Практика</TableHead>
            <TableHead className="text-center">Ср. балл</TableHead>
            <TableHead>Активность</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((s) => (
            <StudentRowView
              key={s.id}
              student={s}
              open={openId === s.id}
              onToggle={() => setOpenId(openId === s.id ? null : s.id)}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function StudentRowView({
  student,
  open,
  onToggle,
}: {
  student: StudentRow;
  open: boolean;
  onToggle: () => void;
}) {
  const { data: detail, isLoading } = useQuery({
    queryKey: ["admin-student-detail", student.id],
    queryFn: () => adminStudentDetail(student.id),
    enabled: open,
  });

  return (
    <>
      <TableRow className="cursor-pointer" onClick={onToggle}>
        <TableCell>
          {open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
        </TableCell>
        <TableCell>
          <div className="font-medium">{student.name}</div>
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <Send className="size-3 text-primary" /> {student.telegram}
          </div>
        </TableCell>
        <TableCell className="text-center font-semibold">{student.lessons_completed}</TableCell>
        <TableCell className="text-center font-semibold">{student.practice_completed}</TableCell>
        <TableCell className="text-center">
          {student.avg_score != null ? (
            <Badge variant="secondary">{student.avg_score}</Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </TableCell>
        <TableCell className="text-xs text-muted-foreground">{fmtDate(student.last_active)}</TableCell>
      </TableRow>
      {open && (
        <TableRow>
          <TableCell colSpan={6} className="bg-secondary/30">
            {isLoading ? (
              <div className="py-3 text-sm text-muted-foreground">Загрузка прогресса…</div>
            ) : !detail || detail.length === 0 ? (
              <div className="py-3 text-sm text-muted-foreground">
                Ученик ещё не начинал задания.
              </div>
            ) : (
              <div className="py-2 space-y-1.5">
                {detail.map((p: ProgressDetail, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm rounded-md bg-card px-3 py-1.5 border"
                  >
                    <Badge variant="outline" className="shrink-0">
                      {KIND_LABEL[p.kind] ?? p.kind}
                    </Badge>
                    <span className="font-medium">{p.item_id}</span>
                    {p.status === "completed" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-xs">
                        <CheckCircle2 className="size-3.5" /> завершено
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">шаг {p.current_step}</span>
                    )}
                    {p.score != null && (
                      <span className="ml-auto text-xs font-semibold">{p.score} баллов</span>
                    )}
                    <span className="text-[11px] text-muted-foreground shrink-0">
                      {fmtDate(p.updated_at)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
