"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateStudioConfig, uploadStudioGalleryImage, deleteStudioGalleryImage } from "@/actions/admin";

const emptyGalleryForm = { id: null as number | null, alt_text: "", category: "", image: null as File | null };

export default function StudioManager({ initialConfig, initialGallery }: { initialConfig: any; initialGallery: any[] }) {
  const [config, setConfig] = useState(initialConfig || { id: null, hero_title: "", hero_subtitle: "", hero_video_url: "" });
  const [gallery, setGallery] = useState(initialGallery);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [configSuccess, setConfigSuccess] = useState("");
  const [configError, setConfigError] = useState("");
  const [gallerySuccess, setGallerySuccess] = useState("");
  const [galleryError, setGalleryError] = useState("");
  const [galleryForm, setGalleryForm] = useState(emptyGalleryForm);
  const router = useRouter();

  const showFeedback = (
    msg: string,
    setSucc: (v: string) => void,
    setErr: (v: string) => void,
    isError = false
  ) => {
    if (isError) { setErr(msg); setSucc(""); }
    else { setSucc(msg); setErr(""); setTimeout(() => setSucc(""), 4000); }
  };

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingConfig(true);
    try {
      const res = await updateStudioConfig(config);

      if (res.success) {
        setConfig(res.data);
        showFeedback("Hero configuration saved and live!", setConfigSuccess, setConfigError);
        router.refresh();
      } else {
        showFeedback(res.error || "Failed to save configuration.", setConfigSuccess, setConfigError, true);
      }
    } catch {
      showFeedback("Network error. Is the backend running?", setConfigSuccess, setConfigError, true);
    }
    setLoadingConfig(false);
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingGallery(true);
    try {
      const formData = new FormData();
      formData.append("alt_text", galleryForm.alt_text);
      formData.append("category", galleryForm.category);
      if (galleryForm.image) formData.append("image", galleryForm.image);

      const res = await uploadStudioGalleryImage(formData, galleryForm.id);

      if (res.success) {
        if (galleryForm.id) {
          setGallery(gallery.map((g) => (g.id === res.data.id ? res.data : g)));
          showFeedback("Image updated successfully!", setGallerySuccess, setGalleryError);
        } else {
          setGallery([...gallery, res.data]);
          showFeedback("Image uploaded successfully!", setGallerySuccess, setGalleryError);
        }
        setGalleryForm(emptyGalleryForm);
        router.refresh();
      } else {
        showFeedback(res.error || "Upload failed. Please try again.", setGallerySuccess, setGalleryError, true);
      }
    } catch {
      showFeedback("Network error. Is the backend running?", setGallerySuccess, setGalleryError, true);
    }
    setLoadingGallery(false);
  };

  const handleDeleteGallery = async (id: number) => {
    if (!confirm("Delete this image from the gallery?")) return;
    setLoadingGallery(true);
    try {
      const res = await deleteStudioGalleryImage(id);
      if (res.success) {
        setGallery(gallery.filter((g) => g.id !== id));
        showFeedback("Image deleted.", setGallerySuccess, setGalleryError);
        router.refresh();
      } else {
        showFeedback(res.error || "Failed to delete image.", setGallerySuccess, setGalleryError, true);
      }
    } catch {
      showFeedback("Network error.", setGallerySuccess, setGalleryError, true);
    }
    setLoadingGallery(false);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-black font-heading text-gray-900 uppercase tracking-wide">Studio Experience</h2>
        <p className="text-gray-500 text-sm mt-1 font-medium">Configure the hero video section and manage the photo gallery for the Studio Experience page.</p>
      </div>

      {/* --- Hero Config Form --- */}
      <form onSubmit={handleConfigSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider border-l-4 border-primary pl-3 mb-5">
          Hero Section Configuration
        </h3>

        {configSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-700 p-3 rounded-lg text-sm font-semibold mb-4">✓ {configSuccess}</div>
        )}
        {configError && (
          <div className="bg-rose-500/10 border border-rose-500 text-rose-700 p-3 rounded-lg text-sm font-semibold mb-4">✗ {configError}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Hero Title *</label>
            <input
              required
              type="text"
              value={config.hero_title}
              onChange={(e) => setConfig({ ...config, hero_title: e.target.value })}
              placeholder="e.g. Studio Experience"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Hero Video URL (MP4) *</label>
            <input
              required
              type="url"
              value={config.hero_video_url}
              onChange={(e) => setConfig({ ...config, hero_video_url: e.target.value })}
              placeholder="https://example.com/video.mp4"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Hero Subtitle *</label>
            <textarea
              required
              value={config.hero_subtitle}
              onChange={(e) => setConfig({ ...config, hero_subtitle: e.target.value })}
              placeholder="e.g. Where Automotive Perfection is Born"
              rows={2}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <button
          disabled={loadingConfig}
          type="submit"
          className="bg-primary hover:bg-yellow-400 text-black font-bold uppercase tracking-widest px-6 py-2.5 rounded-lg shadow text-xs transition-colors disabled:opacity-50"
        >
          {loadingConfig ? "Saving..." : "Save Hero Configuration"}
        </button>
      </form>

      {/* --- Gallery Manager --- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider border-l-4 border-primary pl-3 mb-5">
          Gallery Images ({gallery.length})
        </h3>

        {gallerySuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-700 p-3 rounded-lg text-sm font-semibold mb-4">✓ {gallerySuccess}</div>
        )}
        {galleryError && (
          <div className="bg-rose-500/10 border border-rose-500 text-rose-700 p-3 rounded-lg text-sm font-semibold mb-4">✗ {galleryError}</div>
        )}

        {/* Upload Form */}
        <form onSubmit={handleGallerySubmit} className="mb-6 p-5 border border-dashed border-gray-300 rounded-xl bg-gray-50">
          <h4 className="font-black text-xs text-gray-700 uppercase tracking-wider mb-4">
            {galleryForm.id ? "✏️ Edit Image Metadata" : "📸 Upload New Image"}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category *</label>
              <input
                required
                type="text"
                value={galleryForm.category}
                onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                placeholder="e.g. Detailing"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Alt Text *</label>
              <input
                required
                type="text"
                value={galleryForm.alt_text}
                onChange={(e) => setGalleryForm({ ...galleryForm, alt_text: e.target.value })}
                placeholder="e.g. Paint correction process"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Image File {galleryForm.id ? "(leave blank to keep)" : "*"}
              </label>
              <input
                type="file"
                accept="image/*"
                required={!galleryForm.id}
                onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.files?.[0] || null })}
                className="w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              disabled={loadingGallery}
              type="submit"
              className="bg-primary hover:bg-yellow-400 text-black font-bold uppercase tracking-widest px-5 py-2 rounded-lg text-xs transition-colors disabled:opacity-50"
            >
              {loadingGallery ? "Uploading..." : galleryForm.id ? "Update Info" : "Upload Image"}
            </button>
            {galleryForm.id && (
              <button
                type="button"
                onClick={() => setGalleryForm(emptyGalleryForm)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold uppercase tracking-widest px-4 py-2 rounded-lg text-xs"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Gallery Grid */}
        {gallery.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {gallery.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden relative group shadow-sm hover:shadow-md transition-shadow bg-white">
                <div className="aspect-square overflow-hidden">
                  <img src={item.image} alt={item.alt_text} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-bold text-gray-800 truncate">{item.category}</p>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{item.alt_text}</p>
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setGalleryForm({ id: item.id, alt_text: item.alt_text, category: item.category, image: null })}
                    className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-md text-blue-600 hover:text-blue-800 text-[10px] font-bold"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteGallery(item.id)}
                    className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-md text-red-600 hover:text-red-800 text-[10px] font-bold"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-4xl mb-3">📸</p>
            <p className="text-gray-500 font-medium text-sm">No gallery images yet.</p>
            <p className="text-gray-400 text-xs mt-1">Upload your first image using the form above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
