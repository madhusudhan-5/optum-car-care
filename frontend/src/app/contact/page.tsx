import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us | Optum Car Care — Premium Automotive Detailing Bengaluru',
  description: 'Contact Optum Car Care in Bengaluru for premium car detailing, paint protection film, ceramic coating, and more. Book your appointment today.',
  keywords: 'car detailing contact Bengaluru, appointment booking, paint protection film, ceramic coating',
};

async function getHomeConfig() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content/home-config/current/', { next: { revalidate: 30 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (Object.keys(data).length === 0) return null;
    return data;
  } catch (e) {
    return null;
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

// Google Maps embed URL for the Bengaluru address
const MAPS_EMBED = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.2786!2d77.6219!3d12.8985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s726+9th+Main+Hongasandra+GB+Palya+Rd+Singasandra+Bengaluru+560068!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin`;

export default async function ContactPage() {
  const config = await getHomeConfig();
  const services = await getServices();

  const address = config?.address || '726, 9th Main Hongasandra GB Palya Rd, B Block, AECS Layout, Singasandra, Bengaluru, Karnataka 560068';
  const phone = config?.phone || '096328 04024';
  const email = config?.email || 'info@optumcarcare.com';
  const monFri = config?.working_hours_mon_fri || '10:00 AM to 6:00 PM (Appointment Only)';
  const sat = config?.working_hours_sat || '11:00 AM to 2:00 PM (Appointment Only)';
  const sun = config?.working_hours_sun || 'Closed';

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 border-b border-white/5 bg-gradient-to-b from-[#111] to-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal direction="down">
            <Link href="/" className="text-primary text-xs font-black tracking-widest uppercase mb-6 inline-block hover:underline">← Back to Home</Link>
            <span className="text-primary font-black tracking-widest uppercase text-xs mb-4 block">Get In Touch</span>
            <h1 className="text-5xl md:text-8xl font-heading font-black mb-6 uppercase leading-none">
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed font-medium">
              Ready to protect your vehicle? Book an appointment or reach out directly — our specialists are standing by.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── INFO + FORM ── */}
      <section id="appointment-form" className="py-24 px-6 md:px-12 scroll-mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — Business Info */}
          <ScrollReveal direction="left" duration={1000}>
            <div className="space-y-8">
              <div>
                <span className="text-primary font-black tracking-widest uppercase text-xs mb-3 block">What Happens Next?</span>
                <h2 className="text-4xl md:text-5xl font-heading font-black mb-4 uppercase leading-tight text-white">
                  Ready to Protect<br />Your Investment?
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed font-medium">
                  Once you fill out the form, we'll be in touch within one business day. We'll schedule a time to bring your vehicle in to go over the best protection options.
                </p>
              </div>

              {/* Contact details */}
              <div className="space-y-4 bg-[#111] p-8 rounded-2xl border border-white/5">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4">Business Information</h3>

                <div className="flex items-start gap-4">
                  <div className="text-primary text-xl bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">📍</div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Address</p>
                    <p className="text-gray-200 text-sm font-medium leading-relaxed">{address}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline mt-1 inline-block"
                    >
                      Get Directions →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-primary text-xl bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">📞</div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Phone</p>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-gray-200 text-sm font-bold hover:text-primary transition-colors">{phone}</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-primary text-xl bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">✉️</div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Email</p>
                    <a href={`mailto:${email}`} className="text-primary text-sm font-bold hover:underline">{email}</a>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 mt-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Business Hours</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-xs">Mon – Fri</span>
                      <span className="text-gray-200 font-medium text-right text-xs">{monFri}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-xs">Saturday</span>
                      <span className="text-gray-200 font-medium text-right text-xs">{sat}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-xs">Sunday</span>
                      <span className="text-gray-200 font-medium text-right text-xs">{sun}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review badge */}
              <div className="flex items-center gap-4 bg-[#111] p-5 rounded-2xl border border-white/5">
                <div className="text-yellow-400 text-2xl">★★★★★</div>
                <div>
                  <p className="text-white font-black text-sm uppercase tracking-widest">5.0 · 205 Google Reviews</p>
                  <p className="text-gray-500 text-xs font-medium mt-0.5">Trusted by customers across Bengaluru</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right — Appointment Form */}
          <ScrollReveal direction="right" duration={1000} className="flex justify-center lg:justify-end">
            <ContactForm services={services} />
          </ScrollReveal>
        </div>
      </section>

      {/* ── GOOGLE MAPS ── */}
      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-primary font-black tracking-widest uppercase text-xs">Our Location</span>
              <div className="flex-1 h-px bg-white/5" />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                Open in Google Maps →
              </a>
            </div>
            <div className="rounded-3xl overflow-hidden border border-white/5 shadow-2xl" style={{ height: '420px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.434655509474!2d77.6367293751327!3d12.879748787427184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15d0e6971df1%3A0x84f2bcfd4a92ed38!2sOptum%20Car%20Care%20-%20Car%20PPF!5e0!3m2!1sen!2sin!4v1780398535965!5m2!1sen!2sin"
                width="100%"
                height="420"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Optum Car Care Location — Bengaluru"
              />
            </div>
            <p className="text-gray-600 text-xs mt-3 font-medium text-center">
              726, 9th Main Hongasandra GB Palya Rd, B Block, AECS Layout, Singasandra, Bengaluru, Karnataka 560068
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── SERVICES QUICK LINKS ── */}
      {services.length > 0 && (
        <section className="bg-[#111] py-16 px-6 md:px-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-8 text-center">Our Services</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {services.map((service: any) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="bg-[#0a0a0a] hover:bg-black border border-white/5 hover:border-primary/30 p-5 rounded-2xl text-center group transition-all duration-300"
                  >
                    <p className="text-white font-black uppercase tracking-wide text-xs group-hover:text-primary transition-colors">{service.title}</p>
                    <p className="text-gray-600 text-[10px] mt-1 font-bold uppercase tracking-widest group-hover:text-gray-400 transition-colors">View Details →</p>
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}
    </div>
  );
}
