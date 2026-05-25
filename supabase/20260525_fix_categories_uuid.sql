ALTER TABLE public.categories
ALTER COLUMN id SET DEFAULT gen_random_uuid();