-- Audit follow-ups: project role field, hero copy, server-side rate limit on messages.
alter table public.projects add column role text check (char_length(role) <= 200);
update public.projects set role = 'Sole developer: website, Windows billing app, Android app and backend' where slug = 'the-bc-cargo';
update public.settings set hero_intro = 'I build software that helps businesses operate smarter — from websites and Android apps to custom dashboards, backend systems, and automation.' where id = 1;

create function public.messages_rate_limit() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if exists (select 1 from public.messages where lower(email) = lower(new.email) and created_at > now() - interval '1 minute') then
    raise exception 'rate_limited';
  end if;
  if (select count(*) from public.messages where created_at > now() - interval '1 hour') >= 30 then
    raise exception 'rate_limited';
  end if;
  return new;
end $$;
revoke all on function public.messages_rate_limit() from public, anon, authenticated;
create trigger messages_rate_limit before insert on public.messages for each row execute function public.messages_rate_limit();
