import React from "react";
import Link from "next/link";
import { 
  PlayCircle, XCircle, CheckCircle, Car, ClipboardCheck, 
  Droplets, SprayCan, Sparkles, Search, Shield, Wrench, Camera
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal"; // Assuming this exists from previous Next.js setups

async function getProcessSteps() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content/process/', { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

async function getProcessPageConfig() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content/process-config/current/', { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

// Map a set of dynamic icons based on the step index
const timelineIcons = [
  Car, ClipboardCheck, Droplets, SprayCan, Sparkles, Search, Shield, Wrench, Camera
];

export const metadata = {
  title: "Our Process | Optum Car Care",
  description: "The best automotive spa experience at Optum Studio.",
};

export default async function ProcessPage() {
  const [steps, config] = await Promise.all([
    getProcessSteps(),
    getProcessPageConfig()
  ]);
  
  const sortedSteps = [...steps].sort((a: any, b: any) => a.order - b.order);

  // Fallback defaults if config is not available
  const heroTitle = config?.hero_title || "The best automotive spa experience at Optum Studio";
  const heroDescription = config?.hero_description || "Optum Studio offers the highest level of detail and protection in Bengaluru. Our meticulous process ensures your vehicle receives the ultimate care, leaving it looking better than the day it left the showroom floor.";
  const heroVideoUrl = config?.hero_video_url || "https://cdn.pixabay.com/video/2021/08/04/83866-584733364_large.mp4";
  const heroImage = config?.hero_image;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-primary/30 font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 border-b border-white/5 overflow-hidden">
        {heroImage && (
          <>
            <div className="absolute inset-0 z-0">
              <img src={heroImage} alt="Process Hero Background" className="w-full h-full object-cover opacity-30" />
            </div>
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]"></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
          </>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <Link href="/" className="inline-flex text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest items-center gap-2 mb-8 sm:mb-12 transition-colors">
            <span className="text-primary">←</span> Back to Home
          </Link>

        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-start">
          <ScrollReveal>
            <span className="text-primary text-[10px] font-black tracking-[0.2em] uppercase mb-4 block">Optum Studio</span>
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-[1.1] uppercase break-words"
              dangerouslySetInnerHTML={{ __html: heroTitle.replace(/\n/g, '<br/>') }}
            />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200} className="lg:mt-8">
            <p className="text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-8 max-w-lg font-medium whitespace-pre-line">
              {heroDescription}
            </p>
            {heroVideoUrl && (
              <a 
                href={heroVideoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 px-5 sm:px-6 py-3 sm:py-4 rounded-xl transition-all group w-full sm:w-auto"
              >
                <PlayCircle className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500 group-hover:scale-110 transition-transform shrink-0" />
                <div className="text-left">
                  <span className="block text-white font-bold text-sm">Watch Video</span>
                  <span className="block text-gray-500 text-xs">See our process in action</span>
                </div>
              </a>
            )}
          </ScrollReveal>
        </div>
        </div>
      </section>


      {/* --- VEHICLE JOURNEY TIMELINE --- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32 relative">
        <ScrollReveal>
          <div className="text-center mb-12 sm:mb-20 lg:mb-24">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black uppercase mb-4">Vehicle Journey</h2>
            <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">All times are approximate</p>
            <p className="text-gray-600 text-xs mt-2 max-w-xl mx-auto">
              Please note that every vehicle is unique. Based on the condition, paint type, and selected services, the time required may vary slightly to ensure perfection.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Left line for mobile, center line for desktop */}
          <div className="absolute left-4 sm:left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent md:-translate-x-1/2"></div>

          <div className="space-y-10 sm:space-y-16 md:space-y-24 lg:space-y-32">
            {sortedSteps.map((step: any, index: number) => {
              const IconComponent = timelineIcons[index % timelineIcons.length];
              const isEven = index % 2 === 0;

              return (
                <ScrollReveal key={step.id} direction={isEven ? "left" : "right"} duration={800}>
                  {/* Mobile layout: single column with left timeline */}
                  <div className="flex md:hidden items-start gap-4 sm:gap-6 pl-10 sm:pl-16">
                    {/* Mobile icon node */}
                    <div className="absolute left-0 sm:left-1 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-xl">
                      <IconComponent className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-blue-500 font-black tracking-widest text-[10px] uppercase mb-2">
                        Step {step.order < 10 ? `0${step.order}` : step.order}
                      </div>
                      <div className="bg-[#111] border border-white/5 rounded-xl p-5 sm:p-6 hover:bg-[#151515] hover:border-white/10 transition-all duration-300">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight">{step.title}</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">{step.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop layout: alternating left/right */}
                  <div className={`hidden md:flex relative flex-row items-center ${isEven ? 'flex-row-reverse' : ''}`}>
                    {/* Center Icon Node */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center z-10 shadow-2xl">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#111] flex items-center justify-center border border-white/5">
                        <IconComponent className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" />
                      </div>
                    </div>
                    {/* Step Number Badge */}
                    <div className={`absolute top-1/2 -translate-y-1/2 ${isEven ? 'right-[55%]' : 'left-[55%]'} text-blue-500 font-black tracking-widest text-xs uppercase opacity-80`}>
                      Step {step.order < 10 ? `0${step.order}` : step.order}
                    </div>
                    {/* Content Card */}
                    <div className={`w-[45%] ${isEven ? 'pr-12 lg:pr-24' : 'pl-12 lg:pl-24'}`}>
                      <div className="bg-[#111] border border-white/5 rounded-2xl p-6 lg:p-8 hover:bg-[#151515] hover:border-white/10 transition-all duration-300 relative group">
                        <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 tracking-tight">{step.title}</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">{step.description}</p>
                        <div className={`absolute top-0 bottom-0 w-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${isEven ? 'right-0' : 'left-0'}`}></div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>


    </main>
  );
}
