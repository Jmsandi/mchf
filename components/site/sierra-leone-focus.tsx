import Link from 'next/link';
import {ArrowRight, ArrowUpRight, MapPin} from 'lucide-react';
import {regions, districtCount, programmeContext} from '@/lib/sierra-leone';
import {stockImages} from '@/lib/stock-images';
import styles from './national-focus.module.css';

export function NationalFocus() {
  return <section className={'national-focus ' + styles.section} aria-labelledby='national-focus-heading'>
    <div className={'container ' + styles.layout}>
      <div className={styles.intro}>
        <span className={styles.eyebrow}><MapPin size={16} aria-hidden='true'/> ROOTED IN SIERRA LEONE</span>
        <h2 id='national-focus-heading' className={styles.title}>One country.<br/>Every community.</h2>
        <p>From Freetown’s neighbourhoods to rural towns, coastal communities and villages, better health begins with listening to the people who live there.</p>
        <p>Our national focus welcomes knowledge and collaboration from all five regions.</p>
        <Link href='/sierra-leone' className={styles.explore}>Explore our Sierra Leone focus<ArrowRight size={18} aria-hidden='true'/></Link>
      </div>
      <div className={styles.panel}>
        <div className={styles.panelHeading}>
          <dl className={styles.stats}>
            <div><dt>Regions</dt><dd>{regions.length}</dd></div>
            <div><dt>Districts</dt><dd>{districtCount}</dd></div>
          </dl>
          <p className={styles.sharedPurpose}>One shared<br/>purpose.</p>
        </div>
        <nav aria-label='Explore Sierra Leone by region'>
          <ul className={styles.regionList}>{regions.map(region => <li key={region.id}>
            <Link className={styles.regionLink} href={'/sierra-leone?region=' + region.id + '#district-heading'} aria-label={'Explore ' + region.name + ' region and its districts'}>
              <span className={styles.regionName}>{region.name}</span>
              <span className={styles.districts}>{region.districts.map(district => <span key={district}>{district}</span>)}</span>
              <ArrowUpRight className={styles.regionArrow} size={18} aria-hidden='true'/>
            </Link>
          </li>)}</ul>
        </nav>
        <p className={styles.note}>District names describe our national outlook. Active project locations are confirmed separately.</p>
      </div>
    </div>
  </section>;
}

export function SierraLeoneContext({path}: {path: string}) {
  const slug = path.startsWith('programmes/') ? path.split('/')[1] : path === 'research' ? 'research-innovation' : path === 'audiences/communities' ? 'community-health' : undefined;
  const context = slug && programmeContext[slug];
  if (!context) return null;
  return <section className='section local-context'><div className='container'><span className='eyebrow'>IN THE SIERRA LEONE CONTEXT</span><h2>Local knowledge. Shared priorities.</h2><p className='local-context-intro'>{context.intro}</p><div className='local-context-grid'>{context.points.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div><Link href='/sierra-leone' className='text-link'>Meet our national focus<ArrowUpRight size={16}/></Link><p className='source-note'>Planning considerations for MCHF’s programme framework. Confirmed delivery locations and activities are listed with each published project.</p></div></section>;
}

export function SierraLeonePrinciples() {
  return <section className='section national-principles'><div className='container national-principles-grid'><figure><img src={stockImages.communityLearning.image} alt={stockImages.communityLearning.alt} loading='lazy'/><figcaption>{stockImages.communityLearning.caption}</figcaption></figure><div><span className='eyebrow'>A LOCAL STARTING POINT</span><h2>Different places.<br/>The same right to be heard.</h2><p>National ambition needs local understanding. A conversation in a city neighbourhood, a remote village or an island community may reveal different priorities.</p><ul><li><strong>Community voices</strong>Listen to women, young people, caregivers and groups who are often excluded.</li><li><strong>Clear communication</strong>Plan for Krio and relevant local languages, accessible information and community feedback.</li><li><strong>Local collaboration</strong>Engage district health teams, community health workers, peripheral health units and local institutions when developing proposals.</li></ul><Link href='/partnerships' className='text-link'>Build a collaboration in Sierra Leone<ArrowUpRight size={16}/></Link></div></div></section>;
}
