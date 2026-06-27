-- Student identity (name + Telegram) + progress tracking, independent of
-- Supabase Auth. Access is via SECURITY DEFINER RPCs called with the anon key;
-- the tables themselves have RLS on and no anon policies.

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  telegram text not null,
  telegram_norm text generated always as (lower(regexp_replace(trim(telegram), '^@', ''))) stored,
  created_at timestamptz not null default now()
);
create unique index if not exists students_telegram_norm_key on public.students(telegram_norm);

create table if not exists public.student_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  kind text not null,                              -- 'lesson' | 'practice' | 'simulation'
  item_id text not null,                           -- lesson slug / mission id / scenario id
  current_step integer not null default 0,
  status text not null default 'in_progress',      -- 'in_progress' | 'completed'
  score integer,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(student_id, kind, item_id)
);

create table if not exists public.student_events (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete cascade,
  type text not null,                              -- 'login' | 'enter' | 'task' | 'complete' | ...
  kind text,
  item_id text,
  payload jsonb,
  created_at timestamptz not null default now()
);

alter table public.students enable row level security;
alter table public.student_progress enable row level security;
alter table public.student_events enable row level security;

create or replace function public.norm_tg(p text)
returns text language sql immutable as $$ select lower(regexp_replace(trim(coalesce(p,'')), '^@', '')) $$;

create or replace function public.admin_check(p_secret text)
returns void language plpgsql as $$
begin
  if p_secret is distinct from 'admin01' then raise exception 'forbidden'; end if;
end; $$;

create or replace function public.student_login(p_name text, p_telegram text)
returns table(id uuid, name text, telegram text)
language plpgsql security definer set search_path = public as $$
declare v public.students%rowtype;
begin
  select * into v from public.students where telegram_norm = public.norm_tg(p_telegram);
  if not found then return; end if;
  insert into public.student_events(student_id, type, payload)
    values (v.id, 'login', jsonb_build_object('name_entered', p_name));
  return query select v.id, v.name, v.telegram;
end; $$;

create or replace function public.student_save_progress(
  p_student_id uuid, p_kind text, p_item_id text,
  p_step integer, p_status text, p_score integer)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.students where id = p_student_id) then
    raise exception 'unknown student';
  end if;
  insert into public.student_progress(student_id, kind, item_id, current_step, status, score, updated_at)
  values (p_student_id, p_kind, p_item_id, coalesce(p_step,0), coalesce(p_status,'in_progress'), p_score, now())
  on conflict (student_id, kind, item_id) do update
    set current_step = greatest(public.student_progress.current_step, excluded.current_step),
        status = case when public.student_progress.status='completed' then 'completed' else excluded.status end,
        score = case when excluded.score is null then public.student_progress.score
                     else greatest(coalesce(public.student_progress.score,0), excluded.score) end,
        updated_at = now();
end; $$;

create or replace function public.student_log_event(
  p_student_id uuid, p_type text, p_kind text, p_item_id text, p_payload jsonb)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.student_events(student_id, type, kind, item_id, payload)
  values (p_student_id, p_type, p_kind, p_item_id, p_payload);
end; $$;

create or replace function public.admin_add_student(p_secret text, p_name text, p_telegram text)
returns public.students language plpgsql security definer set search_path=public as $$
declare v public.students;
begin
  perform public.admin_check(p_secret);
  insert into public.students(name, telegram) values (trim(p_name), trim(p_telegram))
  on conflict (telegram_norm) do update set name = excluded.name
  returning * into v;
  return v;
end; $$;

create or replace function public.admin_remove_student(p_secret text, p_id uuid)
returns void language plpgsql security definer set search_path=public as $$
begin perform public.admin_check(p_secret); delete from public.students where id = p_id; end; $$;

create or replace function public.admin_list_students(p_secret text)
returns table(id uuid, name text, telegram text, created_at timestamptz,
  lessons_completed bigint, practice_completed bigint, total_items bigint,
  avg_score numeric, last_active timestamptz)
language plpgsql security definer set search_path=public as $$
begin
  perform public.admin_check(p_secret);
  return query
  select s.id, s.name, s.telegram, s.created_at,
    count(*) filter (where p.kind='lesson' and p.status='completed'),
    count(*) filter (where p.kind in ('practice','simulation') and p.status='completed'),
    count(p.id),
    round(avg(p.score) filter (where p.score is not null), 0),
    greatest(max(p.updated_at), (select max(e.created_at) from public.student_events e where e.student_id = s.id))
  from public.students s
  left join public.student_progress p on p.student_id = s.id
  group by s.id, s.name, s.telegram, s.created_at
  order by s.created_at desc;
end; $$;

create or replace function public.admin_student_detail(p_secret text, p_id uuid)
returns table(kind text, item_id text, current_step int, status text, score int, updated_at timestamptz)
language plpgsql security definer set search_path=public as $$
begin
  perform public.admin_check(p_secret);
  return query select p.kind, p.item_id, p.current_step, p.status, p.score, p.updated_at
  from public.student_progress p where p.student_id = p_id order by p.updated_at desc;
end; $$;

grant execute on function public.student_login(text,text) to anon, authenticated;
grant execute on function public.student_save_progress(uuid,text,text,integer,text,integer) to anon, authenticated;
grant execute on function public.student_log_event(uuid,text,text,text,jsonb) to anon, authenticated;
grant execute on function public.admin_add_student(text,text,text) to anon, authenticated;
grant execute on function public.admin_remove_student(text,uuid) to anon, authenticated;
grant execute on function public.admin_list_students(text) to anon, authenticated;
grant execute on function public.admin_student_detail(text,uuid) to anon, authenticated;
