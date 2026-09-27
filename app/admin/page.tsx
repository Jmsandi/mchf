import Header from '@/components/site/header';
import {getChatGPTUser,chatGPTSignInPath} from '@/app/chatgpt-auth';
import {staff} from '@/lib/permissions';
import Admin from '@/components/site/admin';
export const dynamic='force-dynamic';
export const metadata={title:'Staff publishing area | MCHF',robots:{index:false,follow:false}};
export default async function AdminPage(){const user=await getChatGPTUser();let member=null;try{member=await staff()}catch{}return <><Header/><main id='main'>{member?<Admin role={member.role} email={member.email}/>:<section className='section'><div className='container admin-gate'><span className='eyebrow'>MCHF STAFF PORTAL</span><h1>Institutional publishing,<br/>with accountability.</h1><p>{user?'Your account has not been granted staff access. An authorized MCHF administrator must add your email to the staff allowlist.':'Sign in with an authorized staff account to manage institutional content, resources and inquiries.'}</p>{!user&&<a className='button teal' href={chatGPTSignInPath('/admin')} target='_top'>Sign in with ChatGPT</a>}<a className='text-link' href='/'>Return to MCHF</a></div></section>}</main></>}
