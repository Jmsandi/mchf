-- MCHF publishing, staff authorization, private media and aggregate audience reporting.
create table public.mchf_members (
 id uuid primary key default gen_random_uuid(), email text not null unique check(email=lower(email)),
 role text not null check(role in ('super_admin','administrator','programme_manager','research_editor','communications_editor','reviewer','author')),
 created_by text not null, created_at timestamptz not null default now()
);
create table public.mchf_content (
 id text primary key, kind text not null check(kind in ('page','programme','intervention','activity','project','research','publication','report','news','insight','event','leadership','partner','impact','story','resource','career','contact','setting')),
 slug text not null, title text not null, summary text not null default '', body text not null default '',
 status text not null default 'draft' check(status in ('draft','review','approved','published','archived')),
 programme text not null default '', year text not null default '', topic text not null default '', location text not null default '',
 image text not null default '', file text not null default '', source text not null default '', meta jsonb not null default '{}' check(jsonb_typeof(meta)='object'),
 publish_at timestamptz, updated_by text not null, updated_at timestamptz not null default now(), unique(kind,slug),
 check(kind<>'impact' or status<>'published' or (source<>'' and coalesce(meta->>'definition','')<>'' and coalesce(meta->>'methodology','')<>'' and coalesce(meta->>'date','')<>''))
);
create index mchf_content_public on public.mchf_content(status,publish_at,updated_at desc);
create index mchf_content_programme on public.mchf_content(programme,kind);
create table public.mchf_inquiries (
 id uuid primary key default gen_random_uuid(),name text not null,email text not null,organization text not null default '',phone text not null default '',
 type text not null,interest text not null default '',message text not null,status text not null default 'new' check(status in ('new','reviewed','resolved')),
 created_at timestamptz not null default now()
);
create table public.mchf_media (
 id uuid primary key default gen_random_uuid(),key text not null unique,filename text not null,mime text not null,size integer not null check(size between 1 and 10000000),
 alt text not null default '',uploaded_by text not null,created_at timestamptz not null default now()
);
create table public.mchf_audit (
 id uuid primary key default gen_random_uuid(),actor text not null,action text not null,record_id text not null,details text not null default '',created_at timestamptz not null default now()
);
create table public.mchf_rate_limits (key text primary key,count integer not null,expires timestamptz not null);
create table public.mchf_analytics_events (
 id uuid primary key,path text not null,visitor_hash text not null,referrer text not null default '',device text not null check(device in ('desktop','tablet','mobile')),
 country text not null default '',duration integer not null default 0 check(duration between 0 and 7200),occurred_at timestamptz not null default now(),last_seen timestamptz not null default now()
);
create index mchf_analytics_date on public.mchf_analytics_events(occurred_at);
create index mchf_analytics_live on public.mchf_analytics_events(last_seen);

create function public.mchf_staff_role() returns text language sql stable security definer set search_path='' as $$
 select role from public.mchf_members where email=lower(auth.jwt()->>'email') limit 1;
$$;
create function public.mchf_can_edit(p_kind text) returns boolean language sql stable security definer set search_path='' as $$
 select coalesce(case public.mchf_staff_role()
 when 'super_admin' then true when 'administrator' then true when 'author' then true when 'reviewer' then true
 when 'programme_manager' then p_kind in ('programme','intervention','project','activity','impact')
 when 'research_editor' then p_kind in ('research','publication','report','resource')
 when 'communications_editor' then p_kind in ('news','insight','event','story','career') else false end,false);
$$;
create function public.mchf_can_save(p_kind text,p_status text) returns boolean language sql stable security definer set search_path='' as $$
 select public.mchf_can_edit(p_kind) and case when public.mchf_staff_role() in ('super_admin','administrator') then true
 when public.mchf_staff_role()='reviewer' then p_status in ('review','approved') else p_status in ('draft','review') end;
$$;
create function public.mchf_content_ready() returns boolean language sql stable security definer set search_path='' as $$select exists(select 1 from public.mchf_content);$$;

alter table public.mchf_members enable row level security;
alter table public.mchf_content enable row level security;
alter table public.mchf_inquiries enable row level security;
alter table public.mchf_media enable row level security;
alter table public.mchf_audit enable row level security;
alter table public.mchf_rate_limits enable row level security;
alter table public.mchf_analytics_events enable row level security;
revoke all on public.mchf_members,public.mchf_content,public.mchf_inquiries,public.mchf_media,public.mchf_audit,public.mchf_rate_limits,public.mchf_analytics_events from anon,authenticated;
grant select on public.mchf_content,public.mchf_media to anon;
grant select,insert,update on public.mchf_content to authenticated;
grant select on public.mchf_members,public.mchf_inquiries,public.mchf_media,public.mchf_audit to authenticated;
grant insert on public.mchf_media to authenticated;
grant update(status) on public.mchf_inquiries to authenticated;
grant all on public.mchf_members,public.mchf_content,public.mchf_inquiries,public.mchf_media,public.mchf_audit,public.mchf_rate_limits,public.mchf_analytics_events to service_role;
create policy mchf_content_read on public.mchf_content for select to anon,authenticated using ((status='published' and (publish_at is null or publish_at<=now())) or public.mchf_staff_role() is not null);
create policy mchf_content_insert on public.mchf_content for insert to authenticated with check(public.mchf_can_save(kind,status) and updated_by=lower(auth.jwt()->>'email'));
create policy mchf_content_update on public.mchf_content for update to authenticated using(public.mchf_can_edit(kind) and (public.mchf_staff_role() in ('super_admin','administrator') or (status<>'published' and (public.mchf_staff_role()<>'author' or updated_by=lower(auth.jwt()->>'email'))))) with check(public.mchf_can_save(kind,status) and updated_by=lower(auth.jwt()->>'email'));
create policy mchf_members_read on public.mchf_members for select to authenticated using(email=lower(auth.jwt()->>'email') or public.mchf_staff_role()='super_admin');
create policy mchf_inquiries_read on public.mchf_inquiries for select to authenticated using(public.mchf_staff_role() in ('super_admin','administrator'));
create policy mchf_inquiries_update on public.mchf_inquiries for update to authenticated using(public.mchf_staff_role() in ('super_admin','administrator')) with check(public.mchf_staff_role() in ('super_admin','administrator'));
create policy mchf_media_read on public.mchf_media for select to anon,authenticated using(public.mchf_staff_role() is not null or exists(select 1 from public.mchf_content c where c.status='published' and (c.publish_at is null or c.publish_at<=now()) and (c.image='/api/media/'||mchf_media.id::text or c.file='/api/media/'||mchf_media.id::text)));
create policy mchf_media_insert on public.mchf_media for insert to authenticated with check(public.mchf_staff_role() is not null and public.mchf_staff_role()<>'reviewer' and uploaded_by=lower(auth.jwt()->>'email'));
create policy mchf_audit_read on public.mchf_audit for select to authenticated using(public.mchf_staff_role() in ('super_admin','administrator'));

create function public.mchf_normalize_content() returns trigger language plpgsql security definer set search_path='' as $$
 begin new.updated_at=now();if auth.jwt()->>'email' is not null then new.updated_by=lower(auth.jwt()->>'email');end if;
 new.publish_at=nullif(new.meta->>'publishAt','')::timestamptz;return new;end;
$$;
create trigger mchf_content_normalize before insert or update on public.mchf_content for each row execute function public.mchf_normalize_content();
create function public.mchf_audit_change() returns trigger language plpgsql security definer set search_path='' as $$
 declare r jsonb;actor text;action text;
 begin r=to_jsonb(new);actor=coalesce(lower(auth.jwt()->>'email'),r->>'updated_by',r->>'uploaded_by',r->>'created_by','system');
 action=case tg_table_name when 'mchf_content' then 'save:'||(r->>'status') when 'mchf_members' then 'assign-role' when 'mchf_media' then 'upload' else 'inquiry:'||(r->>'status') end;
 insert into public.mchf_audit(actor,action,record_id,details) values(actor,action,r->>'id',jsonb_build_object('table',tg_table_name,'title',r->>'title','role',r->>'role')::text);return new;end;
$$;
create trigger mchf_content_audit after insert or update on public.mchf_content for each row execute function public.mchf_audit_change();
create trigger mchf_members_audit after insert or update on public.mchf_members for each row execute function public.mchf_audit_change();
create trigger mchf_media_audit after insert on public.mchf_media for each row execute function public.mchf_audit_change();
create trigger mchf_inquiries_audit after update on public.mchf_inquiries for each row execute function public.mchf_audit_change();

create function public.mchf_consume_rate_limit(p_key text,p_max integer,p_seconds integer) returns boolean language plpgsql security definer set search_path='' as $$
 declare n integer;
 begin insert into public.mchf_rate_limits as r(key,count,expires) values(p_key,1,now()+make_interval(secs=>p_seconds))
 on conflict(key) do update set count=case when r.expires<now() then 1 else r.count+1 end,expires=case when r.expires<now() then now()+make_interval(secs=>p_seconds) else r.expires end returning count into n;
 delete from public.mchf_rate_limits where expires<now()-interval '1 day';return n<=p_max;end;
$$;
create function public.mchf_record_visit(p_id uuid,p_path text,p_visitor_hash text,p_referrer text,p_device text,p_country text,p_duration integer,p_event text) returns void language plpgsql security definer set search_path='' as $$
 begin if p_event='pageview' then
 insert into public.mchf_analytics_events(id,path,visitor_hash,referrer,device,country) values(p_id,p_path,p_visitor_hash,p_referrer,p_device,p_country) on conflict(id) do nothing;
 elsif p_event='engagement' then update public.mchf_analytics_events set duration=greatest(duration,least(7200,greatest(0,p_duration))),last_seen=now() where id=p_id and visitor_hash=p_visitor_hash and path=p_path;
 else raise exception 'Invalid event';end if;
 delete from public.mchf_analytics_events where id in (select id from public.mchf_analytics_events where occurred_at<now()-interval '90 days' limit 5000);end;
$$;
create function public.mchf_analytics_report(p_days integer default 30) returns jsonb language plpgsql security definer set search_path='' set timezone='UTC' as $$
 declare result jsonb;start_date date;
 begin if public.mchf_staff_role() is null or public.mchf_staff_role() not in ('super_admin','administrator') then raise exception 'Administrator access required' using errcode='42501';end if;
 if p_days not in (7,30,90) then raise exception 'Invalid date range';end if;start_date=current_date-p_days+1;
 with e as(select * from public.mchf_analytics_events where occurred_at>=start_date::timestamptz and occurred_at<=now()),
 daily as(select g::date as day,count(e.id)::integer as views,count(distinct e.visitor_hash)::integer as visitors from generate_series(start_date::timestamp,current_date::timestamp,interval '1 day') g left join e on e.occurred_at::date=g::date group by g),
 pages as(select path,count(*)::integer views,count(distinct visitor_hash)::integer visitors from e group by path order by views desc limit 20),
 refs as(select coalesce(nullif(referrer,''),'Direct / internal') as source,count(*)::integer views from e group by source order by views desc),
 devices as(select device,count(*)::integer views from e group by device order by views desc),
 countries as(select coalesce(nullif(country,''),'Unknown') country,count(*)::integer views from e group by coalesce(nullif(country,''),'Unknown') order by views desc)
 select jsonb_build_object('summary',jsonb_build_object('visitorsToday',(select visitors from daily where day=current_date),'viewsToday',(select views from daily where day=current_date),'visitorsPeriod',(select coalesce(sum(visitors),0) from daily),'viewsPeriod',(select count(*) from e),'activeNow',(select count(distinct visitor_hash) from e where last_seen>=now()-interval '5 minutes'),'averageEngagement',(select coalesce(round(avg(duration)),0) from e)),
 'daily',(select coalesce(jsonb_agg(jsonb_build_object('date',day,'views',views,'visitors',visitors) order by day),'[]') from daily),
 'pages',(select coalesce(jsonb_agg(to_jsonb(pages)),'[]') from pages),'referrers',(select coalesce(jsonb_agg(to_jsonb(refs)),'[]') from refs),'devices',(select coalesce(jsonb_agg(to_jsonb(devices)),'[]') from devices),'countries',(select coalesce(jsonb_agg(to_jsonb(countries)),'[]') from countries)) into result;return result;end;
$$;
revoke all on function public.mchf_staff_role(),public.mchf_can_edit(text),public.mchf_can_save(text,text),public.mchf_content_ready(),public.mchf_normalize_content(),public.mchf_audit_change(),public.mchf_consume_rate_limit(text,integer,integer),public.mchf_record_visit(uuid,text,text,text,text,text,integer,text),public.mchf_analytics_report(integer) from public;
grant execute on function public.mchf_staff_role(),public.mchf_can_edit(text),public.mchf_can_save(text,text),public.mchf_content_ready() to anon,authenticated;
grant execute on function public.mchf_analytics_report(integer) to authenticated;
grant execute on function public.mchf_consume_rate_limit(text,integer,integer),public.mchf_record_visit(uuid,text,text,text,text,text,integer,text) to service_role;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('mchf-media','mchf-media',false,10000000,array['image/jpeg','image/png','image/webp','application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.presentationml.presentation']) on conflict(id) do nothing;
create policy mchf_staff_storage_read on storage.objects for select to authenticated using(bucket_id='mchf-media' and public.mchf_staff_role() is not null);
-- Uploads and public delivery use the server API, which validates staff roles, MIME signatures and published references.
