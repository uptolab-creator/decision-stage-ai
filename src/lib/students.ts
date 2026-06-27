// Student identity + progress tracking (name + Telegram, no passwords).
// Backed by Postgres SECURITY DEFINER RPCs called through the anon Supabase
// client — see supabase/migrations/20260627_students.sql.
import { supabase } from "@/integrations/supabase/client";

export interface Student {
  id: string;
  name: string;
  telegram: string;
}

export type ProgressKind = "lesson" | "practice" | "simulation";
export type ProgressStatus = "in_progress" | "completed";

const STORAGE_KEY = "pp:student";
// Shared admin secret (matches the DB app_config 'admin_secret'). Read from env
// so it isn't hardcoded in the repo. Client-side, so this is access control for
// a small private course, not strong security.
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET ?? "";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rpc = (fn: string, args: Record<string, unknown>) => (supabase as any).rpc(fn, args);

/* ----------------------------- local identity ----------------------------- */
export function getStudent(): Student | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Student) : null;
  } catch {
    return null;
  }
}

export function setStudent(student: Student | null) {
  try {
    if (student) localStorage.setItem(STORAGE_KEY, JSON.stringify(student));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/* ------------------------------- auth flow -------------------------------- */
/** Returns the student if their Telegram is in the allowlist, else null. */
export async function loginStudent(name: string, telegram: string): Promise<Student | null> {
  const { data, error } = await rpc("student_login", { p_name: name, p_telegram: telegram });
  if (error) throw new Error(error.message);
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;
  const student: Student = { id: row.id, name: row.name, telegram: row.telegram };
  setStudent(student);
  return student;
}

export function logoutStudent() {
  setStudent(null);
}

/* ----------------------------- progress / events -------------------------- */
export async function saveProgress(
  kind: ProgressKind,
  itemId: string,
  step: number,
  status: ProgressStatus,
  score?: number | null,
) {
  const s = getStudent();
  if (!s) return;
  try {
    await rpc("student_save_progress", {
      p_student_id: s.id,
      p_kind: kind,
      p_item_id: itemId,
      p_step: Math.round(step) || 0,
      p_status: status,
      p_score: score ?? null,
    });
  } catch {
    /* tracking is best-effort */
  }
}

export async function logEvent(
  type: string,
  kind?: ProgressKind | null,
  itemId?: string | null,
  payload?: Record<string, unknown>,
) {
  const s = getStudent();
  if (!s) return;
  try {
    await rpc("student_log_event", {
      p_student_id: s.id,
      p_type: type,
      p_kind: kind ?? null,
      p_item_id: itemId ?? null,
      p_payload: payload ?? {},
    });
  } catch {
    /* best-effort */
  }
}

/* --------------------------------- admin ---------------------------------- */
export interface StudentRow {
  id: string;
  name: string;
  telegram: string;
  created_at: string;
  lessons_completed: number;
  practice_completed: number;
  total_items: number;
  avg_score: number | null;
  last_active: string | null;
}

export interface ProgressDetail {
  kind: ProgressKind;
  item_id: string;
  current_step: number;
  status: ProgressStatus;
  score: number | null;
  updated_at: string;
}

export async function adminListStudents(): Promise<StudentRow[]> {
  const { data, error } = await rpc("admin_list_students", { p_secret: ADMIN_SECRET });
  if (error) throw new Error(error.message);
  return (data ?? []) as StudentRow[];
}

export async function adminAddStudent(name: string, telegram: string): Promise<StudentRow> {
  const { data, error } = await rpc("admin_add_student", {
    p_secret: ADMIN_SECRET,
    p_name: name,
    p_telegram: telegram,
  });
  if (error) throw new Error(error.message);
  return data as StudentRow;
}

export async function adminRemoveStudent(id: string): Promise<void> {
  const { error } = await rpc("admin_remove_student", { p_secret: ADMIN_SECRET, p_id: id });
  if (error) throw new Error(error.message);
}

export async function adminStudentDetail(id: string): Promise<ProgressDetail[]> {
  const { data, error } = await rpc("admin_student_detail", { p_secret: ADMIN_SECRET, p_id: id });
  if (error) throw new Error(error.message);
  return (data ?? []) as ProgressDetail[];
}
