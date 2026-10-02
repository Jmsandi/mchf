import {isDevelopment,supportsPlatformAuth} from '@/lib/runtime-env';
import {getChatGPTUser,chatGPTSignInPath} from '@/app/chatgpt-auth';
import {staff} from '@/lib/permissions';
import {supabaseConfigured} from '@/lib/supabase';
import {Brand} from '@/components/site/header';
import Admin from '@/components/site/admin';
import AdminLogin from '@/components/site/admin-login';
export const dynamic='force-dynamic';
export const metadata={title:'Admin dashboard | MCHF',robots:{index:false,follow:false}};
export default async function AdminPage(){const configured=supabaseConfigured();let member=null;try{member=await staff();}catch{}if(member)return <main id='main'><Admin role={member.role} email={member.email} provider={configured?'supabase':'local'}/></main>;const user=configured||!supportsPlatformAuth?null:await getChatGPTUser();return <main id='main' className='admin-login-page'><section className='admin-login-card'><Brand/><span className='eyebrow'>MCHF STAFF WORKSPACE</span><h1>Welcome to your publishing desk.</h1><p>Manage the foundation’s website, share daily insights and understand your audience.</p>{configured?<AdminLogin/>:<div className='admin-setup-message'><h2>Connect Supabase to activate staff sign-in.</h2><p>The administrator email is info@mchf.org. Your Supabase project and database setup are required before live publishing can begin.</p>{isDevelopment&&supportsPlatformAuth&&!user&&<a className='button teal' href={chatGPTSignInPath('/admin')} target='_top'>Open local development preview</a>}</div>}<a className='board-profile-link' href='/'>Return to the website</a></section></main>;}
