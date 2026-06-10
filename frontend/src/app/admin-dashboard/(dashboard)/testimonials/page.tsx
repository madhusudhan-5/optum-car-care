import TestimonialsManager from './TestimonialsManager';

async function getTestimonials() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content/testimonials/', {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

export default async function TestimonialsAdminPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="py-4">
      <TestimonialsManager initialTestimonials={testimonials} />
    </div>
  );
}
