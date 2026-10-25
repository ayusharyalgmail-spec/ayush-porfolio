-- Local WebP images, real DateWithStranger details (Telegram bot, from its live site).
alter table public.settings drop constraint if exists settings_photo_url_check;
alter table public.settings add constraint settings_photo_url_check check (photo_url is null or photo_url ~ '^(https://|/)');
update public.settings set photo_url = '/profile.webp' where id = 1;
update public.projects set image_url = '/projects/the-bc-cargo.webp' where slug = 'the-bc-cargo';
update public.projects set
  tagline = 'A free anonymous chat bot on Telegram, with its own landing site.',
  description = 'Anonymous chat bot on Telegram that matches strangers worldwide, free and with no sign-up. Users can filter by gender, language, country and interests, share photos, video, voice notes, GIFs and stickers, and report abuse (repeat reports trigger an auto-ban). The public site shows live user stats, how it works, a comparison table and an FAQ, and lists 2,000+ users. Being moved from a legacy Mongo database to Supabase, with profiles, profile pictures, webhooks and several interface languages.',
  tags = '{"Telegram bot",Supabase,Webhooks,Multilingual,Render}',
  image_url = '/projects/datewithstranger.webp',
  live_url = 'https://datestranger-bot.onrender.com/'
where slug = 'datewithstranger';
