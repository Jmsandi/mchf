import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {database} from './store';
export const roles=['super_admin','administrator','programme_manager','research_editor','communications_editor','reviewer','author'];
export async function staff(){const user=await getChatGPTUser();if(!user)return null;const allow=String((env as any).ADMIN_EMAILS||'').toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);if(allow.includes(user.email.toLowerCase())||(import.meta.env.DEV&&user.email==='seedy@sites.test'))return {...user,role:'super_admin'};const member=await database().prepare('SELECT role FROM members WHERE email = ?').bind(user.email.toLowerCase()).first<{role:string}>();return member?{...user,role:member.role}:null;}
export function canEdit(role:string,kind:string){if(['super_admin','administrator','author'].includes(role))return true;return role==='programme_manager'?['programme','intervention','project','activity','impact'].includes(kind):role==='research_editor'?['research','publication','report','resource'].includes(kind):role==='communications_editor'?['news','event','story','career'].includes(kind):role==='reviewer';}
export function canPublish(role:string){return ['super_admin','administrator'].includes(role);}
export function sameOrigin(request:Request){const origin=request.headers.get('origin');return !!origin&&origin===new URL(request.url).origin;}
