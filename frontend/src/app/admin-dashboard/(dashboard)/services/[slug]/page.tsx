import ServiceForm from '../ServiceForm';

async function getServiceDetails(slug: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/services/${slug}/`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

export default async function EditServicePage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const service = await getServiceDetails(resolvedParams.slug);

  if (!service) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-4xl mx-auto">
        <h3 className="font-bold text-lg mb-2">Service Not Found</h3>
        <p>Failed to load service details for slug "{resolvedParams.slug}" from the Django backend. Please ensure the backend server is running and populated.</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <ServiceForm initialService={service} />
    </div>
  );
}
