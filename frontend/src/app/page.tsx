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
        <p className="text-gray-400 max-w-md">Please ensure the backend server is running and the database has been populated.</p>
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
              className="w-full h-full object-cover object-center opacity-40 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-black/50 to-[#0a0a0a]" />
          </div>
        )}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] z-0"></div>

        <ScrollReveal direction="down" duration={1000} className="w-full max-w-5xl relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-black mb-6 tracking-tight leading-none uppercase animate-fade-in-up drop-shadow-xl break-words">
            {config.hero_title}
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={200} duration={1000} className="w-full max-w-3xl">
          <p className="text-xl md:text-2xl text-gray-400 mb-10 font-medium leading-relaxed">
            {config.hero_subtitle}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={400} duration={1000} className="flex flex-col items-center gap-6">
          <p className="font-extrabold text-base sm:text-lg uppercase tracking-wider text-center">
            <span className="text-primary text-2xl sm:text-3xl font-black">{config.vehicles_protected}</span> vehicles protected and counting.
          </p>
          <Link
            href="#contact-section"
            className="bg-primary text-black font-extrabold uppercase tracking-widest px-6 sm:px-10 py-4 sm:py-5 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg text-[10px] sm:text-xs sheen-container animate-glow-pulse text-center"
          >
            Schedule a Vehicle Protection Analysis →
          </Link>
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 font-bold uppercase tracking-wider">
            <span className="text-yellow-400 text-base">★★★★★</span>
            5.0 STARS, 205 Google REVIEWS
          </div>
        </ScrollReveal>
      </section>

      {/* 2. SERVICES GRID */}
      {services.length > 0 && (
        <section className="bg-[#0a0a0a] pb-28 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {services.slice(0, 4).map((service: any, idx: number) => (
              <ScrollReveal key={service.id} delay={idx * 150} direction="up" className="h-full">
                <Link
                  href={`/services/${service.slug}`}
                  className="group relative h-96 overflow-hidden rounded-3xl bg-[#111] border border-white/5 flex flex-col justify-end p-8 shadow-md hover:shadow-2xl hover:border-primary/30 transition-all duration-500 block sheen-container"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10 opacity-90 group-hover:opacity-95 transition-opacity" />
                  
                  {service.youtube_video_url && getYoutubeVideoId(service.youtube_video_url) ? (
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYoutubeVideoId(service.youtube_video_url)}?autoplay=1&mute=1&loop=1&playlist=${getYoutubeVideoId(service.youtube_video_url)}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                        className="absolute w-[300%] h-[300%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : service.hero_image ? (
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                      <img 
                        src={getImageUrl(service.hero_image)} 
                        alt={service.title} 
                        className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-all duration-700 group-hover:scale-105" 
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] transition-transform duration-700 group-hover:scale-110 z-0"></div>
                  )}

                  <div className="relative z-20 transition-transform duration-300 group-hover:-translate-y-1">
                    <span className="text-primary font-black uppercase tracking-widest text-xs mb-2 block">{service.tag_line}</span>
                    <h3 className="text-white text-2xl font-black font-heading mb-4 uppercase leading-tight group-hover:text-primary transition-colors">{service.title}</h3>
                    <div className="flex items-center text-primary text-xs font-extrabold uppercase tracking-widest group-hover:translate-x-3 transition-transform duration-300">
                      View Service <span className="ml-2 font-sans text-sm">→</span>
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
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center">
          <ScrollReveal direction="left" duration={1000} className="flex-1">
            <span className="text-primary font-black tracking-widest uppercase text-xs mb-4 block">You Want the Best for What Matters</span>
            <h2 className="text-4xl md:text-5xl font-heading font-black mb-8 uppercase leading-none text-white">
              {config.intro_title}
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 font-medium">
              {config.intro_description}
            </p>

            <div className="border-t border-white/5 pt-8 mt-8">
              <h3 className="text-lg font-black font-heading text-red-500 uppercase tracking-wide mb-6">
                {config.pain_points_title}
              </h3>
              <ul className="space-y-4">
                {config.pain_points?.map((pp: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-4 text-gray-300">
                    <span className="text-red-500 font-black text-sm bg-red-500/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0">✗</span>
                    <span className="text-sm font-semibold leading-relaxed">{pp.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" duration={1000} className="flex-1 rounded-3xl bg-gradient-to-br from-[#151515] to-[#0d0d0d] h-[480px] w-full border border-white/5 relative overflow-hidden flex items-center justify-center shadow-2xl group">
            {config.intro_image ? (
              <img
                src={getImageUrl(config.intro_image)}
                alt="Technical Diagnostics"
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-[1500ms]"
              />
            ) : (
              <>
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                <span className="text-gray-500 text-sm font-black uppercase tracking-widest relative z-10 select-none">Technical Diagnostics</span>
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. SPECIALISTS IN EV'S & CURATED MAKES */}
      {makes.length > 0 && (
        <section className="bg-black text-white py-28 px-6 md:px-12 border-t border-white/5 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-primary font-black tracking-widest uppercase text-xs mb-4 block">Specialists in EV's & Exotics</span>
              <h2 className="text-4xl md:text-6xl font-heading font-black uppercase leading-none">Services Curated by Makes</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {makes.map((make: any, idx: number) => (
                <ScrollReveal key={make.id} delay={idx * 100} direction="up">
                  <div className="bg-[#111] hover:bg-[#151515] hover:border-primary/30 transition-all duration-300 p-8 rounded-2xl border border-white/5 flex flex-col items-center justify-center h-40 group cursor-pointer shadow-lg relative overflow-hidden sheen-container">
                    {make.image ? (
                      <img
                        src={getImageUrl(make.image)}
                        alt={make.name}
                        className="max-h-20 max-w-full object-contain filter invert brightness-0 opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                      />
                    ) : (
                      <span className="text-white text-xl font-black font-heading tracking-widest uppercase group-hover:text-primary transition-colors">{make.name}</span>
                    )}
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </ScrollReveal>
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
            className="w-full h-full object-cover object-center opacity-40 scale-105 hover:scale-100 transition-transform duration-[2000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black/75 to-[#0a0a0a]" />
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
        <section className="bg-[#080808] py-28 px-6 md:px-12 border-b border-white/5 text-white">
          <div className="max-w-7xl mx-auto text-center">
            <ScrollReveal direction="down">
              <span className="text-primary font-black tracking-widest uppercase text-xs mb-4 block">Our Partners & Certified Installers</span>
              <h2 className="text-3xl md:text-5xl font-heading font-black uppercase mb-8">Industry Standard Products</h2>
              <p className="text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed font-medium text-lg">
                {config.partners_description}
              </p>

              <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
                {partners.map((partner: any) => (
                  <div key={partner.id} className="group cursor-pointer">
                    {partner.logo ? (
                      <img
                        src={getImageUrl(partner.logo)}
                        alt={partner.name}
                        className="h-10 w-auto object-contain filter brightness-0 invert opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                      />
                    ) : (
                      <span className="text-gray-400 hover:text-white transition-colors text-sm sm:text-lg font-black uppercase tracking-widest">
                        {partner.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 7. THE STANDARD SECTION */}
      <section className="bg-[#0a0a0a] text-white py-28 px-6 md:px-12 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <ScrollReveal direction="left" duration={1000}>
            <span className="text-primary font-black tracking-widest uppercase text-xs mb-4 block">THE STANDARD</span>
            <h2 className="text-4xl md:text-6xl font-heading font-black mb-8 uppercase leading-none text-white">
              {config.standard_title}
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-10 font-medium">
              {config.standard_description}
            </p>
            <ul className="space-y-6">
              {config.standard_items?.map((item: any, idx: number) => (
                <li key={idx} className="flex items-center gap-5 text-gray-300 font-bold uppercase tracking-wider text-sm">
                  <span className="text-primary text-xl bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0">✓</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal direction="right" duration={1000} className="relative h-[550px] w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#111] to-[#151515] border border-white/5 flex items-center justify-center shadow-2xl group sheen-container">
            {config.standard_image ? (
              <ImageSplitter imageUrl={getImageUrl(config.standard_image)} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-black uppercase tracking-widest text-lg opacity-40">
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
              <span className="text-primary font-black tracking-widest uppercase text-sm mb-4 block">Reviews</span>
              <h2 className="text-4xl md:text-6xl font-heading font-black uppercase leading-none">What Our Customers Think</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((t: any, idx: number) => (
                <ScrollReveal key={t.id} delay={idx * 200} direction="up" className="h-full">
                  <div className="bg-[#111] p-10 rounded-3xl border border-white/5 shadow-xl flex flex-col justify-between h-full hover:border-primary/20 transition-all duration-300 sheen-container">
                    <p className="text-gray-300 italic text-lg leading-relaxed mb-8">"{t.text}"</p>
                    <div className="flex justify-between items-center border-t border-white/5 pt-6 mt-auto">
                      <div>
                        <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">{t.author_name}</h4>
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t.date_posted}</span>
                      </div>
                      <div className="text-yellow-400 text-sm">{"★".repeat(t.rating)}</div>
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
                <img src={getImageUrl(config.about_image_1)} alt="About Us 1" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2000ms]" />
              ) : (
                <span className="text-gray-700 text-xs font-black uppercase tracking-widest">Detailing Studio</span>
              )}
            </div>
            <div className="bg-gradient-to-b from-[#151515] to-[#111] border border-white/5 rounded-3xl h-[85%] mt-16 shadow-xl flex items-center justify-center overflow-hidden group">
              {config.about_image_2 ? (
                <img src={getImageUrl(config.about_image_2)} alt="About Us 2" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2000ms]" />
              ) : (
                <span className="text-gray-700 text-xs font-black uppercase tracking-widest">Precision Wrap</span>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" duration={1000}>
            <span className="text-primary font-black tracking-widest uppercase text-sm mb-4 block">About Us</span>
            <h2 className="text-4xl md:text-5xl font-heading font-black mb-8 uppercase leading-tight text-white">
              {config.about_title}
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 font-medium">
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
            <Link href="/about" className="border border-primary text-primary hover:bg-primary hover:text-black transition-all duration-300 px-10 py-5 uppercase font-black tracking-widest rounded-full text-xs inline-block">
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
            <div className="text-gray-400 uppercase tracking-widest text-[10px] sm:text-xs font-bold">{config.stat_1_text}</div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={150}>
            <div className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black mb-3 text-primary tracking-tight">{config.stat_2_number}</div>
            <div className="text-gray-400 uppercase tracking-widest text-[10px] sm:text-xs font-bold">{config.stat_2_text}</div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={300}>
            <div className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black mb-3 text-primary tracking-tight">{config.stat_3_number}</div>
            <div className="text-gray-400 uppercase tracking-widest text-[10px] sm:text-xs font-bold">{config.stat_3_text}</div>
          </ScrollReveal>
        </div>
      </section>

      {/* 10. GENERAL FAQS */}
      {faqs.length > 0 && (
        <section className="bg-[#080808] text-white py-28 px-6 md:px-12 border-t border-white/5 relative">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-primary font-black tracking-widest uppercase text-sm mb-4 block">Knowledge Base</span>
              <h2 className="text-4xl md:text-6xl font-heading font-black uppercase leading-none">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq: any, idx: number) => (
                <ScrollReveal key={faq.id} delay={idx * 100} direction="up">
                  <div className="bg-[#111] hover:bg-[#151515] p-8 rounded-2xl border border-white/5 transition-all duration-300 group cursor-pointer shadow-md sheen-container">
                    <h3 className="text-lg font-black font-heading text-white group-hover:text-primary mb-3 uppercase tracking-wide transition-colors">{faq.question}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed font-medium">{faq.answer}</p>
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
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <img src={getImageUrl(config.contact_image)} alt="Contact Background" className="w-full h-full object-cover object-left mask-image-gradient-l" />
          </div>
        )}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center w-full relative z-10">
          <ScrollReveal direction="left" duration={1000} className="flex-1 w-full text-left">
            <span className="text-primary font-black tracking-widest uppercase text-sm mb-4 block">Driven by Excellence</span>
            <h2 className="text-4xl sm:text-6xl font-heading font-black mb-8 leading-none uppercase text-white">
              What Happens<br />Next?
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-lg font-medium">
              Once you fill out the form, we will be in touch with you within one business day. At that time, we will schedule a time for you to bring your vehicle to the shop to go over protection options.
            </p>

            <div className="space-y-6 border-t border-white/5 pt-8 text-sm text-gray-300">
              <p className="flex items-center gap-4 font-bold uppercase tracking-wider">
                <span className="text-primary text-lg bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">🏢</span>
                <span>Address: <span className="text-gray-400 font-medium normal-case ml-1">{config.address}</span></span>
              </p>
              <p className="flex items-center gap-4 font-bold uppercase tracking-wider">
                <span className="text-primary text-lg bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">📞</span>
                <span>Phone: <span className="text-gray-400 font-medium ml-1">{config.phone}</span></span>
              </p>
              <p className="flex items-center gap-4 font-bold uppercase tracking-wider">
                <span className="text-primary text-lg bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">⏰</span>
                <span>Mon - Fri: <span className="text-gray-400 font-medium normal-case ml-1">{config.working_hours_mon_fri}</span></span>
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
