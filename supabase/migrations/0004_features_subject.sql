-- Phase 2: project key features (from each project's own description / live site) and an optional message subject.
alter table public.projects add column features text[] not null default '{}' check (cardinality(features) <= 8);
alter table public.messages add column subject text check (subject is null or char_length(subject) <= 120);
update public.projects set features = '{"Interactive destination globe","Air, road, sea and customs services","Parcel tracking by tracking number","Price estimates","AI assistant limited to an approved knowledge base","WinUI billing app with bill printing","Android app"}' where slug = 'the-bc-cargo';
update public.projects set features = '{"Filters by gender, language, country and interests","Photo, video, voice, GIF and sticker sharing","Report system with auto-ban","Live user stats on the landing site"}' where slug = 'datewithstranger';
update public.projects set features = '{"Automates LM Arena with Playwright","Keeps logs and handles errors","Tests itself to surface problems"}' where slug = 'lm-arena-api';
update public.projects set features = '{"Switches a light and a fan from a phone","HC-05 Bluetooth link with a relay board","Small Java Android app"}' where slug = 'arduino-control';
