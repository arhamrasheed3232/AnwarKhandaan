-- Phase 8: Supabase Tables Setup

-- 1. Events Table (For Timeline)
CREATE TABLE public.events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  year text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Gallery Table
CREATE TABLE public.gallery (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  src text NOT NULL,
  alt text NOT NULL,
  caption text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Members Table (For Family Tree)
CREATE TABLE public.members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  node_id text NOT NULL UNIQUE,
  label text NOT NULL,
  parent_id text REFERENCES public.members(node_id),
  style jsonb,
  position_x integer NOT NULL DEFAULT 0,
  position_y integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Example Insert Dummy Data for Events
INSERT INTO public.events (year, title, description) VALUES
('1892', 'The Founding Father', 'The visionary patriarch established the first trading empire that laid the foundation for generations to come.'),
('1924', 'The Golden Era', 'Expansion across borders brought unprecedented wealth, transforming the humble business into a trans-continental powerhouse.');
