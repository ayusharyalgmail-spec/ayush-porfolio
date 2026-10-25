-- Migration 0005: Create about_chapters table and extend settings for About Me section
create table if not exists public.about_chapters (
  id uuid primary key default gen_random_uuid(),
  badge text not null check (char_length(badge) between 1 and 80),
  title text not null check (char_length(title) between 1 and 120),
  subtitle text check (char_length(subtitle) <= 160),
  theme text not null default 'cosmic' check (theme in ('cosmic', 'code', 'experiment', 'product', 'vision')),
  paragraphs text not null check (char_length(paragraphs) between 1 and 3000),
  tech_tags text[] not null default '{}' check (cardinality(tech_tags) <= 12),
  stat_label_1 text check (char_length(stat_label_1) <= 60),
  stat_val_1 text check (char_length(stat_val_1) <= 60),
  stat_label_2 text check (char_length(stat_label_2) <= 60),
  stat_val_2 text check (char_length(stat_val_2) <= 60),
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.about_chapters enable row level security;

-- Public: read published chapters
create policy "public reads published about_chapters" on public.about_chapters
  for select to anon, authenticated using (published);

-- Admin: full control
create policy "admin manages about_chapters" on public.about_chapters
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create index if not exists about_chapters_sort_idx on public.about_chapters (sort_order);

-- Add about section custom title and lead in settings if not present
alter table public.settings add column if not exists about_heading text default 'Curiosity made me a builder.';
alter table public.settings add column if not exists about_lead text default 'I am an 18-year-old student at NRVM in Simara, Nepal, exploring software development, .NET, desktop, and mobile applications.';
alter table public.settings add column if not exists age text default '18';

-- Insert truthful initial seed chapters
insert into public.about_chapters (badge, title, subtitle, theme, paragraphs, tech_tags, stat_label_1, stat_val_1, stat_label_2, stat_val_2, sort_order, published)
values
(
  '01 / THE BEGINNING',
  'Curiosity Made Me a Builder',
  'Grade 12 Student · NRVM, Simara',
  'cosmic',
  'I am an 18-year-old Grade 12 student at NRVM in Simara, Nepal, with a strong interest in technology, software, computers, networking, and AI. I enjoy exploring how software works and learning to build applications, particularly with .NET, desktop development, and mobile app development.

Before I started coding, I was fascinated by space science and enjoyed learning about the universe, physics, and how things work.',
  '{"Space Science","Physics",".NET","Computer Science"}',
  'Age', '18 Years Old',
  'School', 'NRVM, Simara',
  1,
  true
),
(
  '02 / FIRST EXPOSURE',
  'My First Steps into Code',
  'Grade 7 · CodeWithHarry & My Father',
  'code',
  'In Grade 7, I started learning programming through CodeWithHarry''s YouTube tutorials. My father introduced me to HTML, which helped me understand how a simple text file could become a webpage.

That was the beginning of my coding journey. I started exploring more, learning new concepts, and gradually developing a deeper interest in programming and software development.',
  '{"HTML","CSS","YouTube Tutorials","Web Basics"}',
  'Started', 'Grade 7',
  'First Spark', 'Father introduced HTML',
  2,
  true
),
(
  '03 / EXPERIMENTATION',
  'Exploring Memory, APIs, and .NET',
  'Grade 10 · Practical Logic & Systems',
  'experiment',
  'By Grade 10, I was exploring programming beyond the basics. I started experimenting with Free Fire-related desktop cheats built with .NET, including memory manipulation, AOB (Array of Bytes) scanning, and understanding how applications interact with APIs.

I also explored KeyAuth integration and learned more about application behavior, memory, and the logic behind these tools. These experiments helped me improve my practical programming knowledge and understand concepts that I wanted to explore further.',
  '{".NET","Memory Manipulation","AOB Scanning","APIs","KeyAuth"}',
  'Focus', 'Memory & APIs',
  'Platform', '.NET Desktop',
  3,
  true
),
(
  '04 / REAL-WORLD WORK',
  'Working on Real Projects',
  'Focus Collaboration · The BC Cargo & Courier',
  'product',
  'I am currently working with Focus on The BC Cargo & Courier''s website and its related systems. My work includes website development, billing-related functionality, the admin panel, backend logic, and database-related tasks.

This experience gives me an opportunity to apply what I learn while working on software that supports real business operations.',
  '{"Website Dev","Billing Logic","Admin Panel","Database / Supabase"}',
  'Client / Work', 'The BC Cargo',
  'Role', 'Website & Billing Logic',
  4,
  true
),
(
  '05 / FUTURE VISION',
  'A Marketplace for Software Projects',
  'Aspirational Goal · Digital Creator Platform',
  'vision',
  'One of my future goals is to build a platform where I can sell my own digital projects and software to vendors.

I want each vendor to have a dedicated URL, access to purchased projects, and a dashboard where they can manage their products and related information. I am still developing this idea and want to turn it into a practical project as my skills grow.',
  '{"Multi-Vendor","Storefront URLs","Vendor Dashboards","Digital Marketplace"}',
  'Goal', 'Vendor Platform',
  'Status', 'Concept in Development',
  5,
  true
);
