import Link from 'next/link';
import {ArrowUpRight, BookOpen} from 'lucide-react';
import {lessonFor, Lesson, programmeLessons} from '@/lib/education';
import {stockImages, stockImageFor} from '@/lib/stock-images';

export function LearningPanel({lesson}: {lesson: Lesson}) {
  const photo = stockImageFor(lesson.image);
  return <section className='education-section section'>
    <div className='container'>
      <div className='education-intro'>
        <div>
          <span className='eyebrow'><BookOpen size={17}/> UNDERSTAND THE APPROACH</span>
          <h2>{lesson.title}</h2>
          <p>{lesson.intro}</p>
        </div>
        {lesson.image && <figure>
          <img src={lesson.image} alt={photo?.alt || lesson.title} loading='lazy'/>
          {photo && <figcaption>Photo: <a href={photo.source} target='_blank' rel='noreferrer'>{photo.photographer} / Pexels</a></figcaption>}
        </figure>}
      </div>
      <div className='education-cards'>
        {lesson.points.map(([title, text], i) => <article key={title}>
          <span className='education-number'>{String(i + 1).padStart(2, '0')}</span>
          <h3>{title}</h3><p>{text}</p>
        </article>)}
      </div>
      {lesson.link && <div className='education-further'>
        <span>CONTINUE LEARNING</span>
        <a href={lesson.link[1]} target='_blank' rel='noreferrer'>{lesson.link[0]}<ArrowUpRight size={16}/></a>
      </div>}
      <div className='education-source'>
        <p>Framework: MCHF Strategic Plan 2027–2031 and institutional memorandum. This introduction explains the approach; it does not report completed programme results.</p>
        <Link className='text-link' href={lesson.programme ? '/programmes/' + lesson.programme : '/strategic-plan-2027-2031'}>
          {lesson.programme ? 'Explore the strategic priorities' : 'Read the strategic framework'}<ArrowUpRight size={16}/>
        </Link>
      </div>
    </div>
  </section>;
}

function StockPhotographyCredits() {
  return <section className='section'>
    <div className='container'>
      <span className='eyebrow'>LICENSED STOCK PHOTOGRAPHY</span>
      <h2>People, care and collaboration.</h2>
      <p className='learning-overview-intro'>These photographs introduce the website’s programme themes and learning topics. They are downloaded from Pexels, resized for display and served locally. They do not document MCHF projects or imply endorsement by the people pictured.</p>
      <div className='learning-overview-grid'>
        {Object.values(stockImages).map(photo => <figure className='photo-credit' key={photo.image}>
          <img src={photo.image} alt={photo.alt} loading='lazy'/>
          <figcaption>
            <strong>{photo.caption}</strong>
            <span>Photo: {photo.photographer} / Pexels</span>
            <div className='photo-credit-links'>
              <a href={photo.source} target='_blank' rel='noreferrer'>Original source<ArrowUpRight size={14}/></a>
              <a href={photo.license} target='_blank' rel='noreferrer'>Pexels licence<ArrowUpRight size={14}/></a>
            </div>
          </figcaption>
        </figure>)}
      </div>
    </div>
  </section>;
}

export default function EducationSection({path}: {path: string}) {
  if (path.startsWith('resources/understanding-')) return null;
  const lesson = lessonFor(path);
  return lesson ? <>
    <LearningPanel lesson={lesson}/>
    {path === 'image-credits' && <StockPhotographyCredits/>}
  </> : null;
}

export function EducationOverview() {
  return <section className='education-section section'>
    <div className='container'>
      <span className='eyebrow'>PUBLIC HEALTH, EXPLAINED</span>
      <h2>Start with a better understanding.</h2>
      <p className='learning-overview-intro'>Explore five ideas behind MCHF’s programme framework, from connected care to community ownership and evidence.</p>
      <div className='learning-overview-grid'>
        {Object.entries(programmeLessons).map(([slug, lesson]) => <Link href={'/resources/understanding-' + slug} key={slug} className='learning-overview-card'>
          {lesson.image && <img src={lesson.image} alt={stockImageFor(lesson.image)?.alt || lesson.title} loading='lazy'/>}
          <div>
            <span className='eyebrow'>LEARNING GUIDE</span>
            <h3>{lesson.title}</h3><p>{lesson.points[0][1]}</p>
            <span className='text-link'>Read the guide<ArrowUpRight size={16}/></span>
          </div>
        </Link>)}
      </div>
      <p className='source-note'>Stock photographs provide context for the learning topics. <Link href='/image-credits'>View photography credits</Link>.</p>
    </div>
  </section>;
}
