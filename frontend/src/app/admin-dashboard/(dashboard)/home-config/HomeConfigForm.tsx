'use client';

import { useState } from 'react';
import { updateHomeConfig, uploadHomeConfigImage } from '@/actions/admin';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';

const DJANGO_BASE = '';

function getImageSrc(path: string | null | undefined) {
  if (!path) return null;
  if (path.startsWith('http://127.0.0.1:8000')) path = path.replace('http://127.0.0.1:8000', '');
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
}: {
  label: string;
  fieldName: string;
  currentPreview: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  uploadSuccess: boolean;
  uploadError: string;
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
      <label className="block text-sm font-semibold text-gray-700 mb-3">{label}</label>
      {currentPreview && (
        <div className="mb-3 relative rounded-xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: '180px' }}>
          <img src={currentPreview} alt={label} className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Live
          </div>
        </div>
      )}
      {!currentPreview && (
        <div className="mb-3 h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-sm">
          No image uploaded yet
        </div>
      )}
      <label className={`flex items-center gap-3 cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2.5 hover:border-primary transition-colors ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
        <span className="text-primary font-bold text-sm">{uploading ? '⏳ Uploading...' : '📂 Choose Image'}</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onUpload}
          disabled={uploading}
        />
        <span className="text-xs text-gray-400 truncate">.jpg, .png, .webp supported</span>
      </label>
      {uploadSuccess && (
        <p className="text-emerald-600 text-xs font-bold mt-2">✓ Image uploaded and live!</p>
      )}
      {uploadError && (
        <p className="text-rose-600 text-xs font-bold mt-2">✗ {uploadError}</p>
      )}
    </div>
  );
}

export default function HomeConfigForm({ initialConfig }: { initialConfig: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Image upload state
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerSuccess, setBannerSuccess] = useState(false);
  const [bannerError, setBannerError] = useState('');
  const [bannerPreview, setBannerPreview] = useState<string | null>(getImageSrc(initialConfig.banner_image));

  const [standardUploading, setStandardUploading] = useState(false);
  const [standardSuccess, setStandardSuccess] = useState(false);
  const [standardError, setStandardError] = useState('');
  const [standardPreview, setStandardPreview] = useState<string | null>(getImageSrc(initialConfig.standard_image));

  const [heroUploading, setHeroUploading] = useState(false);
  const [heroSuccess, setHeroSuccess] = useState(false);
  const [heroError, setHeroError] = useState('');
  const [heroPreview, setHeroPreview] = useState<string | null>(getImageSrc(initialConfig.hero_image));

  const [about1Uploading, setAbout1Uploading] = useState(false);
  const [about1Success, setAbout1Success] = useState(false);
  const [about1Error, setAbout1Error] = useState('');
  const [about1Preview, setAbout1Preview] = useState<string | null>(getImageSrc(initialConfig.about_image_1));

  const [about2Uploading, setAbout2Uploading] = useState(false);
  const [about2Success, setAbout2Success] = useState(false);
  const [about2Error, setAbout2Error] = useState('');
  const [about2Preview, setAbout2Preview] = useState<string | null>(getImageSrc(initialConfig.about_image_2));

  const [introUploading, setIntroUploading] = useState(false);
  const [introSuccess, setIntroSuccess] = useState(false);
  const [introError, setIntroError] = useState('');
  const [introPreview, setIntroPreview] = useState<string | null>(getImageSrc(initialConfig.intro_image));

  const [contactUploading, setContactUploading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactPreview, setContactPreview] = useState<string | null>(getImageSrc(initialConfig.contact_image));

  // Dynamic Lists State
  const [painPoints, setPainPoints] = useState<string[]>(
    initialConfig.pain_points?.map((pp: any) => pp.text) || []
  );
  const [standardItems, setStandardItems] = useState<string[]>(
    initialConfig.standard_items?.map((s: any) => s.text) || []
  );
  const [aboutFeatures, setAboutFeatures] = useState<string[]>(
    initialConfig.about_features?.map((a: any) => a.text) || []
  );

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    setUploading: (v: boolean) => void,
    setSucc: (v: boolean) => void,
    setErr: (v: string) => void,
    setPreview: (v: string) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setSucc(false);
    setErr('');
    setPreview(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append(fieldName, file);
    const res = await uploadHomeConfigImage(initialConfig.id, fd);
    if (res.success) { setSucc(true); router.refresh(); }
    else { setErr(res.error || 'Upload failed'); }
    setUploading(false);
  }


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    const formData = new FormData(e.currentTarget);
    const payload = {
      hero_title: formData.get('hero_title'),
      hero_subtitle: formData.get('hero_subtitle'),
      vehicles_protected: formData.get('vehicles_protected'),
      pain_points_title: formData.get('pain_points_title'),
      standard_title: formData.get('standard_title'),
      standard_description: formData.get('standard_description'),
      about_title: formData.get('about_title'),
      about_description: formData.get('about_description'),
      banner_cta_title: formData.get('banner_cta_title'),
      banner_cta_subtitle: formData.get('banner_cta_subtitle'),
      stat_1_number: formData.get('stat_1_number'),
      stat_1_text: formData.get('stat_1_text'),
      stat_2_number: formData.get('stat_2_number'),
      stat_2_text: formData.get('stat_2_text'),
      stat_3_number: formData.get('stat_3_number'),
      stat_3_text: formData.get('stat_3_text'),
      meta_title: formData.get('meta_title') || null,
      meta_description: formData.get('meta_description') || null,
      meta_keywords: formData.get('meta_keywords') || null,
      phone: formData.get('phone') || null,
      whatsapp_number: formData.get('whatsapp_number') || null,
      google_review_link: formData.get('google_review_link') || null,
      email: formData.get('email') || null,
      address: formData.get('address') || null,
      working_hours_mon_fri: formData.get('working_hours_mon_fri') || null,
      working_hours_sat: formData.get('working_hours_sat') || null,
      working_hours_sun: formData.get('working_hours_sun') || null,
      review_count: formData.get('review_count') || null,
      review_rating: formData.get('review_rating') || null,
      pain_points: painPoints.filter(text => text.trim() !== '').map(text => ({ text })),
      standard_items: standardItems.filter(text => text.trim() !== '').map(text => ({ text })),
      about_features: aboutFeatures.filter(text => text.trim() !== '').map(text => ({ text })),
    };

    const res = await updateHomeConfig(initialConfig.id, payload);

    if (res.success) {
      setSuccess(true);
      router.refresh();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError(res.error || 'Failed to save changes');
    }
    setLoading(false);
  }

  // List Helpers
  const addPainPoint = () => setPainPoints([...painPoints, '']);
  const removePainPoint = (index: number) => setPainPoints(painPoints.filter((_, i) => i !== index));
  const updatePainPoint = (index: number, val: string) => {
    const updated = [...painPoints]; updated[index] = val; setPainPoints(updated);
  };

  const addStandardItem = () => setStandardItems([...standardItems, '']);
  const removeStandardItem = (index: number) => setStandardItems(standardItems.filter((_, i) => i !== index));
  const updateStandardItem = (index: number, val: string) => {
    const updated = [...standardItems]; updated[index] = val; setStandardItems(updated);
  };

  const addAboutFeature = () => setAboutFeatures([...aboutFeatures, '']);
  const removeAboutFeature = (index: number) => setAboutFeatures(aboutFeatures.filter((_, i) => i !== index));
  const updateAboutFeature = (index: number, val: string) => {
    const updated = [...aboutFeatures]; updated[index] = val; setAboutFeatures(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {success && (
        <Toast message="Configuration saved successfully! Live home page updated." type="success" onClose={() => setSuccess(false)} />
      )}
      {error && (
        <Toast message={`Error: ${error}`} type="error" onClose={() => setError('')} />
      )}

      {/* ── IMAGE UPLOADS ── */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 uppercase tracking-wider text-sm border-l-4 border-primary pl-2">Page Images</h3>
        <p className="text-xs text-gray-500 mb-4 pl-3">Upload images directly here — they go live on your site instantly.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ImageUploadField
            label="Hero Main Background Image"
            fieldName="hero_image"
            currentPreview={heroPreview}
            onUpload={(e) => handleImageUpload(e, 'hero_image', setHeroUploading, setHeroSuccess, setHeroError, setHeroPreview)}
            uploading={heroUploading}
            uploadSuccess={heroSuccess}
            uploadError={heroError}
          />
          <ImageUploadField
            label="Intro Section Image"
            fieldName="intro_image"
            currentPreview={introPreview}
            onUpload={(e) => handleImageUpload(e, 'intro_image', setIntroUploading, setIntroSuccess, setIntroError, setIntroPreview)}
            uploading={introUploading}
            uploadSuccess={introSuccess}
            uploadError={introError}
          />
          <ImageUploadField
            label="'The Standard' Section Image"
            fieldName="standard_image"
            currentPreview={standardPreview}
            onUpload={(e) => handleImageUpload(e, 'standard_image', setStandardUploading, setStandardSuccess, setStandardError, setStandardPreview)}
            uploading={standardUploading}
            uploadSuccess={standardSuccess}
            uploadError={standardError}
          />
          <ImageUploadField
            label="About Us Image 1"
            fieldName="about_image_1"
            currentPreview={about1Preview}
            onUpload={(e) => handleImageUpload(e, 'about_image_1', setAbout1Uploading, setAbout1Success, setAbout1Error, setAbout1Preview)}
            uploading={about1Uploading}
            uploadSuccess={about1Success}
            uploadError={about1Error}
          />
          <ImageUploadField
            label="About Us Image 2"
            fieldName="about_image_2"
            currentPreview={about2Preview}
            onUpload={(e) => handleImageUpload(e, 'about_image_2', setAbout2Uploading, setAbout2Success, setAbout2Error, setAbout2Preview)}
            uploading={about2Uploading}
            uploadSuccess={about2Success}
            uploadError={about2Error}
          />
          <ImageUploadField
            label="Middle Banner Background Image"
            fieldName="banner_image"
            currentPreview={bannerPreview}
            onUpload={(e) => handleImageUpload(e, 'banner_image', setBannerUploading, setBannerSuccess, setBannerError, setBannerPreview)}
            uploading={bannerUploading}
            uploadSuccess={bannerSuccess}
            uploadError={bannerError}
          />
          <ImageUploadField
            label="Contact Section Form Image"
            fieldName="contact_image"
            currentPreview={contactPreview}
            onUpload={(e) => handleImageUpload(e, 'contact_image', setContactUploading, setContactSuccess, setContactError, setContactPreview)}
            uploading={contactUploading}
            uploadSuccess={contactSuccess}
            uploadError={contactError}
          />
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm border-l-4 border-primary pl-2">Hero Section</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Hero Title</label>
            <input type="text" name="hero_title" defaultValue={initialConfig.hero_title} required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900 font-semibold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hero Subtitle</label>
            <textarea name="hero_subtitle" defaultValue={initialConfig.hero_subtitle} rows={2} required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicles Protected Count (text)</label>
            <input type="text" name="vehicles_protected" defaultValue={initialConfig.vehicles_protected} required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
        </div>
      </div>

      {/* Middle Banner Text */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm border-l-4 border-primary pl-2">Middle Banner Text</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Banner Main Title</label>
            <input type="text" name="banner_cta_title" defaultValue={initialConfig.banner_cta_title} required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Banner Subtitle</label>
            <input type="text" name="banner_cta_subtitle" defaultValue={initialConfig.banner_cta_subtitle} required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm border-l-4 border-primary pl-2">Home Page Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block text-xs font-semibold text-gray-500 uppercase">Stat {n} Number</label>
              <input type="text" name={`stat_${n}_number`} defaultValue={initialConfig[`stat_${n}_number`]} required
                className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md sm:text-sm bg-white text-gray-900 font-bold" />
              <label className="block text-xs font-semibold text-gray-500 uppercase mt-3">Stat {n} Label</label>
              <input type="text" name={`stat_${n}_text`} defaultValue={initialConfig[`stat_${n}_text`]} required
                className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md sm:text-sm bg-white text-gray-900" />
            </div>
          ))}
        </div>
      </div>

      {/* Pain Points Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm border-l-4 border-primary pl-2">Pain Points Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Pain Points Title</label>
            <input type="text" name="pain_points_title" defaultValue={initialConfig.pain_points_title} required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pain Points List</label>
            <div className="space-y-2">
              {painPoints.map((text, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-rose-500 font-bold">✗</span>
                  <input type="text" value={text} onChange={(e) => updatePainPoint(idx, e.target.value)}
                    placeholder="Enter pain point text" required
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md sm:text-sm text-gray-900 bg-white" />
                  <button type="button" onClick={() => removePainPoint(idx)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider px-2 py-1">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addPainPoint}
                className="mt-2 text-primary font-bold text-xs uppercase tracking-wider hover:underline">+ Add Pain Point</button>
            </div>
          </div>
        </div>
      </div>

      {/* Standards Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm border-l-4 border-primary pl-2">The Standard Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Standard Title</label>
            <input type="text" name="standard_title" defaultValue={initialConfig.standard_title} required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Standard Description</label>
            <textarea name="standard_description" defaultValue={initialConfig.standard_description} rows={3} required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Standard Features List</label>
            <div className="space-y-2">
              {standardItems.map((text, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-primary font-bold">✓</span>
                  <input type="text" value={text} onChange={(e) => updateStandardItem(idx, e.target.value)}
                    placeholder="Enter standard feature" required
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md sm:text-sm text-gray-900 bg-white" />
                  <button type="button" onClick={() => removeStandardItem(idx)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider px-2 py-1">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addStandardItem}
                className="mt-2 text-primary font-bold text-xs uppercase tracking-wider hover:underline">+ Add Standard Feature</button>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm border-l-4 border-primary pl-2">About Us Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">About Title</label>
            <input type="text" name="about_title" defaultValue={initialConfig.about_title} required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">About Description</label>
            <textarea name="about_description" defaultValue={initialConfig.about_description} rows={4} required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">About Highlights List</label>
            <div className="space-y-2">
              {aboutFeatures.map((text, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-primary font-bold">✓</span>
                  <input type="text" value={text} onChange={(e) => updateAboutFeature(idx, e.target.value)}
                    placeholder="Enter highlight feature" required
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md sm:text-sm text-gray-900 bg-white" />
                  <button type="button" onClick={() => removeAboutFeature(idx)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider px-2 py-1">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addAboutFeature}
                className="mt-2 text-primary font-bold text-xs uppercase tracking-wider hover:underline">+ Add Highlight Feature</button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Integrations Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm border-l-4 border-primary pl-2">Contact & Integration Links</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Main Phone Number</label>
            <input type="text" name="phone" defaultValue={initialConfig.phone || ''}
              placeholder="e.g. 651-706-9995"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
            <p className="mt-1 text-xs text-gray-500">This number powers the "Call Us" button and header.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">WhatsApp Override Number (Optional)</label>
            <input type="text" name="whatsapp_number" defaultValue={initialConfig.whatsapp_number || ''}
              placeholder="e.g. +16517069995"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
            <p className="mt-1 text-xs text-gray-500">If provided, the WhatsApp button will use this instead of the Main Phone Number.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" name="email" defaultValue={initialConfig.email || ''}
              placeholder="e.g. info@optumcarcare.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Physical Address</label>
            <input type="text" name="address" defaultValue={initialConfig.address || ''}
              placeholder="e.g. 726, 9th Main Hongasandra GB Palya Rd..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Google Reviews URL</label>
            <input type="url" name="google_review_link" defaultValue={initialConfig.google_review_link || ''}
              placeholder="https://search.google.com/local/writereview?placeid=..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
            <p className="mt-1 text-xs text-gray-500">The link users are taken to when they click the floating Google Reviews badge.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Google Review Rating (e.g., 5.0)</label>
            <input type="text" name="review_rating" defaultValue={initialConfig.review_rating || ''}
              placeholder="5.0"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Google Review Count (e.g., 205)</label>
            <input type="text" name="review_count" defaultValue={initialConfig.review_count || ''}
              placeholder="205"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
        </div>
      </div>

      {/* OptumCarCare Hours Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm border-l-4 border-primary pl-2">Working Hours</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Monday - Friday Hours</label>
            <input type="text" name="working_hours_mon_fri" defaultValue={initialConfig.working_hours_mon_fri || ''}
              placeholder="e.g. 10:00 AM to 6:00 PM (Appointment Only)"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Saturday Hours</label>
            <input type="text" name="working_hours_sat" defaultValue={initialConfig.working_hours_sat || ''}
              placeholder="e.g. 11:00 AM to 2:00 PM (Appointment Only)"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sunday Hours</label>
            <input type="text" name="working_hours_sun" defaultValue={initialConfig.working_hours_sun || ''}
              placeholder="e.g. Closed"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
        </div>
      </div>

      {/* SEO & Digital Marketing Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm border-l-4 border-primary pl-2">SEO & Digital Marketing (Meta Tags)</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">SEO Page Title (meta_title)</label>
            <input type="text" name="meta_title" defaultValue={initialConfig.meta_title || ''}
              placeholder="e.g. Optum Car Care | Premium Automotive Detailing Bengaluru"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SEO Meta Description</label>
            <textarea name="meta_description" defaultValue={initialConfig.meta_description || ''} rows={3}
              placeholder="Enter a compelling 150-160 character description for search results..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SEO Meta Keywords</label>
            <input type="text" name="meta_keywords" defaultValue={initialConfig.meta_keywords || ''}
              placeholder="e.g. car detailing, paint protection film, ceramic coating Bengaluru"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-900" />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button type="submit" disabled={loading}
          className="bg-primary hover:bg-yellow-400 text-black font-bold uppercase tracking-widest px-8 py-3 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 text-sm">
          {loading ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
