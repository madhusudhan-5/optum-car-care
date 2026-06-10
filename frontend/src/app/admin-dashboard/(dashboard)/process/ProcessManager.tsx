"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProcessStep, updateProcessStep, deleteProcessStep, updateProcessPageConfig, uploadProcessConfigImage } from "@/actions/admin";
import Toast from '@/components/Toast';

interface Step {
  id: number | null;
  title: string;
  description: string;
  order: number;
}

const emptyForm: Step = { id: null, title: "", description: "", order: 1 };

export default function ProcessManager({ initialSteps, initialConfig }: { initialSteps: any[], initialConfig: any }) {
  const [steps, setSteps] = useState(initialSteps);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Step>(emptyForm);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  
  const [configSaving, setConfigSaving] = useState(false);
  const router = useRouter();

  const showSuccess = (msg: string) => {
    setSuccess(msg); setError("");
  };
  const showError = (msg: string) => {
    setError(msg); setSuccess("");
  };

  const handleEdit = (step: any) => {
    setFormData(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this step?")) return;
    setLoading(true);
    try {
      const res = await deleteProcessStep(id);
      if (res.success) {
        setSteps(steps.filter((s) => s.id !== id));
        showSuccess("Step deleted successfully.");
        router.refresh();
      } else {
        showError(res.error || "Failed to delete. Please try again.");
      }
    } catch {
      showError("Network error. Is the backend running?");
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { title: formData.title, description: formData.description, order: formData.order };
      let res;
      if (formData.id) {
        res = await updateProcessStep(formData.id, payload);
      } else {
        res = await createProcessStep(payload);
      }

      if (res.success) {
        if (formData.id) {
          setSteps(steps.map((s) => (s.id === res.data.id ? res.data : s)));
          showSuccess("Step updated successfully!");
        } else {
          setSteps([...steps, res.data]);
          showSuccess("Step added successfully!");
        }
        setFormData(emptyForm);
        router.refresh();
      } else {
        showError(res.error || "Failed to save. Please check the form.");
      }
    } catch {
      showError("Network error. Is the backend running?");
    }
    setLoading(false);
  };

  const handleConfigSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setConfigSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      const payload = {
        hero_title: fd.get('hero_title'),
        hero_description: fd.get('hero_description'),
        hero_video_url: fd.get('hero_video_url'),
      };
      // Assume config ID is 1 (singleton) or initialConfig.id if exists.
      const configId = initialConfig?.id || 1;
      const res = await updateProcessPageConfig(configId, payload);
      
      let successMsg = "Process Page Settings updated successfully!";
      let errorMsg = null;

      if (res.success) {
        // If there's an image file, upload it
        const imageFile = fd.get('hero_image') as File;
        if (imageFile && imageFile.size > 0) {
          const formData = new FormData();
          formData.append('hero_image', imageFile);
          const imgRes = await uploadProcessConfigImage(configId, formData);
          if (!imgRes.success) {
            errorMsg = "Text settings saved, but failed to upload the image.";
          }
        }
        
        if (errorMsg) {
          showError(errorMsg);
        } else {
          showSuccess(successMsg);
          router.refresh();
        }
      } else {
        showError(res.error || "Failed to save settings.");
      }
    } catch {
      showError("Network error. Is the backend running?");
    }
    setConfigSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-black font-heading text-gray-900 uppercase tracking-wide">Process Steps</h2>
        <p className="text-gray-500 text-sm mt-1 font-medium">Manage the Vehicle Journey timeline shown on the Process page.</p>
      </div>

      {/* Feedback Banners */}
      {success && (
        <Toast message={success} type="success" onClose={() => setSuccess("")} />
      )}
      {error && (
        <Toast message={error} type="error" onClose={() => setError("")} />
      )}

      {/* Process Page Settings Form */}
      <form onSubmit={handleConfigSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider border-l-4 border-primary pl-3 mb-5">
          ⚙️ Process Page Hero Settings
        </h3>
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
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Hero Video URL *</label>
            <input
              required
              type="url"
              name="hero_video_url"
              defaultValue={initialConfig?.hero_video_url}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Link to an MP4 video or YouTube/Vimeo embed URL</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Hero Background Image</label>
            <input
              type="file"
              name="hero_image"
              accept="image/*"
              className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all border border-gray-300 rounded-lg bg-gray-50"
            />
            {initialConfig?.hero_image && (
              <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-2">
                ✅ Current image is set. Uploading a new one will replace it.
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            disabled={configSaving}
            type="submit"
            className="bg-primary hover:bg-yellow-400 text-black font-bold uppercase tracking-widest px-6 py-2.5 rounded-lg shadow text-xs transition-colors disabled:opacity-50"
          >
            {configSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider border-l-4 border-primary pl-3 mb-5">
          {formData.id ? "✏️ Edit Step" : "➕ Add New Step"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Step Title *</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Vehicle Arrival & Check-in"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Display Order *</label>
            <input
              required
              type="number"
              min={1}
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what happens in this step..."
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            disabled={loading}
            type="submit"
            className="bg-primary hover:bg-yellow-400 text-black font-bold uppercase tracking-widest px-6 py-2.5 rounded-lg shadow text-xs transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : formData.id ? "Update Step" : "Add Step"}
          </button>
          {formData.id && (
            <button
              type="button"
              onClick={() => setFormData(emptyForm)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg text-xs transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Steps Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider">
            Current Steps ({steps.length})
          </h3>
        </div>
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest w-16">Order</th>
              <th className="px-6 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</th>
              <th className="px-6 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest hidden md:table-cell">Description</th>
              <th className="px-6 py-3 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {steps.sort((a, b) => a.order - b.order).map((step) => (
              <tr key={step.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center">
                    {step.order}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">{step.title}</td>
                <td className="px-6 py-4 text-xs text-gray-500 hidden md:table-cell max-w-xs truncate">{step.description}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(step)} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold uppercase tracking-wider mr-4 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(step.id)} disabled={loading} className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40">Delete</button>
                </td>
              </tr>
            ))}
            {steps.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-400 font-medium">
                  No process steps yet. Add your first step above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
