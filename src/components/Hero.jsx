import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Hero = () => {
  const [videoSrc, setVideoSrc] = useState(window.innerWidth < 760 ? "/assets/videos/smallHero.mp4" : "/assets/videos/hero.mp4");

  const handleVideoSrc = () => {
    if(window.innerWidth < 760) {
      setVideoSrc("assets/videos/smallHero.mp4");
    } else {
      setVideoSrc("assets/videos/hero.mp4");
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleVideoSrc);
    return () => {
      window.removeEventListener('resize', handleVideoSrc);
    }
  }, []);

  useGSAP(() => {
    gsap.to("#hero", { opacity: 1, delay: 1.5 });
    gsap.to("#cta", { opacity: 1, y: -50, delay: 2 });
  }, []);
  return (
    <section className = "w-full nav-height bg-black relative">
      <div className='h-5/6 w-full flex-center flex-col'>
        <p className='hero-title' id = "hero">iPhone 15 Pro</p>
        <div className='md:w-10/12 w-9/12'>
          <video className='pointer-events-none' autoPlay muted playsInline={true} key={videoSrc}>
            <source src = {videoSrc} type='video/mp4' />
          </video>
        </div>
      </div>
      <div id='cta' className='flex flex-col items-center opacity-0 translate-y-20'>
        <a href='#highlights' className='btn'>Buy</a>
        <p className='font-normal text-xl'>From $199/month or $999</p>
      </div>
    </section>
  )
}

export default Hero;