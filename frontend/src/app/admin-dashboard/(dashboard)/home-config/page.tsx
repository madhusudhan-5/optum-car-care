import HomeConfigForm from './HomeConfigForm';

async function getHomeConfig() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content/home-config/current/', {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (Object.keys(data).length === 0) return null;
    return data;
  } catch (e) {
    return null;
  }
}

export default async function HomeConfigPage() {
  const config = await getHomeConfig();

  if (!config) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <h3 className="font-bold text-lg mb-2">Backend Connection Error</h3>
        <p>Failed to load Home Page Configuration from the Django backend. Please ensure the backend server is running and populated.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-2xl font-bold font-heading text-gray-800 uppercase tracking-wide">
          Manage Home Page Content
        </h2>
        <p className="text-gray-500 text-sm mt-1">Configure texts, statistics, pain points, standards, and highlights shown on the landing page.</p>
      </div>
      <HomeConfigForm initialConfig={config} />
    </div>
  );
}
