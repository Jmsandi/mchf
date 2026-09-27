import {env} from 'cloudflare:workers';
import {baseRecords,ContentRecord} from './content';
export function database(){if(!env.DB)throw new Error('Content service unavailable');return env.DB;}
export function parseRecord(r:any):ContentRecord{return {...r,meta:typeof r.meta==='string'?JSON.parse(r.meta):r.meta};}
export async function getContent(all=false):Promise<ContentRecord[]>{const rows=await database().prepare('SELECT * FROM content').all();const map=new Map(baseRecords.map(r=>[r.id,r]));for(const row of rows.results)map.set(String(row.id),parseRecord(row));return [...map.values()].filter(r=>all||r.status==='published');}
export async function publicContent(){try{return {records:await getContent(),unavailable:false};}catch(e){console.error('Public content unavailable',e);return {records:baseRecords,unavailable:true};}}
export async function logAction(actor:string,action:string,recordId:string,details:string){await database().prepare('INSERT INTO audit (id,actor,action,record_id,details,created_at) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(),actor,action,recordId,details,new Date().toISOString()).run();}
