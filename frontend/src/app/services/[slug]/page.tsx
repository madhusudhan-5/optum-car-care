import type { Metadata } from 'next';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

async function getServiceDetails(slug: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/services/${slug}/`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const service = await getServiceDetails(resolvedParams.slug);
  return {
    title: service?.meta_title || `${service?.title || 'Service'} | Optum Car Care`,
    description: service?.meta_description || service?.hero_description || "Premium auto detailing and paint protection film.",
    keywords: service?.meta_keywords || `${service?.title || 'detailing'}, paint protection, car care`,
  };
}

// Helper to get full image URL
const getImageUrl = (path: string | undefined | null) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return `http://127.0.0.1:8000${path}`;
  return `http://127.0.0.1:8000/media/${path}`;
};

export default async function ServiceSinglePage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const service = await getServiceDetails(resolvedParams.slug);

  // If the service doesn't exist, render a beautiful 404/not found state
  if (!service) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-heading font-black text-primary uppercase tracking-widest mb-4">Service Not Found</h2>
        <p className="text-gray-500 max-w-sm mb-8 font-medium">We couldn't find the service you were looking for. It may have been renamed or relocated.</p>
        <Link href="/services" className="bg-primary text-black font-extrabold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white transition-colors text-xs shadow-lg">
          ← View All Services
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white pb-24 relative overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-36 pb-28 px-6 md:px-12 border-b border-white/5 bg-gradient-to-b from-[#111] to-[#0a0a0a] overflow-hidden min-h-[650px] flex items-center justify-center">
         {service.hero_image && (
           <div className="absolute inset-0 z-0">
             <img src={getImageUrl(service.hero_image)} alt={service.title} className="w-full h-full object-cover opacity-30 scale-105 animate-pulse-slow" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/60 to-transparent" />
           </div>
         )}
         <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] z-0"></div>
         
         <div className="relative z-20 max-w-7xl mx-auto w-full">
            <ScrollReveal direction="down">
              <Link href="/services" className="text-primary text-xs font-black tracking-widest uppercase mb-6 inline-block hover:underline">
                ← Back to Services
              </Link>
              <div className="text-primary font-black tracking-widest uppercase text-xs mb-4">
                {service.tag_line || "CRAFT DETAIL"}
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={150} direction="left">
              <h1 className="text-5xl md:text-8xl font-heading font-black mb-6 max-w-4xl leading-none uppercase text-white drop-shadow-lg">
                {service.title}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={300} direction="left">
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-12 leading-relaxed font-medium drop-shadow">
                {service.hero_description}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={450} direction="up" className="flex flex-col sm:flex-row gap-4">
               <Link href="/contact#appointment-form" className="bg-primary text-black font-extrabold uppercase tracking-widest px-10 py-5 rounded-full hover:bg-white transition-all transform hover:scale-105 text-center text-xs shadow-lg sheen-container">
                  Configure Protection
               </Link>
               <button className="border border-primary text-primary font-extrabold uppercase tracking-widest px-10 py-5 rounded-full hover:bg-primary hover:text-black transition-colors text-center text-xs backdrop-blur-sm bg-black/20">
                  Watch Process
               </button>
            </ScrollReveal>
         </div>
      </section>

      {/* CRAFT MANIFESTO */}
      {service.manifesto_title && (
        <section className="py-28 px-6 md:px-12 text-center bg-white text-black relative">
          <ScrollReveal direction="up" className="max-w-4xl mx-auto">
            <span className="text-primary font-black tracking-widest uppercase text-xs mb-4 block">CRAFT MANIFESTO</span>
            <h2 className="text-4xl md:text-6xl font-heading font-black mb-6 uppercase tracking-tight">{service.manifesto_title}</h2>
            <p className="text-gray-600 text-lg mb-16 font-medium leading-relaxed max-w-2xl mx-auto">{service.manifesto_description}</p>
          </ScrollReveal>

          <ScrollReveal delay={200} direction="up" className="max-w-5xl mx-auto h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-2xl group cursor-pointer">
             {service.manifesto_media ? (
               <img src={getImageUrl(service.manifesto_media)} alt={service.manifesto_title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
             ) : (
               <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]"></div>
             )}
             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
             <div className="w-20 h-20 rounded-full border-2 border-primary bg-white flex items-center justify-center text-primary text-xl z-10 hover:scale-110 active:scale-95 transition-transform shadow-xl">
               ▶
             </div>
             <div className="absolute bottom-6 left-6 text-white font-black uppercase tracking-widest text-[10px] drop-shadow-md">
               Micro-Precision Application Documentary
             </div>
          </ScrollReveal>
        </section>
      )}

      {/* TECHNICAL SUPERIORITY (FEATURES) */}
      {service.features && service.features.length > 0 && (
        <section className="bg-[#111] py-28 px-6 md:px-12 border-y border-white/5 relative">
          <div className="max-w-7xl mx-auto">
             <ScrollReveal direction="down" className="mb-20">
               <span className="text-primary font-black tracking-widest uppercase text-xs mb-4 block">TECHNICAL SUPERIORITY</span>
               <h2 className="text-4xl md:text-5xl font-heading font-black uppercase">Engineered Specifications</h2>
             </ScrollReveal>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {service.features.map((feat: any, idx: number) => (
                   <ScrollReveal key={feat.id} delay={idx * 150} direction="up" className="h-full">
                      <div className="bg-black p-10 rounded-3xl border border-white/5 h-full hover:border-primary/20 transition-all duration-300 shadow-xl flex flex-col justify-stretch">
                         <div className="text-primary text-3xl mb-8 font-serif font-black select-none">0{idx + 1}</div>
                         <h3 className="text-xl font-heading font-black mb-4 uppercase tracking-wide text-white">{feat.title}</h3>
                         <p className="text-gray-400 leading-relaxed font-medium">{feat.description}</p>
                      </div>
                   </ScrollReveal>
                ))}
             </div>
          </div>
        </section>
      )}

      {/* BEFORE & AFTER */}
      {service.before_afters && service.before_afters.length > 0 && (
        <section className="bg-gray-50 py-28 px-6 md:px-12 text-black text-center relative border-b border-gray-200">
           <ScrollReveal direction="up" className="max-w-3xl mx-auto mb-20">
              <span className="text-primary font-black tracking-widest uppercase text-xs mb-4 block">THE TRANSFORMATION</span>
              <h2 className="text-4xl md:text-6xl font-heading font-black mb-6 uppercase tracking-tight">Before & After Results</h2>
              <p className="text-gray-600 font-medium text-lg leading-relaxed">Slide to see the dramatic difference our premium detailing and protection services make.</p>
           </ScrollReveal>

           <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
               {service.before_afters.map((ba: any, idx: number) => (
                  <ScrollReveal key={ba.id} delay={idx * 200} direction="up">
                    <BeforeAfterSlider 
                      title={ba.title} 
                      beforeImage={getImageUrl(ba.before_image)} 
                      afterImage={getImageUrl(ba.after_image)} 
                    />
                  </ScrollReveal>
               ))}
           </div>
        </section>
      )}

      {/* FREQUENTLY ASKED */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-28 px-6 md:px-12 bg-[#0a0a0a]">
           <ScrollReveal direction="down" className="max-w-4xl mx-auto text-center mb-20">
              <span className="text-primary font-black tracking-widest uppercase text-xs mb-4 block">KNOWLEDGE BASE</span>
              <h2 className="text-4xl md:text-6xl font-heading font-black uppercase">FAQ</h2>
           </ScrollReveal>
           
           <div className="max-w-4xl mx-auto space-y-6">
              {service.faqs.map((faq: any, idx: number) => (
                 <ScrollReveal key={faq.id} delay={idx * 100} direction="up">
                    <div className="bg-[#111] hover:bg-[#151515] p-8 rounded-2xl border border-white/5 transition-all duration-300 shadow-lg group">
                       <h3 className="text-lg font-black font-heading mb-4 uppercase tracking-wide text-white group-hover:text-primary transition-colors">{faq.question}</h3>
                       <p className="text-gray-400 leading-relaxed font-medium">{faq.answer}</p>
                    </div>
                 </ScrollReveal>
              ))}
           </div>
        </section>
      )}

      {/* DRIVEN BY EXCELLENCE */}
      <section className="py-28 px-6 md:px-12 bg-[#111] border-y border-white/5 relative">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center">
            <ScrollReveal direction="left" duration={1000} className="flex-1 w-full h-[500px] bg-gradient-to-br from-[#151515] to-[#0d0d0d] border border-white/5 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-2xl group">
               {service.standards_image ? (
                 <img src={getImageUrl(service.standards_image)} alt="Excellence Standards" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[1500ms]" />
               ) : (
                 <>
                   <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                   <span className="text-gray-800 text-sm font-black uppercase tracking-widest select-none relative z-10">Installation Phase</span>
                 </>
               )}
            </ScrollReveal>
            
            <ScrollReveal direction="right" duration={1000} className="flex-1">
               <span className="text-primary font-black tracking-widest uppercase text-sm mb-4 block">DRIVEN BY EXCELLENCE</span>
               <h2 className="text-4xl md:text-5xl font-heading font-black mb-8 max-w-lg leading-tight uppercase text-white">
                  {service.standards_title}
               </h2>
               <p className="text-gray-400 text-lg mb-10 leading-relaxed font-medium">
                  {service.standards_description}
               </p>
               <ul className="space-y-4">
                  {service.standard_items?.map((item: any, idx: number) => (
                     <li key={idx} className="flex items-center gap-4 text-white font-bold uppercase tracking-wider text-xs">
                        <span className="text-primary w-6 h-6 rounded-full border border-primary/50 bg-primary/5 flex items-center justify-center text-[10px] font-sans">✓</span>
                        {item.text}
                     </li>
                  ))}
               </ul>
            </ScrollReveal>
         </div>
      </section>

      {/* CTA */}
      <section className="py-36 px-6 text-center bg-[#0a0a0a] relative">
         <ScrollReveal direction="up" className="max-w-4xl mx-auto">
           <h2 className="text-5xl md:text-8xl font-heading font-black mb-12 uppercase leading-none text-white tracking-tight">
              READY TO SECURE<br/>YOUR INVESTMENT?
           </h2>
           <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link href={service.cta_link} className="bg-primary text-black font-extrabold uppercase tracking-widest px-12 py-5 hover:bg-white transition-colors text-xs shadow-lg rounded-full">
                 {service.cta_text}
              </Link>
              <Link href="/contact" className="text-white border-b border-white hover:text-primary hover:border-primary font-extrabold uppercase tracking-widest px-6 py-4 transition-colors text-xs flex items-center gap-3">
                 CONTACT THE ATELIER <span className="font-sans text-base">→</span>
              </Link>
           </div>
         </ScrollReveal>
      </section>
    </div>
  );
}
