import Link from 'next/link';

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

export default async function Footer() {
  const config = await getHomeConfig() || {
    address: "726, 9th Main Hongasandra GB Palya Rd, B Block, AECS Layout, Singasandra, Bengaluru, Karnataka 560068",
    phone: "096328 04024",
    email: "info@optumcarcare.com",
    working_hours_mon_fri: "10:00 AM to 6:00 PM (Appointment Only)",
    working_hours_sat: "11:00 AM to 2:00 PM (Appointment Only)",
    working_hours_sun: "Closed"
  };

  return (
    <footer className="w-full bg-[#050505] text-white py-12 sm:py-16 px-4 sm:px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
        <div className="flex flex-col gap-4">
          <div>
            <Link href="/" className="hover:opacity-85 transition-opacity flex items-center">
              <img src="/optum_logo.png" alt="Optum Car Care Logo" className="h-10 w-auto object-contain" />
            </Link>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed font-medium max-w-xs">
            Premium luxury automotive detailing, advanced self-healing paint protection film, and bespoke ceramic coatings.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-black uppercase tracking-wider text-xs mb-6 text-primary">Quick Links</h4>
          <ul className="space-y-3.5 text-xs text-gray-400 font-bold uppercase tracking-wider">
            <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
            <li><Link href="/process" className="hover:text-white transition-colors">Our Process</Link></li>
            <li><Link href="/studio-experience" className="hover:text-white transition-colors">Studio Experience</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-black uppercase tracking-wider text-xs mb-6 text-primary">Contact OptumCarCare</h4>
          <ul className="space-y-3.5 text-xs text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
            <li className="normal-case font-medium">{config.address}</li>
            <li>Phone: <span className="text-white font-medium">{config.phone}</span></li>
            <li className="normal-case text-primary font-medium hover:underline cursor-pointer">{config.email}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-black uppercase tracking-wider text-xs mb-6 text-primary">OptumCarCare Hours</h4>
          <ul className="space-y-3.5 text-xs text-gray-400 font-bold uppercase tracking-wider">
            <li className="flex justify-between gap-4"><span>Mon - Fri</span><span className="text-white font-medium text-right lowercase">{config.working_hours_mon_fri}</span></li>
            <li className="flex justify-between gap-4"><span>Saturday</span><span className="text-white font-medium text-right lowercase">{config.working_hours_sat}</span></li>
            <li className="flex justify-between gap-4"><span>Sunday</span><span className="text-white font-medium text-right lowercase">{config.working_hours_sun}</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest font-bold gap-3">
        <p>© 2026 Optum Car Care. All rights reserved.</p>
        <div className="flex gap-4 sm:gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/admin-dashboard/login" className="hover:text-white transition-colors">Admin Portal</Link>
        </div>
      </div>
    </footer>
  );
}
