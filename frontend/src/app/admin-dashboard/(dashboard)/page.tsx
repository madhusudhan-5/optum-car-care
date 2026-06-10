import Link from 'next/link';
import { LayoutDashboard, Briefcase, Star, HelpCircle, Car, GitBranch, Image, ArrowRight } from 'lucide-react';

async function fetchStats() {
  try {
    const [servicesRes, testimonialsRes, faqsRes, makesRes, partnersRes, processRes, galleryRes] = await Promise.all([
      fetch('http://127.0.0.1:8000/api/services/', { cache: 'no-store' }),
      fetch('http://127.0.0.1:8000/api/content/testimonials/', { cache: 'no-store' }),
      fetch('http://127.0.0.1:8000/api/content/faqs/', { cache: 'no-store' }),
      fetch('http://127.0.0.1:8000/api/content/makes/', { cache: 'no-store' }),
      fetch('http://127.0.0.1:8000/api/content/partners/', { cache: 'no-store' }),
      fetch('http://127.0.0.1:8000/api/content/process/', { cache: 'no-store' }),
      fetch('http://127.0.0.1:8000/api/content/studio-gallery/', { cache: 'no-store' }),
    ]);
    return {
      services: servicesRes.ok ? (await servicesRes.json()).length : 0,
      testimonials: testimonialsRes.ok ? (await testimonialsRes.json()).length : 0,
      faqs: faqsRes.ok ? (await faqsRes.json()).length : 0,
      makes: makesRes.ok ? (await makesRes.json()).length : 0,
      partners: partnersRes.ok ? (await partnersRes.json()).length : 0,
      processSteps: processRes.ok ? (await processRes.json()).length : 0,
      galleryImages: galleryRes.ok ? (await galleryRes.json()).length : 0,
    };
  } catch (e) {
    return { services: 0, testimonials: 0, faqs: 0, makes: 0, partners: 0, processSteps: 0, galleryImages: 0 };
  }
}

const sections = (stats: Awaited<ReturnType<typeof fetchStats>>) => [
  {
    title: 'Home Page Config',
    description: 'Update headers, hero images, landing stats, pain points list, standard policies, and contact details.',
    href: '/admin-dashboard/home-config',
    badge: 'LIVE',
    badgeColor: 'bg-emerald-500/10 text-emerald-600',
    stat: null,
    icon: LayoutDashboard,
    iconColor: 'text-primary bg-primary/10',
  },
  {
    title: 'Services',
    description: 'Add, modify, or archive detailing and paint protection services, including features and service FAQs.',
    href: '/admin-dashboard/services',
    badge: `${stats.services} Active`,
    badgeColor: 'bg-blue-500/10 text-blue-600',
    stat: stats.services,
    icon: Briefcase,
    iconColor: 'text-blue-500 bg-blue-500/10',
  },
  {
    title: 'Customer Reviews',
    description: 'Review, update, add, or delete five-star testimonials shown dynamically on the home page.',
    href: '/admin-dashboard/testimonials',
    badge: `${stats.testimonials} Reviews`,
    badgeColor: 'bg-yellow-500/10 text-yellow-600',
    stat: stats.testimonials,
    icon: Star,
    iconColor: 'text-yellow-500 bg-yellow-500/10',
  },
  {
    title: 'General FAQs',
    description: 'Configure the general FAQ knowledge base addressing deposits, liability, storage, and booking.',
    href: '/admin-dashboard/faqs',
    badge: `${stats.faqs} Active`,
    badgeColor: 'bg-purple-500/10 text-purple-600',
    stat: stats.faqs,
    icon: HelpCircle,
    iconColor: 'text-purple-500 bg-purple-500/10',
  },
  {
    title: 'Brands & Makes',
    description: 'Update the exotics catalog (Rivian, Porsche) and certified partner logos (XPEL, 3M) shown in headers.',
    href: '/admin-dashboard/makes-partners',
    badge: `${stats.makes + stats.partners} Active`,
    badgeColor: 'bg-gray-500/10 text-gray-600',
    stat: stats.makes + stats.partners,
    icon: Car,
    iconColor: 'text-gray-500 bg-gray-100',
  },
  {
    title: 'Process Steps',
    description: 'Manage the Vehicle Journey timeline steps shown on the Process page — order, title, and description.',
    href: '/admin-dashboard/process',
    badge: `${stats.processSteps} Steps`,
    badgeColor: 'bg-indigo-500/10 text-indigo-600',
    stat: stats.processSteps,
    icon: GitBranch,
    iconColor: 'text-indigo-500 bg-indigo-500/10',
  },
  {
    title: 'Studio Experience',
    description: 'Configure the Studio Experience hero video, title, subtitle, and manage the photo gallery.',
    href: '/admin-dashboard/studio-experience',
    badge: `${stats.galleryImages} Images`,
    badgeColor: 'bg-pink-500/10 text-pink-600',
    stat: stats.galleryImages,
    icon: Image,
    iconColor: 'text-pink-500 bg-pink-500/10',
  },
];

export default async function AdminDashboardPage() {
  const stats = await fetchStats();
  const sectionList = sections(stats);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-black font-heading text-gray-900 uppercase tracking-wide">
          Dashboard Overview
        </h2>
        <p className="text-gray-500 text-sm mt-1 font-medium">
          Select a section to configure your site content, page copy, images, and services.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Services', value: stats.services },
          { label: 'Reviews', value: stats.testimonials },
          { label: 'Process Steps', value: stats.processSteps },
          { label: 'Gallery Images', value: stats.galleryImages },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <div className="text-2xl font-black text-primary font-heading">{stat.value}</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sectionList.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:border-primary/30 hover:shadow-md transition-all duration-200 min-h-[180px]"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${section.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${section.badgeColor}`}>
                    {section.badge}
                  </span>
                </div>
                <h3 className="text-sm font-black font-heading text-gray-900 uppercase tracking-wide mb-2">
                  {section.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">{section.description}</p>
              </div>
              <div className="flex items-center gap-1 text-primary text-xs font-bold uppercase tracking-wider mt-4 group-hover:gap-2 transition-all">
                Manage <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
