import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {canEdit,canPublish,canSaveStatus,isPublicRecord} from '../lib/content-policy';
import {aggregateAudience,publicAnalyticsPath,Visit} from '../lib/analytics-data';

const db=new PGlite();
before(async()=>{
 await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create schema storage;grant usage on schema public,auth,storage to anon,authenticated,service_role;create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb$$;grant execute on function auth.jwt() to anon,authenticated,service_role;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;grant select on storage.objects to authenticated;`);
 await db.exec(await readFile(new URL('../supabase/migrations/202610010001_mchf_platform.sql',import.meta.url),'utf8'));
 await db.exec(`insert into public.mchf_members(email,role,created_by) values ('info@mchf.org','super_admin','system'),('author@mchf.org','author','system'),('research@mchf.org','research_editor','system'),('comms@mchf.org','communications_editor','system'),('reviewer@mchf.org','reviewer','system');insert into public.mchf_content(id,kind,slug,title,status,updated_by,meta) values ('public','news','public','Published update','published','info@mchf.org','{}'),('draft','news','draft','Private draft','draft','author@mchf.org','{}'),('scheduled','insight','scheduled','Tomorrow’s insight','published','info@mchf.org',jsonb_build_object('publishAt',(now()+interval '1 day')::text)),('archived','news','archived','Archived content','archived','info@mchf.org','{}');`);
});
after(async()=>{await db.close();});
async function identity(email:string|null,role='authenticated'){await db.exec('reset role');await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify(email?{email}:{})]);await db.exec('set role '+role);}

test('Public API can read published records but cannot read drafts, future posts or archived content',async()=>{
 await identity(null,'anon');const rows=await db.query<{id:string}>('select id from public.mchf_content order by id');assert.deepEqual(rows.rows.map(r=>r.id),['public']);
 await assert.rejects(db.exec("insert into public.mchf_content(id,kind,slug,title,status,updated_by) values('attack','news','attack','Attack','published','info@mchf.org')"));
 await assert.rejects(db.exec('select * from public.mchf_inquiries'));await assert.rejects(db.exec('select * from public.mchf_members'));
});
test('A signed-in non-staff user cannot become an administrator or access private reporting',async()=>{
 await identity('visitor@example.org');assert.deepEqual((await db.query<{id:string}>('select id from public.mchf_content')).rows.map(r=>r.id),['public']);
 await assert.rejects(db.exec("insert into public.mchf_members(email,role,created_by) values('visitor@example.org','super_admin','visitor@example.org')"));
 await assert.rejects(db.exec('select public.mchf_analytics_report(30)'));
});
test('Authors can save their own drafts but cannot publish, overwrite published work or forge audit events',async()=>{
 await identity('author@mchf.org');await db.exec("insert into public.mchf_content(id,kind,slug,title,status,updated_by) values('author-draft','news','author-draft','Author draft','draft','author@mchf.org')");
 await assert.rejects(db.exec("insert into public.mchf_content(id,kind,slug,title,status,updated_by) values('author-pub','news','author-pub','Unauthorized publication','published','author@mchf.org')"));
 const update=await db.query("update public.mchf_content set title='Changed' where id='public' returning id");assert.equal(update.rows.length,0);
 await assert.rejects(db.exec("insert into public.mchf_audit(actor,action,record_id) values('info@mchf.org','publish','public')"));
});
test('Editors are limited to their portfolio and reviewers can approve without publishing',async()=>{
 await identity('research@mchf.org');await db.exec("insert into public.mchf_content(id,kind,slug,title,status,updated_by) values('study','research','study','Study draft','review','research@mchf.org')");
 await assert.rejects(db.exec("insert into public.mchf_content(id,kind,slug,title,status,updated_by) values('wrong-kind','news','wrong-kind','News draft','draft','research@mchf.org')"));
 await identity('comms@mchf.org');await db.exec("insert into public.mchf_content(id,kind,slug,title,status,updated_by) values('insight-draft','insight','insight-draft','Daily insight draft','review','comms@mchf.org')");
 await identity('reviewer@mchf.org');await db.exec("update public.mchf_content set status='approved' where id='author-draft'");
 await assert.rejects(db.exec("update public.mchf_content set status='published' where id='author-draft'"));
});
test('Admin publication produces a trusted audit entry and verified results require evidence',async()=>{
 await identity('info@mchf.org');await db.exec("update public.mchf_content set status='published' where id='author-draft'");
 const rows=await db.query<{actor:string}>("select actor from public.mchf_audit where record_id='author-draft' and action='save:published'");assert.equal(rows.rows[0].actor,'info@mchf.org');
 await assert.rejects(db.exec("insert into public.mchf_content(id,kind,slug,title,status,updated_by) values('bad-result','impact','bad-result','Result without evidence','published','info@mchf.org')"));
});
test('Draft media metadata is private and becomes public only when a published record references it',async()=>{
 await identity('info@mchf.org');await db.exec("insert into public.mchf_media(id,key,filename,mime,size,alt,uploaded_by) values('00000000-0000-4000-8000-000000000001','media/one','portrait.jpg','image/jpeg',30,'Portrait','info@mchf.org'),('00000000-0000-4000-8000-000000000002','media/two','draft.jpg','image/jpeg',30,'Private portrait','info@mchf.org');update public.mchf_content set image='/api/media/00000000-0000-4000-8000-000000000001' where id='public';");
 await identity(null,'anon');const rows=await db.query<{filename:string}>('select filename from public.mchf_media');assert.deepEqual(rows.rows.map(r=>r.filename),['portrait.jpg']);
});
test('Visitor events are idempotent, identifiers cannot overwrite others’ engagement, and only admins can report',async()=>{
 await identity(null,'anon');await assert.rejects(db.exec("select public.mchf_record_visit('00000000-0000-4000-8000-000000000003','/news','hash','','desktop','SL',0,'pageview')"));
 await identity(null,'service_role');await db.exec("select public.mchf_record_visit('00000000-0000-4000-8000-000000000003','/news','hash','','desktop','SL',0,'pageview');select public.mchf_record_visit('00000000-0000-4000-8000-000000000003','/news','hash','','desktop','SL',0,'pageview');select public.mchf_record_visit('00000000-0000-4000-8000-000000000003','/news','wrong-hash','','desktop','SL',999,'engagement');");
 await identity('info@mchf.org');const result=await db.query<{report:any}>('select public.mchf_analytics_report(7) report');assert.equal(result.rows[0].report.summary.viewsToday,1);assert.equal(result.rows[0].report.summary.visitorsToday,1);assert.equal(result.rows[0].report.summary.averageEngagement,0);assert.equal(result.rows[0].report.daily.length,7);
 await identity('author@mchf.org');await assert.rejects(db.exec('select public.mchf_analytics_report(7)'));
});
test('Rate limits enforce a bounded request window',async()=>{
 await identity(null,'service_role');const values=[];for(let i=0;i<3;i++){const r=await db.query<{allowed:boolean}>("select public.mchf_consume_rate_limit('test-window',2,3600) allowed");values.push(r.rows[0].allowed);}assert.deepEqual(values,[true,true,false]);
});
test('Publishing rules and daily aggregates exclude drafts, staff routes and URL query strings',()=>{
 assert.equal(canEdit('communications_editor','insight'),true);assert.equal(canEdit('research_editor','news'),false);assert.equal(canEdit('unknown','news'),false);assert.equal(canPublish('author'),false);assert.equal(canSaveStatus('reviewer','published'),false);
 assert.equal(isPublicRecord({status:'published',meta:{publishAt:'2026-10-02T00:00:00Z'}},Date.parse('2026-10-01T00:00:00Z')),false);
 for(const path of ['/admin','/admin/team','/api/analytics','/news?email=private','//external.org'])assert.equal(publicAnalyticsPath(path),false);
 const event=(id:string,day:string,hash:string):Visit=>({id,path:'/news',visitor_hash:hash,referrer:'',device:'mobile',country:'SL',duration:10,occurred_at:day+'T08:00:00Z',last_seen:day+'T08:00:00Z'});
 const report=aggregateAudience([event('1','2026-09-30','a'),event('2','2026-10-01','b'),event('3','2026-10-01','b')],7,new Date('2026-10-01T12:00:00Z'));assert.equal(report.summary.visitorsToday,1);assert.equal(report.summary.viewsToday,2);assert.equal(report.summary.visitorsPeriod,2);assert.equal(report.summary.viewsPeriod,3);assert.equal(report.summary.averageEngagement,10);
});
