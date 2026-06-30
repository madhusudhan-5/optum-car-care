import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import ScrollReveal from '@/components/ScrollReveal';
import ImageSplitter from '@/components/ImageSplitter';

async function getHomeConfig() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content/home-config/current/', { next: { revalidate: 10 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (Object.keys(data).length === 0) return null;
    return data;
  } catch (e) {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await getHomeConfig();
  return {
    title: config?.meta_title || "Optum Car Care | Premium Automotive Detailing",
    description: config?.meta_description || "Houston's trusted choice for premium auto care.",
    keywords: config?.meta_keywords || "car detailing, paint protection film, ceramic coating Houston",
  };
}

async function getCuratedMakes() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content/makes/', { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

async function getBrandPartners() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content/partners/', { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

async function getTestimonials() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content/testimonials/', { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

async function getGeneralFAQs() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content/faqs/', { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

async function getServices() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/services/', { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

// Helper function to resolve dynamic image paths served by Django Media
const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http://127.0.0.1:8000')) path = path.replace('http://127.0.0.1:8000', '');
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return `${path}`;
  return `/media/${path}`;
};

// Helper function to extract YouTube ID
const getYoutubeVideoId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default async function Home() {
  const config = await getHomeConfig();
  const services = await getServices();
  const makes = await getCuratedMakes();
  const partners = await getBrandPartners();
  const testimonials = await getTestimonials();
  const faqs = await getGeneralFAQs();

  // If configuration couldn't be loaded, display a premium dynamic loading state
  if (!config) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-6 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-8"></div>
        <h2 className="text-3xl font-heading font-black text-primary uppercase tracking-widest mb-4">Connecting to Optum Car Care...</h2>
        <p className="text-white max-w-md">Please ensure the backend server is running and the database has been populated.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] animate-fade-in">
      {/* 1. HERO SECTION */}
      <section className="bg-[#0a0a0a] text-white py-36 px-6 md:px-12 text-center flex flex-col items-center relative overflow-hidden min-h-[85vh] justify-center">
        {config.hero_image && (
          <div className="absolute inset-0 z-0">
            <img
              src={getImageUrl(config.hero_image)}
              alt="Hero Background"
              className="w-full h-full object-cover object-center scale-105"
            />
          </div>
        )}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] z-0"></div>

        <ScrollReveal direction="down" duration={1000} className="w-full max-w-3xl self-start text-left mt-8 z-10 relative">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 p-5 sm:p-8 rounded-3xl inline-flex flex-col items-start shadow-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-3 tracking-tight leading-none uppercase animate-fade-in-up drop-shadow-xl break-words text-white">
              {config.hero_title}
            </h1>
            <p className="text-lg md:text-xl text-primary font-black leading-relaxed mb-5">
              {config.hero_subtitle}
            </p>
            <p className="font-extrabold text-sm sm:text-base uppercase tracking-wider mb-6 text-white">
              <span className="text-primary text-xl sm:text-2xl font-black">{config.vehicles_protected}</span> vehicles protected and counting.
            </p>
            <Link
              href="#contact-section"
              className="bg-primary text-black font-extrabold uppercase tracking-widest px-6 sm:px-10 py-4 sm:py-5 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg text-[10px] sm:text-xs sheen-container animate-glow-pulse mb-6 text-center"
            >
              Schedule a Vehicle Protection Analysis →
            </Link>
            <div className="flex items-center justify-start gap-2 text-xs text-white font-bold uppercase tracking-wider">
              <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-yellow-400 text-base">★★★★★</span>
              {config.review_rating || '5.0'} STARS, {config.review_count || '205'} Google REVIEWS
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 2. SERVICES GRID */}
      {services.length > 0 && (
        <section className="bg-white py-28 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {services.slice(0, 4).map((service: any, idx: number) => (
              <ScrollReveal key={service.id} delay={idx * 150} direction="up" className="h-full">
                <Link
                  href={`/services/${service.slug}`}
                  className="group relative h-96 overflow-hidden rounded-3xl bg-black flex flex-col justify-between p-6 shadow-md hover:shadow-2xl hover:border-primary/50 transition-all duration-500 block sheen-container"
                >
                  
                  {service.youtube_video_url && getYoutubeVideoId(service.youtube_video_url) ? (
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYoutubeVideoId(service.youtube_video_url)}?autoplay=1&mute=1&loop=1&playlist=${getYoutubeVideoId(service.youtube_video_url)}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&fs=0`}
                        className="absolute w-[300%] h-[300%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : service.hero_image ? (
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-black">
                      <img 
                        src={getImageUrl(service.hero_image)} 
                        alt={service.title} 
                        className="w-full h-full object-cover transition-all duration-700 opacity-100 group-hover:scale-105" 
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] transition-transform duration-700 group-hover:scale-110 z-0"></div>
                  )}

                  <div className="relative z-20 transition-transform duration-300 group-hover:translate-x-1">
                    <h3 className="text-white text-lg font-black font-heading uppercase leading-tight drop-shadow-md">{service.title}</h3>
                  </div>

                  <div className="relative z-20 self-end transition-transform duration-300 group-hover:translate-x-2">
                    <div className="flex items-center text-white text-3xl font-extrabold uppercase tracking-widest drop-shadow-lg">
                      <span className="font-sans">→</span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* 3. INTRODUCTION / PAIN POINTS INTRO SECTION */}
      <section className="bg-[#111] text-white py-28 px-6 md:px-12 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:gap-20 items-center">
          <ScrollReveal direction="left" duration={1000}>
            <span className="text-primary font-black tracking-widest uppercase text-xs mb-4 block">{config.intro_eyebrow || 'You Want the Best for What Matters'}</span>
            <h2 className="text-4xl md:text-5xl font-heading font-black mb-8 uppercase leading-none text-white">
              {config.intro_title}
            </h2>
            <p className="text-white text-lg leading-relaxed mb-8 font-medium">
              {config.intro_description}
            </p>

            <div className="border-t border-white/5 pt-8 mt-8">
              <h3 className="text-lg font-black font-heading text-red-500 uppercase tracking-wide mb-6">
                {config.pain_points_title}
              </h3>
              <ul className="space-y-4">
                {config.pain_points?.map((pp: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-4 text-white">
                    <span className="text-red-500 font-black text-sm bg-red-500/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0">✗</span>
                    <span className="text-sm font-semibold leading-relaxed">{pp.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" duration={1000} className="rounded-3xl bg-gradient-to-br from-[#151515] to-[#0d0d0d] min-h-[400px] md:h-[480px] w-full border border-white/5 relative overflow-hidden flex items-center justify-center shadow-2xl group">
            {config.intro_image ? (
              <img
                src={getImageUrl(config.intro_image)}
                alt="Technical Diagnostics"
                className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-[1500ms]"
              />
            ) : (
              <>
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                <span className="text-white text-sm font-black uppercase tracking-widest relative z-10 select-none">Technical Diagnostics</span>
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. SPECIALISTS IN EV'S & CURATED MAKES */}
      {makes.length > 0 && (
        <section className="bg-white text-black py-28 border-t border-gray-200 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <span className="text-primary font-black tracking-widest uppercase text-xs mb-4 block">{config.makes_eyebrow || "Specialists in EV's & Exotics"}</span>
              <h2 className="text-4xl md:text-6xl font-heading font-black uppercase leading-none">{config.makes_title || 'Services Curated by Makes'}</h2>
            </div>
          </div>

          <div className="relative w-full overflow-hidden flex">
            <div className="absolute top-0 left-0 w-24 md:w-48 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-24 md:w-48 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            <div className="flex animate-marquee-90 w-max space-x-2 px-2">
              {[...makes, ...makes, ...makes, ...makes].map((make: any, idx: number) => (
                <div key={`${make.id}-${idx}`} className="w-48 flex-shrink-0 bg-white transition-all duration-300 p-4 flex flex-col items-center justify-center h-40 group cursor-pointer relative overflow-hidden">
                  {make.image ? (
                    <img
                      src={getImageUrl(make.image)}
                      alt={make.name}
                      className="max-h-20 max-w-full object-contain opacity-100 group-hover:scale-105 transition-all duration-300"
                    />
                  ) : (
                    <span className="text-black text-xl font-black font-heading tracking-widest uppercase group-hover:text-primary transition-colors">{make.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. MIDDLE ACTION BANNER WITH LUXURY CAR IMAGE BACKDROP */}
      <section className="relative py-36 px-6 text-center overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 z-0">
          <img
            src={config.banner_image ? getImageUrl(config.banner_image) : '/car_banner.jpeg'}
            alt="Optum Car Care - Premium Automotive Detailing"
            className="w-full h-full object-cover object-center opacity-100 scale-105 hover:scale-100 transition-transform duration-[2000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black/30 to-[#0a0a0a]" />
        </div>


        <div className="relative z-10 max-w-4xl mx-auto">
          <ScrollReveal direction="up">
            <h2 className="text-3xl md:text-5xl font-heading font-black mb-6 uppercase tracking-tight text-white drop-shadow-md">
              {config.banner_cta_title}
            </h2>
            <p className="text-xl md:text-2xl text-primary font-black uppercase tracking-widest mb-10 drop-shadow">
              {config.banner_cta_subtitle}
            </p>
            <Link
              href="#contact-section"
              className="bg-primary text-black font-extrabold uppercase tracking-widest px-10 py-5 rounded-full hover:bg-white transition-all duration-300 inline-block text-xs shadow-2xl transform hover:scale-105 sheen-container"
            >
              Schedule a Vehicle Protection Analysis →
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. OUR PARTNERS & CERTIFIED INSTALLERS */}
      {partners.length > 0 && (
        <section className="bg-white text-black py-28 border-b border-gray-200 relative overflow-hidden">
          <div className="max-w-7xl mx-auto text-center px-6 md:px-12">
            <ScrollReveal direction="down">
              <span className="text-primary font-black tracking-widest uppercase text-xs mb-4 block">{config.partners_eyebrow || 'Our Partners & Certified Installers'}</span>
              <h2 className="text-3xl md:text-5xl font-heading font-black uppercase mb-8">{config.partners_title || 'Industry Standard Products'}</h2>
              <p className="text-gray-600 max-w-3xl mx-auto mb-16 leading-relaxed font-medium text-lg">
                {config.partners_description}
              </p>
            </ScrollReveal>
          </div>

          <div className="relative w-full overflow-hidden flex py-4">
            <div className="absolute top-0 left-0 w-24 md:w-48 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-24 md:w-48 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            <div className="flex animate-marquee w-max space-x-10 px-5 md:space-x-20 items-center">
              {[...partners, ...partners, ...partners, ...partners, ...partners].map((partner: any, idx: number) => (
                <div key={`${partner.id}-${idx}`} className="group cursor-pointer flex-shrink-0">
                  {partner.logo ? (
                    <img
                      src={getImageUrl(partner.logo)}
                      alt={partner.name}
                      className="h-12 md:h-16 w-auto object-contain opacity-100 group-hover:scale-105 transition-all duration-300"
                    />
                  ) : (
                    <span className="text-black transition-colors text-sm sm:text-lg font-black uppercase tracking-widest">
                      {partner.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. THE STANDARD SECTION */}
      <section className="bg-[#0a0a0a] text-white py-28 px-6 md:px-12 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <ScrollReveal direction="left" duration={1000}>
            <span className="text-primary font-black tracking-widest uppercase text-xs mb-4 block">{config.standard_eyebrow || 'The Standard'}</span>
            <h2 className="text-4xl md:text-5xl font-heading font-black mb-8 uppercase leading-tight text-white">
              {config.standard_title}
            </h2>
            <p className="text-white text-lg leading-relaxed mb-10 font-medium">
              {config.standard_description}
            </p>
            <ul className="space-y-6">
              {config.standard_items?.map((item: any, idx: number) => (
                <li key={idx} className="flex items-center gap-5 text-white font-bold uppercase tracking-wider text-sm">
                  <span className="text-primary text-xl bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0">✓</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal direction="right" duration={1000} className="relative h-[550px] w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#111] to-[#151515] border border-white/5 flex items-center justify-center shadow-2xl group sheen-container">
            {config.standard_image_before && config.standard_image_after ? (
              <ImageSplitter 
                beforeImage={getImageUrl(config.standard_image_before)} 
                afterImage={getImageUrl(config.standard_image_after)} 
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white font-black uppercase tracking-widest text-lg opacity-40">
                Technical Preparation Clean Room
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* 8. TESTIMONIALS (REVIEWS) */}
      {testimonials.length > 0 && (
        <section className="bg-black text-white py-28 px-6 md:px-12 border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-primary font-black tracking-widest uppercase text-sm mb-4 block">{config.testimonials_eyebrow || 'Reviews'}</span>
              <h2 className="text-4xl md:text-6xl font-heading font-black uppercase leading-none">{config.testimonials_title || 'What Our Customers Think'}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.slice(0, 4).map((t: any, idx: number) => (
                <ScrollReveal key={t.id} delay={idx * 100} direction="up" className="relative h-[320px]">
                  <div className="absolute inset-x-0 top-0 h-full hover:h-auto min-h-full bg-gradient-to-br from-[#111] to-yellow-500/5 hover:to-yellow-500/20 p-8 rounded-3xl border border-yellow-500/30 shadow-xl flex flex-col group z-10 hover:z-20 transition-all duration-300">
                    <p className="text-white italic text-sm leading-relaxed mb-6 line-clamp-4 group-hover:hidden whitespace-normal break-words">"{t.text}"</p>
                    <p className="text-white italic text-sm leading-relaxed mb-6 hidden group-hover:block whitespace-normal break-words">"{t.text}"</p>
                    <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-auto">
                      <div>
                        <h4 className="text-white font-extrabold text-[10px] uppercase tracking-wider">{t.author_name}</h4>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{t.date_posted}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <div className="text-yellow-400 text-xs">{"★".repeat(t.rating)}</div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. ABOUT US */}
      <section className="bg-[#0a0a0a] text-white py-28 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <ScrollReveal direction="left" duration={1000} className="grid grid-cols-2 gap-6 h-[550px] relative">
            <div className="bg-gradient-to-b from-[#111] to-[#080808] border border-white/5 rounded-3xl h-[85%] shadow-xl flex items-center justify-center overflow-hidden group">
              {config.about_image_1 ? (
                <img src={getImageUrl(config.about_image_1)} alt="About Us 1" className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-[2000ms]" />
              ) : (
                <span className="text-white text-xs font-black uppercase tracking-widest">Detailing Studio</span>
              )}
            </div>
            <div className="bg-gradient-to-b from-[#151515] to-[#111] border border-white/5 rounded-3xl h-[85%] mt-16 shadow-xl flex items-center justify-center overflow-hidden group">
              {config.about_image_2 ? (
                <img src={getImageUrl(config.about_image_2)} alt="About Us 2" className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-[2000ms]" />
              ) : (
                <span className="text-white text-xs font-black uppercase tracking-widest">Precision Wrap</span>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" duration={1000}>
            <span className="text-primary font-black tracking-widest uppercase text-sm mb-4 block">About Us</span>
            <h2 className="text-4xl md:text-5xl font-heading font-black mb-8 uppercase leading-tight text-white">
              {config.about_title}
            </h2>
            <p className="text-white text-lg leading-relaxed mb-8 font-medium">
              {config.about_description}
            </p>
            <ul className="space-y-4 mb-12">
              {config.about_features?.map((feat: any, idx: number) => (
                <li key={idx} className="flex items-center gap-4 font-black tracking-wider uppercase text-sm text-primary">
                  <span className="bg-primary text-black w-5 h-5 rounded-full flex items-center justify-center text-xs">✓</span>
                  {feat.text}
                </li>
              ))}
            </ul>
            <Link href="/process" className="border border-primary text-primary hover:bg-primary hover:text-black transition-all duration-300 px-10 py-5 uppercase font-black tracking-widest rounded-full text-xs inline-block">
              Learn More
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#111] text-white py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8 sm:gap-16 text-center">
          <ScrollReveal direction="up" delay={0}>
            <div className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black mb-3 text-primary tracking-tight">{config.stat_1_number}</div>
            <div className="text-white uppercase tracking-widest text-[10px] sm:text-xs font-bold">{config.stat_1_text}</div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={150}>
            <div className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black mb-3 text-primary tracking-tight">{config.stat_2_number}</div>
            <div className="text-white uppercase tracking-widest text-[10px] sm:text-xs font-bold">{config.stat_2_text}</div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={300}>
            <div className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black mb-3 text-primary tracking-tight">{config.stat_3_number}</div>
            <div className="text-white uppercase tracking-widest text-[10px] sm:text-xs font-bold">{config.stat_3_text}</div>
          </ScrollReveal>
        </div>
      </section>

      {/* 10. GENERAL FAQS */}
      {faqs.length > 0 && (
        <section className="bg-[#080808] text-white py-28 px-6 md:px-12 border-t border-white/5 relative">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal className="max-w-7xl mx-auto text-center mb-20">
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase mb-4">{config.faqs_eyebrow || 'Knowledge Base'}</h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black uppercase">{config.faqs_title || 'Frequently Asked Questions'}</h3>
            </ScrollReveal>

            <div className="space-y-4">
              {faqs.map((faq: any, idx: number) => (
                <ScrollReveal key={faq.id} delay={idx * 100} direction="up">
                  <div className="bg-[#111] hover:bg-[#151515] p-8 rounded-2xl border border-white/5 transition-all duration-300 group cursor-pointer shadow-md sheen-container">
                    <h3 className="text-lg font-black font-heading text-white group-hover:text-primary mb-3 uppercase tracking-wide transition-colors">{faq.question}</h3>
                    <p className="text-white text-sm leading-relaxed font-medium">{faq.answer}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 11. CONTACT FORM & LEAD CAPTURE SECTION */}
      <section id="contact-section" className="bg-black text-white py-28 px-6 md:px-12 border-t border-white/5 flex flex-col items-center relative overflow-hidden">
        {config.contact_image && (
          <div className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-100 pointer-events-none">
            <img src={getImageUrl(config.contact_image)} alt="Contact Background" className="w-full h-full object-cover object-left mask-image-gradient-l" />
          </div>
        )}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center w-full relative z-10">
          <ScrollReveal direction="left" duration={1000} className="flex-1 w-full text-left">
            <span className="text-primary font-black tracking-widest uppercase text-sm mb-4 block">Driven by Excellence</span>
            <h2 className="text-4xl sm:text-6xl font-heading font-black mb-8 leading-none uppercase text-white">
              What Happens<br />Next?
            </h2>
            <p className="text-white text-lg mb-10 leading-relaxed max-w-lg font-medium">
              Once you fill out the form, we will be in touch with you within one business day. At that time, we will schedule a time for you to bring your vehicle to the shop to go over protection options.
            </p>

            <div className="space-y-6 border-t border-white/5 pt-8 text-sm text-white">
              <p className="flex items-center gap-4 font-bold uppercase tracking-wider">
                <span className="text-primary text-lg bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">🏢</span>
                <span>Address: <span className="text-white font-medium normal-case ml-1">{config.address}</span></span>
              </p>
              <p className="flex items-center gap-4 font-bold uppercase tracking-wider">
                <span className="text-primary text-lg bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">📞</span>
                <span>Phone: <span className="text-white font-medium ml-1">{config.phone}</span></span>
              </p>
              <p className="flex items-center gap-4 font-bold uppercase tracking-wider">
                <span className="text-primary text-lg bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">⏰</span>
                <span>Mon - Sat: <span className="text-white font-medium normal-case ml-1">{config.working_hours_mon_fri}</span></span>
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" duration={1000} className="flex-1 w-full flex justify-center">
            <ContactForm services={services} />
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
