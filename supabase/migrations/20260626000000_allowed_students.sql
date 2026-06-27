CREATE TABLE public.allowed_students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.allowed_students TO authenticated;
GRANT ALL ON public.allowed_students TO service_role;

ALTER TABLE public.allowed_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read allowed_students"
ON public.allowed_students FOR SELECT
TO authenticated
USING (true);
