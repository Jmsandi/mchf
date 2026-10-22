'use client';

import {useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight, MapPin, Search} from 'lucide-react';
import {regions, districtCount, geographySource} from '@/lib/sierra-leone';

export default function SierraLeoneDirectory() {
  const [selected, setSelected] = useState('all');
  const [search, setSearch] = useState('');
  const matches = regions.filter(region => selected === 'all' || region.id === selected)
    .map(region => ({...region, districts: region.districts.filter(district => district.toLowerCase().includes(search.trim().toLowerCase()))}))
    .filter(region => region.districts.length);
  const total = matches.reduce((count, region) => count + region.districts.length, 0);

  return <section className='section district-directory' aria-labelledby='district-heading'>
    <div className='container'>
      <div className='section-head'><div><span className='eyebrow'>OUR NATIONAL FOCUS</span><h2 id='district-heading'>Every district belongs in the conversation.</h2></div><p>Explore Sierra Leone’s {districtCount} districts and connect with MCHF about your community.</p></div>
      <div className='district-tools'>
        <div className='region-filters' role='group' aria-label='Filter districts by region'>
          {[{id: 'all', name: 'All regions'}, ...regions].map(region => <button key={region.id} type='button' aria-pressed={selected === region.id} onClick={() => setSelected(region.id)}>{region.name}</button>)}
        </div>
        <label className='district-search'><Search size={18}/><span className='sr-only'>Search districts</span><input type='search' placeholder='Find your district' value={search} onChange={event => setSearch(event.target.value)}/></label>
      </div>
      <p className='district-count' role='status' aria-live='polite'>{total} of {districtCount} districts shown</p>
      <div className='district-region-grid'>
        {matches.map(region => <article className={'district-region region-' + region.id} key={region.id}>
          <div className='district-region-heading'><MapPin size={21}/><h3>{region.name}</h3><span>{region.districts.length}</span></div>
          <ul>{region.districts.map(district => <li key={district}><span>{district}</span><Link href={'/contact?district=' + encodeURIComponent(district)} aria-label={'Discuss a collaboration in ' + district}><ArrowUpRight size={18}/></Link></li>)}</ul>
        </article>)}
      </div>
      {!total && <div className='district-empty'><h3>No districts match your search.</h3><p>Try a different district name or view all regions.</p><button type='button' className='button teal' onClick={() => {setSearch(''); setSelected('all');}}>Show all districts</button></div>}
      <div className='district-note'><p>This directory describes the national focus of the website. Confirmed MCHF activities, locations and partners are published in the project listings as implementation develops.</p><a href={geographySource} target='_blank' rel='noreferrer'>Geography source: Statistics Sierra Leone<ArrowUpRight size={14}/></a></div>
    </div>
  </section>;
}
