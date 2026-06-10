'use client';

import { useState } from 'react';

interface ServiceProp {
  title: string;
  slug: string;
}

interface ContactFormProps {
  services?: ServiceProp[];
  preselectedService?: string;
  compact?: boolean;
}

export default function ContactForm({ services = [], preselectedService = '', compact = false }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const listServices = services.length ? services : [
    { title: "Paint Protection Film", slug: "paint-protection-film" },
    { title: "Ceramic Coating", slug: "ceramic-coating" },
    { title: "Window Tinting", slug: "window-tint" },
    { title: "Vinyl Wrap", slug: "vinyl-wrap" },
    { title: "Car Detailing", slug: "car-detailing" },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      formType: 'appointment',
      name: fd.get('name'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      vehicle: fd.get('vehicle'),
      service: fd.get('service'),
      message: fd.get('message'),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        form.reset();
      } else {
        setError('Something went wrong. Please try again or call us directly.');
      }
    } catch {
      setError('Could not connect. Please call us at 096328 04024.');
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="bg-white text-black p-8 md:p-12 rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-500 text-2xl mb-6">✓</div>
        <h3 className="text-2xl font-black font-heading mb-3 uppercase tracking-wider text-black">Request Received!</h3>
        <p className="text-gray-500 text-sm mb-6 font-medium leading-relaxed max-w-xs">
          Our specialist will contact you within one business day to confirm your appointment.
        </p>
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Optum Car Care · Bengaluru</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-8 border border-gray-300 text-gray-500 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white text-black p-8 md:p-10 rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full relative overflow-hidden">
      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-yellow-300 to-primary" />
      
      <h3 className="text-2xl font-black font-heading mb-1 uppercase tracking-wider text-black">
        Schedule an Appointment
      </h3>
      <p className="text-gray-500 text-sm mb-6 font-medium leading-relaxed">
        Fill in your details and we'll get back to you within one business day.
      </p>

      {error && (
        <div className="bg-rose-50 border border-rose-300 text-rose-600 p-3 rounded-xl text-xs font-bold mb-4">
          ✗ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Full Name *</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-black placeholder-gray-400 text-sm font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Phone *</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-black placeholder-gray-400 text-sm font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Email *</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-black placeholder-gray-400 text-sm font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Year, Make, Model *</label>
          <input
            type="text"
            name="vehicle"
            placeholder="e.g. 2023 BMW M3"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-black placeholder-gray-400 text-sm font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Desired Service *</label>
          <select
            name="service"
            required
            defaultValue={preselectedService}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-black text-sm font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all"
          >
            <option value="">Choose Your Desired Service</option>
            {listServices.map((svc) => (
              <option key={svc.slug} value={svc.title}>
                {svc.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Additional Notes</label>
          <textarea
            name="message"
            rows={3}
            placeholder="Any specific concerns or questions? (optional)"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-black placeholder-gray-400 text-sm font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all resize-none"
          />
        </div>

        <div className="flex items-start gap-3 pt-1">
          <input
            type="checkbox"
            id="terms"
            required
            className="mt-1 accent-primary"
          />
          <label htmlFor="terms" className="text-[10px] text-gray-400 font-semibold leading-relaxed uppercase tracking-wider">
            I agree to terms & conditions. By providing my phone number, I agree to receive text messages & phone calls from Optum Car Care.
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-black hover:bg-yellow-400 transition-all duration-300 font-black uppercase tracking-widest py-4 rounded-xl disabled:opacity-50 text-xs mt-2 shadow-md cursor-pointer"
        >
          {loading ? '⏳ Sending Request...' : 'SEND MY REQUEST →'}
        </button>
      </form>
    </div>
  );
}
