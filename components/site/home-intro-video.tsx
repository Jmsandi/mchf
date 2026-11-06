import {ArrowUpRight} from 'lucide-react';

export default function HomeIntroVideo() {
  return <section className='section home-intro-video' id='intro-video' aria-labelledby='intro-video-title'>
    <div className='container'>
      <div className='section-head'>
        <div>
          <span className='eyebrow'>INTRODUCING MCHF</span>
          <h2 id='intro-video-title'>Meet our foundation.</h2>
          <p className='home-intro-video-summary'>Watch our introduction to the Maternal and Child Health Foundation.</p>
        </div>
        <a className='text-link' href='https://www.youtube.com/watch?v=44yvTLwLRnc' target='_blank' rel='noreferrer'>Watch on YouTube <ArrowUpRight size={17}/></a>
      </div>
      <div className='home-intro-video-player'>
        <iframe
          src='https://www.youtube-nocookie.com/embed/44yvTLwLRnc?rel=0'
          title='MCHF introduction video'
          width='1280'
          height='720'
          loading='lazy'
          referrerPolicy='strict-origin-when-cross-origin'
          allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
        />
      </div>
    </div>
  </section>;
}
