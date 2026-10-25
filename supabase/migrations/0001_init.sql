-- Portfolio schema. RLS is ON for every table.
-- After creating your admin user in Supabase Auth, run:
--   insert into public.admins (user_id) select id from auth.users where email = 'YOU@EXAMPLE.COM';

create table public.admins (user_id uuid primary key references auth.users (id) on delete cascade);
alter table public.admins enable row level security;
create policy "admin reads own row" on public.admins for select to authenticated using (user_id = (select auth.uid()));

create function public.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.admins where user_id = (select auth.uid())) $$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{2,60}$'),
  name text not null check (char_length(name) between 1 and 80),
  tagline text not null check (char_length(tagline) between 1 and 200),
  description text not null check (char_length(description) between 1 and 2000),
  tags text[] not null default '{}' check (cardinality(tags) <= 12),
  color text not null default 'blue' check (color in ('blue','pink','teal','orange','gold')),
  image_url text check (image_url is null or image_url ~ '^(https://|/)'),
  live_url text check (live_url is null or live_url ~ '^https://'),
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('service','tools')),
  title text not null check (char_length(title) between 1 and 80),
  description text check (char_length(description) <= 300),
  best_for text check (char_length(best_for) <= 120),
  project_slug text check (char_length(project_slug) <= 60),
  items text[] not null default '{}' check (cardinality(items) <= 20),
  color text not null default 'blue' check (color in ('blue','pink','teal','orange','gold')),
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  role text check (char_length(role) <= 120),
  quote text not null check (char_length(quote) between 1 and 600),
  avatar_url text check (avatar_url is null or avatar_url ~ '^https://'),
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  email text not null check (char_length(email) between 3 and 120),
  body text not null check (char_length(body) between 10 and 2000),
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.settings (
  id int primary key default 1 check (id = 1),
  location text not null, role_line text not null,
  hero_line_1 text not null, hero_line_2 text not null, hero_intro text not null,
  open_to_work boolean not null default true,
  email text, email_2 text, github_url text check (github_url is null or github_url ~ '^https://'),
  instagram_url text check (instagram_url is null or instagram_url ~ '^https://'),
  about_1 text not null, about_2 text,
  photo_url text check (photo_url is null or photo_url ~ '^https://')
);

alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.testimonials enable row level security;
alter table public.messages enable row level security;
alter table public.settings enable row level security;

-- Public: read published content only
create policy "public reads published projects" on public.projects for select to anon, authenticated using (published);
create policy "public reads published skills" on public.skills for select to anon, authenticated using (published);
create policy "public reads published testimonials" on public.testimonials for select to anon, authenticated using (published);
create policy "public reads settings" on public.settings for select to anon, authenticated using (true);

-- Admin: full control (policies are scoped to authenticated, then gated by is_admin())
create policy "admin manages projects" on public.projects for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin manages skills" on public.skills for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin manages testimonials" on public.testimonials for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin manages settings" on public.settings for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Messages: anyone may send one (unread only); only the admin may read, update or delete
create policy "anyone sends message" on public.messages for insert to anon, authenticated with check (read = false);
create policy "admin reads messages" on public.messages for select to authenticated using ((select public.is_admin()));
create policy "admin updates messages" on public.messages for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin deletes messages" on public.messages for delete to authenticated using ((select public.is_admin()));

create index on public.projects (sort_order);
create index on public.skills (sort_order);
create index on public.testimonials (sort_order);
create index on public.messages (created_at desc);

-- Seed content (no sample entries, no fake testimonials)
insert into public.settings (id, email, email_2, location, role_line, hero_line_1, hero_line_2, hero_intro, about_1, about_2) values (
  1, 'ayushytaryal@gmail.com', 'ayusharyalgmail@gmail.com', 'Hetauda, Nepal', 'Software builder · Hetauda, Nepal', 'I build software', 'businesses run on.',
  'Self-taught developer in Hetauda, Nepal. Websites, Android apps and billing systems, built for a real courier company and used every day.',
  'I started with school projects and moved to production software for The BC Cargo & Courier Service, a family courier business in Hetauda. I built its website, Android app, billing software and analytics myself.',
  'I use AI coding tools, but I direct the design and check the code. My rule: inspect first, change carefully, test, then report exactly what changed.');

insert into public.projects (slug, name, tagline, description, tags, color, sort_order) values
('the-bc-cargo','The BC Cargo','Billing, rates and a public site for an international courier in Hetauda.','Website for BC Cargo & Courier, shipping from Hetauda to 190+ countries: an interactive destination globe, air, road, sea and customs services, parcel tracking, price estimates and a knowledge-base AI assistant. Plus a WinUI billing app with bill printing, an Android app and the backend behind them. Prices load from a Google Sheet, so staff change rates without touching code.','{Next.js,"WinUI + C#",Android,Supabase,"Google Sheets",Tracking}','blue',1),
('datewithstranger','DateWithStranger','A free Discord community bot, rebuilt on a modern backend.','Moving from a legacy Mongo database to Supabase, with profiles, profile pictures, webhooks and several interface languages. The bot ships first, the website follows.','{"Discord bot",Supabase,Webhooks,Multilingual}','pink',2),
('lm-arena-api','LM Arena API','A chat-style site driven by its own backend API.','The backend automates LM Arena with Playwright, keeps logs, handles errors and tests itself, so problems surface without manual hunting.','{Playwright,"Backend API",Logging,Auto-tests}','teal',3),
('arduino-control','Arduino control','Switch a light and a fan from a phone over Bluetooth.','An Arduino Uno, an HC-05 module and a relay board, paired with a small Java Android app. It taught me how hardware, code and a phone fit together.','{Arduino,HC-05,Relay,Java}','orange',4);

insert into public.skills (kind, title, description, best_for, project_slug, items, color, sort_order) values
('service','Business software','Billing, rate calculators, printing and dashboards that replace paper and spreadsheets.','shops, couriers, offices','the-bc-cargo','{}','blue',1),
('service','Websites & web apps','Fast, clean sites in React and Next.js, with live data and SEO from day one.','company and service sites','the-bc-cargo','{}','pink',2),
('service','Android apps','Simple phone apps for staff and customers, connected to the same backend as the website.','field staff, tracking, forms','arduino-control','{}','teal',3),
('service','Backend & automation','Supabase databases, bots, APIs and scripts that remove repeated manual work.','bots, integrations, reports','lm-arena-api','{}','orange',4);
insert into public.skills (kind, title, items, color, sort_order) values
('tools','Use most','{JavaScript,TypeScript,C#}','blue',11),
('tools','Comfortable with','{Java,Python,SQL,"HTML & CSS"}','blue',12),
('tools','Frameworks & tools','{React,Next.js,WinUI,Supabase,Playwright}','blue',13),
('tools','Hardware','{"Arduino C++"}','blue',14);

update public.projects set image_url = '/projects/the-bc-cargo.jpg', live_url = 'https://thebccargo.com' where slug = 'the-bc-cargo';
