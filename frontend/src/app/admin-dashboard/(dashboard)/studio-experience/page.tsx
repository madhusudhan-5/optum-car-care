import StudioManager from './StudioManager';

async function getStudioConfig() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content/studio-config/current/', {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

async function getGalleryItems() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content/studio-gallery/', {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

export default async function StudioAdminPage() {
  const config = await getStudioConfig();
  const gallery = await getGalleryItems();

  return (
    <div className="py-4">
      <StudioManager initialConfig={config} initialGallery={gallery} />
    </div>
  );
}
