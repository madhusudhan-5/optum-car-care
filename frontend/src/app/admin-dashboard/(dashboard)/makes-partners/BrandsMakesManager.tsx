'use client';

import { useState } from 'react';
import { createMake, deleteMake, createPartner, deletePartner } from '@/actions/admin';
import { useRouter } from 'next/navigation';

export default function BrandsMakesManager({
  initialMakes,
  initialPartners,
}: {
  initialMakes: any[];
  initialPartners: any[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [makeError, setMakeError] = useState('');
  const [partnerError, setPartnerError] = useState('');

  // Handle Make Submit
  async function handleAddMake(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMakeError('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // We expect 'name' and 'image' (file) to be in formData
    const name = formData.get('name') as string;
    if (!name || !name.trim()) return;

    const res = await createMake(formData);
    if (res.success) {
      router.refresh();
      form.reset();
    } else {
      setMakeError(res.error || 'Failed to add vehicle make');
    }
    setLoading(false);
  }

  // Handle Partner Submit
  async function handleAddPartner(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setPartnerError('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // We expect 'name' and 'logo' (file) to be in formData
    const name = formData.get('name') as string;
    if (!name || !name.trim()) return;

    const res = await createPartner(formData);
    if (res.success) {
      router.refresh();
      form.reset();
    } else {
      setPartnerError(res.error || 'Failed to add partner brand');
    }
    setLoading(false);
  }

  // Delete Handlers
  async function handleDeleteMake(id: number) {
    if (!confirm('Are you sure you want to delete this curated vehicle make?')) return;
    setLoading(true);
    const res = await deleteMake(id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete vehicle make');
    }
    setLoading(false);
  }

  async function handleDeletePartner(id: number) {
    if (!confirm('Are you sure you want to delete this brand partner?')) return;
    setLoading(true);
    const res = await deletePartner(id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete partner brand');
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold font-heading text-gray-800 uppercase tracking-wide">
          Manage Brands & Makes
        </h2>
        <p className="text-gray-500 text-sm mt-1">Configure curated vehicle compatibility tags and certified installer partner brand tags.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Panel - Curated Makes */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold font-heading text-gray-900 uppercase tracking-wide mb-1 border-l-4 border-primary pl-2">Curated Vehicle Makes</h3>
            <p className="text-gray-400 text-xs">Exotic makes showcased on your landing page (e.g. Rivian, Tesla, Porsche).</p>
          </div>

          {makeError && (
            <div className="bg-rose-500/10 border border-rose-500 text-rose-600 p-3 rounded text-xs font-semibold">
              ✗ Error: {makeError}
            </div>
          )}

          {/* Add Make Form */}
          <form onSubmit={handleAddMake} className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                name="name"
                required
                placeholder="Make Name (e.g. FERRARI)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:border-black uppercase font-semibold"
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                className="flex-1 w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all border border-gray-200 py-1 px-2 rounded"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-yellow-400 text-black font-bold uppercase tracking-wider px-5 py-2 rounded text-xs transition-colors self-start sm:w-auto w-full"
            >
              Add Make
            </button>
          </form>

          {/* Makes List */}
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto pr-2">
            {initialMakes.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400">No active vehicle makes.</div>
            ) : (
              initialMakes.map((m) => (
                <div key={m.id} className="py-3 flex justify-between items-center text-sm font-bold uppercase tracking-wider text-gray-800">
                  <span>{m.name}</span>
                  <button
                    onClick={() => handleDeleteMake(m.id)}
                    disabled={loading}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Brand Partners */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold font-heading text-gray-900 uppercase tracking-wide mb-1 border-l-4 border-primary pl-2">Certified Brand Partners</h3>
            <p className="text-gray-400 text-xs">Installer brands and partners displayed in the footer ribbon (e.g. XPEL, 3M, STEK).</p>
          </div>

          {partnerError && (
            <div className="bg-rose-500/10 border border-rose-500 text-rose-600 p-3 rounded text-xs font-semibold">
              ✗ Error: {partnerError}
            </div>
          )}

          {/* Add Partner Form */}
          <form onSubmit={handleAddPartner} className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                name="name"
                required
                placeholder="Brand Name (e.g. SUNTEK)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:border-black uppercase font-black"
              />
              <input
                type="file"
                name="logo"
                accept="image/*"
                className="flex-1 w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all border border-gray-200 py-1 px-2 rounded"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-yellow-400 text-black font-bold uppercase tracking-wider px-5 py-2 rounded text-xs transition-colors self-start sm:w-auto w-full"
            >
              Add Brand
            </button>
          </form>

          {/* Partners List */}
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto pr-2">
            {initialPartners.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400">No active partner brands.</div>
            ) : (
              initialPartners.map((p) => (
                <div key={p.id} className="py-3 flex justify-between items-center text-sm font-black uppercase tracking-widest text-gray-800">
                  <span>{p.name}</span>
                  <button
                    onClick={() => handleDeletePartner(p.id)}
                    disabled={loading}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
