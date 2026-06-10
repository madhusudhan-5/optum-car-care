'use client';

import { useState } from 'react';
import { createTestimonial, deleteTestimonial } from '@/actions/admin';
import { useRouter } from 'next/navigation';

export default function TestimonialsManager({ initialTestimonials }: { initialTestimonials: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      author_name: formData.get('author_name'),
      date_posted: formData.get('date_posted') || 'Just now',
      text: formData.get('text'),
      rating: parseInt(formData.get('rating') as string) || 5,
    };

    const res = await createTestimonial(payload);
    if (res.success) {
      setShowAddForm(false);
      router.refresh();
      form.reset();
    } else {
      setError(res.error || 'Failed to add testimonial');
    }
    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this review card?')) return;
    setLoading(true);
    const res = await deleteTestimonial(id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete testimonial');
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-gray-800 uppercase tracking-wide">
            Manage Customer Reviews
          </h2>
          <p className="text-gray-500 text-sm mt-1">Review, create, or delete active customer review cards shown on the home page.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary hover:bg-yellow-400 text-black font-bold uppercase tracking-wider px-6 py-2.5 rounded shadow text-sm transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add Testimonial'}
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500 text-rose-600 p-4 rounded-lg text-sm font-semibold">
          ✗ Error: {error}
        </div>
      )}

      {/* Add Testimonial Inline Card Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 max-w-xl">
          <h3 className="font-bold text-gray-800 uppercase tracking-wider text-xs border-l-4 border-primary pl-2 mb-2">New Testimonial</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Author Name *</label>
              <input
                type="text"
                name="author_name"
                required
                placeholder="e.g. Jerry Xu"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Date Text *</label>
              <input
                type="text"
                name="date_posted"
                required
                placeholder="e.g. 11 days ago"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Rating (1 to 5 Stars) *</label>
            <select
              name="rating"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:border-black"
            >
              <option value="5">★★★★★ (5 Stars)</option>
              <option value="4">★★★★☆ (4 Stars)</option>
              <option value="3">★★★☆☆ (3 Stars)</option>
              <option value="2">★★☆☆☆ (2 Stars)</option>
              <option value="1">★☆☆☆☆ (1 Star)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Review Feedback Content *</label>
            <textarea
              name="text"
              required
              rows={3}
              placeholder="Enter customer feedback text..."
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:border-black"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-yellow-400 text-black font-bold uppercase tracking-widest px-6 py-2.5 rounded shadow text-xs transition-colors"
          >
            {loading ? 'Adding...' : 'Add Testimonial'}
          </button>
        </form>
      )}

      {/* Grid of Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {initialTestimonials.map((t) => (
          <div key={t.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative">
            <button
              onClick={() => handleDelete(t.id)}
              disabled={loading}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider disabled:opacity-50"
            >
              Delete
            </button>
            <p className="text-gray-600 italic text-sm mb-6 pr-12 leading-relaxed">"{t.text}"</p>
            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
              <div>
                <h4 className="text-gray-900 font-bold text-xs uppercase tracking-wide">{t.author_name}</h4>
                <span className="text-[10px] text-gray-400 font-semibold">{t.date_posted}</span>
              </div>
              <div className="text-yellow-400 text-xs font-bold">{"★".repeat(t.rating)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
