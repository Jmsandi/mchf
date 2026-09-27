import Header from '@/components/site/header';
import Footer from '@/components/site/footer';
import Link from 'next/link';
export default function NotFound(){return <><Header/><main id='main'><section className='section'><div className='container admin-gate'><span className='eyebrow'>PAGE NOT FOUND · 404</span><h1>Let’s find your way.</h1><p>This page may have moved or is not yet published. Explore our programmes or search the institutional library.</p><div className='hero-actions'><Link className='button teal' href='/search'>Search MCHF</Link><Link className='text-link' href='/'>Return home</Link></div></div></section></main><Footer/></>}
