import BrandsMakesManager from './BrandsMakesManager';

async function getMakes() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content/makes/', {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

async function getPartners() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content/partners/', {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

export default async function MakesPartnersPage() {
  const [makes, partners] = await Promise.all([getMakes(), getPartners()]);

  return (
    <div className="py-4">
      <BrandsMakesManager initialMakes={makes} initialPartners={partners} />
    </div>
  );
}
