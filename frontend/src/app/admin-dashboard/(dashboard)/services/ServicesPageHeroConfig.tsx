"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateServicesPageConfig } from "@/actions/admin";
import Toast from '@/components/Toast';

export default function ServicesPageHeroConfig({ initialConfig }: { initialConfig: any }) {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const fd = new FormData(e.currentTarget);
      const payload = {
        hero_title: fd.get('hero_title'),
        hero_description: fd.get('hero_description'),
      };
      
      const configId = initialConfig?.id || 1;
      const res = await updateServicesPageConfig(configId, payload);
      
      if (res.success) {
        setSuccess("Services Page Hero updated successfully!");
        router.refresh();
      } else {
        setError(res.error || "Failed to save settings.");
      }
    } catch {
      setError("Network error. Is the backend running?");
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
      <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider border-l-4 border-primary pl-3 mb-5">
        ⚙️ Services Page Hero Settings
      </h3>
      
      {success && (
        <Toast message={success} type="success" onClose={() => setSuccess("")} />
      )}
      {error && (
        <Toast message={error} type="error" onClose={() => setError("")} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Hero Title *</label>
          <input
            required
            type="text"
            name="hero_title"
            defaultValue={initialConfig?.hero_title}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Hero Description *</label>
          <textarea
            required
            name="hero_description"
            defaultValue={initialConfig?.hero_description}
            rows={3}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button
          disabled={saving}
          type="submit"
          className="bg-primary hover:bg-yellow-400 text-black font-bold uppercase tracking-widest px-6 py-2.5 rounded-lg shadow text-xs transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
