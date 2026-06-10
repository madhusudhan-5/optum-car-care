import FAQsManager from './FAQsManager';

async function getFAQs() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content/faqs/', {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

export default async function FAQsAdminPage() {
  const faqs = await getFAQs();

  return (
    <div className="py-4">
      <FAQsManager initialFAQs={faqs} />
    </div>
  );
}
