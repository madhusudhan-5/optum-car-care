import Link from 'next/link';
import DeleteButton from './DeleteButton';
import ServicesPageHeroConfig from './ServicesPageHeroConfig';

async function getServices() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/services/', {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

async function getServicesPageConfig() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/services/config/current/', {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

export default async function ServicesListPage() {
  const [services, config] = await Promise.all([
    getServices(),
    getServicesPageConfig()
  ]);

  return (
    <div>
      {/* Hero Config Section */}
      <ServicesPageHeroConfig initialConfig={config} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-2xl font-bold font-heading text-gray-800 uppercase tracking-wide">
            Manage Services
          </h2>
          <p className="text-gray-500 text-sm mt-1">Create, configure, edit, or delete vehicle protection and detailing services.</p>
        </div>
        <Link
          href="/admin-dashboard/services/new"
          className="bg-primary hover:bg-yellow-400 text-black font-bold uppercase tracking-wider px-6 py-2.5 rounded shadow text-sm transition-colors"
        >
          + Add New Service
        </Link>
      </div>

      {/* Services List Table */}
      <div className="overflow-x-auto">
        {services.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <span className="text-4xl block mb-4">📭</span>
            No services found. Click "Add New Service" to create one.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Service Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Slug</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tagline</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Features / FAQs</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service: any) => (
                <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900 uppercase font-heading">{service.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">{service.slug}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 italic">{service.tag_line || 'No tagline'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">{service.features?.length || 0}</span> features &bull;{' '}
                    <span className="font-semibold text-gray-700">{service.faqs?.length || 0}</span> FAQs
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-4 justify-end items-center">
                      <Link
                        href={`/admin-dashboard/services/${service.slug}`}
                        className="text-primary hover:text-yellow-600 font-bold uppercase tracking-wider text-xs"
                      >
                        Edit
                      </Link>
                      <span className="text-gray-300">|</span>
                      <DeleteButton slug={service.slug} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </div>
  );
}
