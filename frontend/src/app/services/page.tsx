import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

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

async function getServicesPageConfig() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/services/config/current/', { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

export default async function ServicesMainPage() {
  const [services, config] = await Promise.all([
    getServices(),
    getServicesPageConfig()
  ]);

  const heroTitle = config?.hero_title || "Premium Car Protection Services.";
  const heroDescription = config?.hero_description || "Discover our comprehensive range of high-end vehicle protection and detailing services designed to preserve your investment and elevate your driving experience.";

  // Premium loading / empty state
  if (!services || services.length === 0) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-heading font-black text-primary uppercase tracking-widest mb-3">Loading Atelier Services...</h2>
        <p className="text-gray-500 max-w-sm">Please verify the database is populated and active.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white pt-16 pb-28 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="down" className="mb-12">
          <Link href="/" className="text-primary text-xs font-black tracking-widest uppercase mb-8 inline-block hover:underline">
            ← Back to Home
          </Link>
          <h1 
            className="text-5xl md:text-7xl font-heading font-black mb-6 uppercase tracking-tight leading-none"
            dangerouslySetInnerHTML={{ __html: heroTitle.replace(/\n/g, '<br/>') }}
          />
          <p className="text-xl text-gray-400 max-w-3xl leading-relaxed font-medium whitespace-pre-line">
            {heroDescription}
          </p>
        </ScrollReveal>

        <div className="flex flex-col gap-32 mt-20">
          {services.map((service: any, idx: number) => (
            <ScrollReveal 
              key={service.id} 
              direction={idx % 2 === 0 ? 'left' : 'right'} 
              duration={1000}
              className={`flex flex-col md:flex-row gap-16 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-1 w-full h-[450px] rounded-3xl bg-gradient-to-br from-[#111] to-[#151515] border border-white/5 overflow-hidden relative shadow-2xl flex items-center justify-center group">
                 {/* Background image or video if available */}
                 {service.youtube_video_url && getYoutubeVideoId(service.youtube_video_url) ? (
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYoutubeVideoId(service.youtube_video_url)}?autoplay=1&mute=1&loop=1&playlist=${getYoutubeVideoId(service.youtube_video_url)}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                        className="absolute w-[300%] h-[300%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      ></iframe>
                    </div>
                 ) : service.hero_image ? (
                    <img 
                      src={getImageUrl(service.hero_image)} 
                      alt={service.title} 
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                    />
                 ) : (
                    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] group-hover:scale-105 transition-transform duration-700"></div>
                 )}
                 <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
                 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
                 <div className="absolute bottom-8 left-8 text-primary font-black uppercase tracking-widest text-xs opacity-80 group-hover:opacity-100 transition-opacity z-20">
                    {service.tag_line || "BESPOKE CRAFT"}
                 </div>
                 {!(service.hero_image || service.youtube_video_url) && (
                   <span className="text-gray-800 text-lg font-black uppercase tracking-widest relative z-10 select-none">
                     {service.title}
                   </span>
                 )}
              </div>
              
              <div className="flex-grow flex-1">
                <span className="text-primary font-black uppercase tracking-widest text-xs mb-3 block">Service {idx + 1}</span>
                <h2 className="text-4xl font-heading font-black mb-6 uppercase tracking-tight text-white">{service.title}</h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed font-medium">
                  {service.hero_description}
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {service.features?.map((feat: any, fidx: number) => (
                    <li key={fidx} className="flex items-center gap-4 text-gray-200 font-bold uppercase tracking-wider text-xs">
                      <span className="text-primary font-black">✓</span> {feat.title}
                    </li>
                  ))}
                </ul>
                <Link href={`/services/${service.slug}`} className="bg-primary text-black font-extrabold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white transition-colors inline-block text-xs">
                  View Details <span className="ml-1 font-sans text-sm">→</span>
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA SECTION */}
        <ScrollReveal direction="up" className="mt-36 bg-[#111] rounded-3xl p-16 text-center border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <h2 className="text-4xl md:text-5xl font-heading font-black mb-6 uppercase tracking-tight text-white">
            Book Your Vehicle <span className="text-primary">Protection Today</span>
          </h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg font-medium leading-relaxed">
            Ready to give your vehicle the ultimate protection? Contact us to schedule your service or request a custom quote.
          </p>
          <Link href="/contact" className="bg-primary text-black font-extrabold uppercase tracking-widest px-10 py-5 rounded-full hover:bg-white transition-colors inline-block text-xs shadow-lg">
            Schedule Consultation →
          </Link>
        </ScrollReveal>
      </div>
    </div>
  );
}
