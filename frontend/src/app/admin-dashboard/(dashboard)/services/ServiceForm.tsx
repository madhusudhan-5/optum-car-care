'use client';

import { useState } from 'react';
import { createService, updateService, uploadServiceImage, createServiceBeforeAfter, deleteServiceBeforeAfter } from '@/actions/admin';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Toast from '@/components/Toast';

interface Feature { title: string; description: string; }
interface FAQ { question: string; answer: string; }

const DJANGO_BASE = 'http://127.0.0.1:8000';

function getImageSrc(path: string | null | undefined) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${DJANGO_BASE}${path.startsWith('/') ? '' : '/media/'}${path}`;
}

function ImageUploadField({
  label,
  fieldName,
  currentPreview,
  onUpload,
  uploading,
  uploadSuccess,
  uploadError,
  disabled = false,
}: {
  label: string;
  fieldName: string;
  currentPreview: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  uploadSuccess: boolean;
  uploadError: string;
  disabled?: boolean;
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
      <label className="block text-sm font-semibold text-gray-700 mb-3">{label}</label>
      {disabled && (
        <p className="text-xs text-amber-600 font-bold mb-2 bg-amber-50 border border-amber-200 rounded-lg p-2">
          ⚠ Save the service first, then come back to upload images.
        </p>
      )}
      {currentPreview && !disabled && (
        <div className="mb-3 relative rounded-xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: '160px' }}>
          <img src={currentPreview} alt={label} className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Live</div>
        </div>
      )}
      {!currentPreview && !disabled && (
        <div className="mb-3 h-20 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-xs">No image uploaded yet</div>
      )}
      {!disabled && (
        <label className={`flex items-center gap-3 cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2.5 hover:border-primary transition-colors ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
          <span className="text-primary font-bold text-sm">{uploading ? '⏳ Uploading...' : '📂 Choose Image'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
          <span className="text-xs text-gray-400">.jpg, .png, .webp</span>
        </label>
      )}
      {uploadSuccess && <p className="text-emerald-600 text-xs font-bold mt-2">✓ Uploaded and live!</p>}
      {uploadError && <p className="text-rose-600 text-xs font-bold mt-2">✗ {uploadError}</p>}
    </div>
  );
}

export default function ServiceForm({ initialService }: { initialService?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const isEdit = !!initialService;

  // Image upload state – hero
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroSuccess, setHeroSuccess] = useState(false);
  const [heroError, setHeroError] = useState('');
  const [heroPreview, setHeroPreview] = useState<string | null>(getImageSrc(initialService?.hero_image));

  // Image upload state – manifesto
  const [manifestoUploading, setManifestoUploading] = useState(false);
  const [manifestoSuccess, setManifestoSuccess] = useState(false);
  const [manifestoError, setManifestoError] = useState('');
  const [manifestoPreview, setManifestoPreview] = useState<string | null>(getImageSrc(initialService?.manifesto_media));

  // Image upload state – standards
  const [standardsUploading, setStandardsUploading] = useState(false);
  const [standardsSuccess, setStandardsSuccess] = useState(false);
  const [standardsError, setStandardsError] = useState('');
  const [standardsPreview, setStandardsPreview] = useState<string | null>(getImageSrc(initialService?.standards_image));

  // Dynamic Lists
  const [features, setFeatures] = useState<Feature[]>(initialService?.features?.map((f: any) => ({ title: f.title, description: f.description })) || []);
  const [faqs, setFaqs] = useState<FAQ[]>(initialService?.faqs?.map((faq: any) => ({ question: faq.question, answer: faq.answer })) || []);
  const [standardItems, setStandardItems] = useState<string[]>(initialService?.standard_items?.map((item: any) => item.text) || []);

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    setUploading: (v: boolean) => void,
    setSucc: (v: boolean) => void,
    setErr: (v: string) => void,
    setPreview: (v: string) => void,
  ) {
    const file = e.target.files?.[0];
    if (!file || !initialService?.slug) return;
    setUploading(true); setSucc(false); setErr('');
    setPreview(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append(fieldName, file);
    fd.append('slug', initialService.slug);
    const res = await uploadServiceImage(initialService.slug, fd);
    if (res.success) { setSucc(true); router.refresh(); }
    else { setErr(res.error || 'Upload failed'); }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess(false);
    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get('title'),
      slug: isEdit ? initialService.slug : (formData.get('slug') || undefined),
      tag_line: formData.get('tag_line'),
      hero_description: formData.get('hero_description'),
      youtube_video_url: formData.get('youtube_video_url') || null,
      manifesto_title: formData.get('manifesto_title') || 'THE ART OF THE INSTALL',
      manifesto_description: formData.get('manifesto_description'),
      standards_title: formData.get('standards_title') || 'UNCOMPROMISED STANDARDS IN EVERY MICRON',
      standards_description: formData.get('standards_description'),
      cta_text: formData.get('cta_text') || 'GET A BESPOKE QUOTE',
      cta_link: formData.get('cta_link') || '/contact#appointment-form',
      meta_title: formData.get('meta_title') || null,
      meta_description: formData.get('meta_description') || null,
      meta_keywords: formData.get('meta_keywords') || null,
      features: features.filter(f => f.title.trim() !== ''),
      faqs: faqs.filter(faq => faq.question.trim() !== ''),
      standard_items: standardItems.filter(text => text.trim() !== '').map(text => ({ text })),
    };
    const res = isEdit ? await updateService(initialService.slug, payload) : await createService(payload);
    if (res.success) {
      setSuccess(true);
      if (!isEdit) setTimeout(() => { router.push('/admin-dashboard/services'); router.refresh(); }, 1200);
      else { router.refresh(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    } else { setError(res.error || 'Failed to submit service data'); }
    setLoading(false);
  }

  const addFeature = () => setFeatures([...features, { title: '', description: '' }]);
  const removeFeature = (idx: number) => setFeatures(features.filter((_, i) => i !== idx));
  const updateFeature = (idx: number, key: keyof Feature, val: string) => { const u = [...features]; u[idx] = { ...u[idx], [key]: val }; setFeatures(u); };

  const addFAQ = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const removeFAQ = (idx: number) => setFaqs(faqs.filter((_, i) => i !== idx));
  const updateFAQ = (idx: number, key: keyof FAQ, val: string) => { const u = [...faqs]; u[idx] = { ...u[idx], [key]: val }; setFaqs(u); };

  const addStandardItem = () => setStandardItems([...standardItems, '']);
  const removeStandardItem = (idx: number) => setStandardItems(standardItems.filter((_, i) => i !== idx));
  const updateStandardItem = (idx: number, val: string) => { const u = [...standardItems]; u[idx] = val; setStandardItems(u); };

  return (
    <div className="space-y-12">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold font-heading text-gray-800 uppercase tracking-wide">
              {isEdit ? `Edit: ${initialService.title}` : 'Create New Service'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">Configure all text, images, features, FAQs, and CTAs for this service.</p>
          </div>
          <Link href="/admin-dashboard/services" className="text-gray-500 hover:text-gray-700 text-xs font-bold uppercase tracking-wider border border-gray-300 px-3 py-1.5 rounded">← Back</Link>
        </div>

      {success && <Toast message={`Service ${isEdit ? 'updated' : 'created'} successfully! ${!isEdit ? 'Redirecting...' : ''}`} type="success" onClose={() => setSuccess(false)} />}
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}

      {/* ── IMAGE UPLOADS ── */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 uppercase tracking-wider text-sm border-l-4 border-primary pl-2">Service Images</h3>
        <p className="text-xs text-gray-500 mb-4 pl-3">{!isEdit ? 'Create the service first, then upload images.' : 'Upload images for each section — they go live instantly.'}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ImageUploadField
            label="Hero Background Image"
            fieldName="hero_image"
            currentPreview={heroPreview}
            onUpload={(e) => handleImageUpload(e, 'hero_image', setHeroUploading, setHeroSuccess, setHeroError, setHeroPreview)}
            uploading={heroUploading}
            uploadSuccess={heroSuccess}
            uploadError={heroError}
            disabled={!isEdit}
          />
          <ImageUploadField
            label="Craft Manifesto / Process Image"
            fieldName="manifesto_media"
            currentPreview={manifestoPreview}
            onUpload={(e) => handleImageUpload(e, 'manifesto_media', setManifestoUploading, setManifestoSuccess, setManifestoError, setManifestoPreview)}
            uploading={manifestoUploading}
            uploadSuccess={manifestoSuccess}
            uploadError={manifestoError}
            disabled={!isEdit}
          />
          <ImageUploadField
            label="Standards / Excellence Section Image"
            fieldName="standards_image"
            currentPreview={standardsPreview}
            onUpload={(e) => handleImageUpload(e, 'standards_image', setStandardsUploading, setStandardsSuccess, setStandardsError, setStandardsPreview)}
            uploading={standardsUploading}
            uploadSuccess={standardsSuccess}
            uploadError={standardsError}
            disabled={!isEdit}
          />
        </div>
      </div>

      {/* ── CORE INFO ── */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm border-l-4 border-primary pl-2">Core Service Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Title</label>
            <input type="text" name="title" defaultValue={initialService?.title || ''} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900 font-semibold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Slug</label>
            <input type="text" name="slug" defaultValue={initialService?.slug || ''} placeholder="e.g. ceramic-coating (auto-generated if empty)" disabled={isEdit} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900 disabled:opacity-60" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Tagline / Shield Text</label>
            <input type="text" name="tag_line" defaultValue={initialService?.tag_line || ''} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Hero Description</label>
            <textarea name="hero_description" defaultValue={initialService?.hero_description || ''} rows={3} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">YouTube Video URL (Optional Background Autoplay)</label>
            <input type="url" name="youtube_video_url" defaultValue={initialService?.youtube_video_url || ''} placeholder="e.g. https://www.youtube.com/watch?v=..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900 font-mono" />
            <p className="text-xs text-gray-500 mt-1">If provided, this video will autoplay as the background for the service card on the home page.</p>
          </div>
        </div>
      </div>

      {/* ── CRAFT MANIFESTO ── */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm border-l-4 border-primary pl-2">Craft Manifesto Section</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Manifesto Title</label>
            <input type="text" name="manifesto_title" defaultValue={initialService?.manifesto_title || 'THE ART OF THE INSTALL'} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Manifesto Description</label>
            <textarea name="manifesto_description" defaultValue={initialService?.manifesto_description || ''} rows={3} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-50 text-gray-900" />
          </div>
        </div>
      </div>

      {/* ── TECHNICAL FEATURES ── */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm border-l-4 border-primary pl-2">Technical Features</h3>
        <div className="space-y-4">
          {features.map((feat, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 relative">
              <button type="button" onClick={() => removeFeature(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold">Remove</button>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Feature Title</label>
                <input type="text" value={feat.title} onChange={(e) => updateFeature(idx, 'title', e.target.value)} placeholder="e.g. Self-Healing Tech" required className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md sm:text-sm text-gray-900 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Feature Description</label>
                <textarea value={feat.description} onChange={(e) => updateFeature(idx, 'description', e.target.value)} rows={2} required className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md sm:text-sm text-gray-900 bg-white" />
              </div>
            </div>
          ))}
          <button type="button" onClick={addFeature} className="text-primary font-bold text-xs uppercase tracking-wider hover:underline">+ Add Technical Feature</button>
        </div>
      </div>

      {/* ── STANDARDS ── */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm border-l-4 border-primary pl-2">Driven by Excellence (Standards)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Standards Title</label>
            <input type="text" name="standards_title" defaultValue={initialService?.standards_title || 'UNCOMPROMISED STANDARDS IN EVERY MICRON'} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Standards Description</label>
            <textarea name="standards_description" defaultValue={initialService?.standards_description || ''} rows={3} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Excellence Standards List</label>
            <div className="space-y-2">
              {standardItems.map((text, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-primary font-bold">✓</span>
                  <input type="text" value={text} onChange={(e) => updateStandardItem(idx, e.target.value)} required className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md sm:text-sm text-gray-900 bg-white" />
                  <button type="button" onClick={() => removeStandardItem(idx)} className="text-red-500 text-xs font-bold">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addStandardItem} className="text-primary font-bold text-xs uppercase tracking-wider hover:underline">+ Add Standard</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── FAQs ── */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm border-l-4 border-primary pl-2">Knowledge Base (FAQs)</h3>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 relative">
              <button type="button" onClick={() => removeFAQ(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold">Remove</button>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Question</label>
                <input type="text" value={faq.question} onChange={(e) => updateFAQ(idx, 'question', e.target.value)} required className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md sm:text-sm text-gray-900 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Answer</label>
                <textarea value={faq.answer} onChange={(e) => updateFAQ(idx, 'answer', e.target.value)} rows={2} required className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md sm:text-sm text-gray-900 bg-white" />
              </div>
            </div>
          ))}
          <button type="button" onClick={addFAQ} className="text-primary font-bold text-xs uppercase tracking-wider hover:underline">+ Add FAQ</button>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm border-l-4 border-primary pl-2">Call To Action</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">CTA Button Text</label>
            <input type="text" name="cta_text" defaultValue={initialService?.cta_text || 'GET A BESPOKE QUOTE'} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CTA Link Path</label>
            <input type="text" name="cta_link" defaultValue={initialService?.cta_link || '/contact#appointment-form'} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-50 text-gray-900" />
          </div>
        </div>
      </div>

      {/* ── SEO ── */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm border-l-4 border-primary pl-2">SEO & Digital Marketing</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">SEO Page Title</label>
            <input type="text" name="meta_title" defaultValue={initialService?.meta_title || ''} placeholder="e.g. Paint Protection Film | Optum Car Care Bengaluru" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SEO Meta Description</label>
            <textarea name="meta_description" defaultValue={initialService?.meta_description || ''} rows={2} placeholder="150-160 character description..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SEO Meta Keywords</label>
            <input type="text" name="meta_keywords" defaultValue={initialService?.meta_keywords || ''} placeholder="comma separated keywords..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-50 text-gray-900" />
          </div>
        </div>
      </div>

        <div className="pt-4 flex justify-end gap-4">
          <Link href="/admin-dashboard/services" className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold uppercase tracking-widest px-8 py-3 rounded-md text-sm transition-colors">Cancel</Link>
          <button type="submit" disabled={loading} className="bg-primary hover:bg-yellow-400 text-black font-bold uppercase tracking-widest px-8 py-3 rounded-md shadow disabled:opacity-50 text-sm transition-colors">
            {loading ? 'Submitting...' : isEdit ? 'Save Changes' : 'Create Service'}
          </button>
        </div>
      </form>

      {/* ── BEFORE & AFTER SLIDERS (Only on Edit) ── */}
      {isEdit && initialService && (
        <BeforeAfterManager serviceId={initialService.id} initialBeforeAfters={initialService.before_afters || []} />
      )}
    </div>
  );
}

function BeforeAfterManager({ serviceId, initialBeforeAfters }: { serviceId: number, initialBeforeAfters: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    const fd = new FormData(e.currentTarget);
    fd.append('service', serviceId.toString());
    
    const res = await createServiceBeforeAfter(fd);
    if (res.success) {
      setSuccess('Slider added successfully!');
      (e.target as HTMLFormElement).reset();
      router.refresh();
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(res.error || 'Failed to add slider');
    }
    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this slider?')) return;
    setLoading(true); setError(''); setSuccess('');
    const res = await deleteServiceBeforeAfter(id);
    if (res.success) {
      setSuccess('Slider deleted successfully!');
      router.refresh();
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(res.error || 'Failed to delete slider');
    }
    setLoading(false);
  }

  return (
    <div className="border-t border-gray-200 pt-10">
      <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-wider border-l-4 border-primary pl-3">Before & After Results</h3>
      
      {success && <Toast message={success} type="success" onClose={() => setSuccess('')} />}
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}

      {/* Existing Sliders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {initialBeforeAfters.map(ba => (
          <div key={ba.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative group overflow-hidden">
            <button 
              onClick={() => handleDelete(ba.id)}
              disabled={loading}
              className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold hover:bg-red-600 disabled:opacity-50 z-10"
              title="Delete Slider"
            >
              ✕
            </button>
            <div className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-3">{ba.title}</div>
            <div className="grid grid-cols-2 gap-2 h-32">
              <div className="bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-1 left-2 text-[8px] font-black uppercase tracking-widest bg-black/50 text-white px-1.5 py-0.5 rounded z-10">Before</div>
                {ba.before_image ? <img src={getImageSrc(ba.before_image)!} className="w-full h-full object-cover absolute inset-0" /> : <span className="text-gray-400 text-xs">No Image</span>}
              </div>
              <div className="bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-1 right-2 text-[8px] font-black uppercase tracking-widest bg-primary/80 text-black px-1.5 py-0.5 rounded z-10">After</div>
                {ba.after_image ? <img src={getImageSrc(ba.after_image)!} className="w-full h-full object-cover absolute inset-0" /> : <span className="text-gray-400 text-xs">No Image</span>}
              </div>
            </div>
          </div>
        ))}
        {initialBeforeAfters.length === 0 && (
          <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-300 rounded-xl">
            <p className="text-gray-500 font-medium text-sm">No Before & After sliders added yet.</p>
          </div>
        )}
      </div>

      {/* Add New Slider Form */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">➕ Add New Slider</h4>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Slider Title</label>
            <input type="text" name="title" required placeholder="e.g. Paint Correction Results" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Before Image</label>
              <input type="file" name="before_image" accept="image/*" required className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 transition-colors border border-gray-300 rounded-md bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">After Image</label>
              <input type="file" name="after_image" accept="image/*" required className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 transition-colors border border-gray-300 rounded-md bg-white" />
            </div>
          </div>
          <div className="pt-2">
            <button type="submit" disabled={loading} className="bg-gray-800 hover:bg-black text-white font-bold uppercase tracking-widest px-6 py-2.5 rounded-md text-xs transition-colors disabled:opacity-50">
              {loading ? 'Uploading...' : 'Upload & Add Slider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
