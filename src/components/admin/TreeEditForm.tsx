'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, AlertCircle, CheckCircle, Camera, Upload, Trash2, Star, Plus } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface TreeImage {
  id: string;
  url: string;
  type: string;
  altText?: string | null;
  isPrimary?: boolean;
}

interface TreeData {
  id: string;
  banglaName: string;
  englishName: string;
  scientificName: string;
  commonName: string;
  description: string;
  characteristics: string;
  habitat: string;
  distribution: string;
  height: string;
  lifespan: string;
  bark: string;
  leaves: string;
  benefits: string;
  uses: string;
  environmentalImportance: string;
  culturalImportance: string;
  kingdom: string;
  phylum: string;
  taxClass: string;
  order: string;
  family: string;
  genus: string;
  species: string;
  sources: string;
  published: boolean;
  featured: boolean;
  hasFruit: boolean;
  hasFlower: boolean;
  isNative: boolean;
  hasMedicinalUse: boolean;
  categories: { category: Category }[];
  images?: TreeImage[];
}

interface Props {
  tree: TreeData;
  allCategories: Category[];
}

const SECTION_CLASS = 'premium-card p-6 mb-6';
const LABEL_CLASS = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';
const INPUT_CLASS =
  'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition';
const TEXTAREA_CLASS = INPUT_CLASS + ' resize-none';

export function TreeEditForm({ tree, allCategories }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [reason, setReason] = useState('');

  // Images state & upload handling
  const [images, setImages] = useState<TreeImage[]>(tree.images ?? []);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadType, setUploadType] = useState('full_tree');
  const [uploadPrimary, setUploadPrimary] = useState(images.length === 0);
  const [imageMsg, setImageMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    banglaName: tree.banglaName ?? '',
    englishName: tree.englishName ?? '',
    scientificName: tree.scientificName ?? '',
    commonName: tree.commonName ?? '',
    description: tree.description ?? '',
    characteristics: tree.characteristics ?? '',
    habitat: tree.habitat ?? '',
    distribution: tree.distribution ?? '',
    height: tree.height ?? '',
    lifespan: tree.lifespan ?? '',
    bark: tree.bark ?? '',
    leaves: tree.leaves ?? '',
    benefits: tree.benefits ?? '',
    uses: tree.uses ?? '',
    environmentalImportance: tree.environmentalImportance ?? '',
    culturalImportance: tree.culturalImportance ?? '',
    kingdom: tree.kingdom ?? '',
    phylum: tree.phylum ?? '',
    taxClass: tree.taxClass ?? '',
    order: tree.order ?? '',
    family: tree.family ?? '',
    genus: tree.genus ?? '',
    species: tree.species ?? '',
    sources: tree.sources ?? '',
    published: tree.published ?? false,
    featured: tree.featured ?? false,
    hasFruit: tree.hasFruit ?? false,
    hasFlower: tree.hasFlower ?? false,
    isNative: tree.isNative ?? false,
    hasMedicinalUse: tree.hasMedicinalUse ?? false,
  });

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    tree.categories.map((c) => c.category.id)
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function toggleCategory(id: string) {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  // Upload a new image
  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setImageMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', uploadType);
      formData.append('altText', form.englishName || form.banglaName || 'Tree Photo');
      formData.append('isPrimary', String(uploadPrimary));

      const res = await fetch(`/api/admin/trees/${tree.id}/images`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload photo');
      }

      // Update local images list
      if (uploadPrimary) {
        setImages((prev) => [
          data.data,
          ...prev.map((img) => ({ ...img, isPrimary: false })),
        ]);
      } else {
        setImages((prev) => [...prev, data.data]);
      }

      setImageMsg({ type: 'success', text: 'Photo uploaded successfully!' });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setImageMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error uploading image',
      });
    } finally {
      setUploadingImage(false);
    }
  }

  // Set image as primary
  async function handleSetPrimary(imageId: string) {
    setImageMsg(null);
    try {
      const res = await fetch(`/api/admin/trees/${tree.id}/images`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, isPrimary: true }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to set primary');
      }

      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          isPrimary: img.id === imageId,
        }))
      );
      setImageMsg({ type: 'success', text: 'Primary image updated.' });
    } catch (err) {
      setImageMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to set primary',
      });
    }
  }

  // Delete an image
  async function handleDeleteImage(imageId: string) {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    setImageMsg(null);
    try {
      const res = await fetch(`/api/admin/trees/${tree.id}/images?imageId=${imageId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete image');
      }

      setImages((prev) => prev.filter((img) => img.id !== imageId));
      setImageMsg({ type: 'success', text: 'Image removed.' });
    } catch (err) {
      setImageMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to delete image',
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus('idle');

    try {
      const res = await fetch(`/api/admin/trees/${tree.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, categoryIds: selectedCategoryIds, reason }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? 'Update failed');
      }

      setStatus('success');
      setTimeout(() => router.push('/admin/trees'), 1200);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      {/* Status Banner */}
      {status === 'success' && (
        <div className="flex items-center gap-2 mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          Tree updated successfully! Redirecting…
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Basic Info */}
      <div className={SECTION_CLASS}>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Bangla Name', name: 'banglaName' },
            { label: 'English Name', name: 'englishName' },
            { label: 'Scientific Name', name: 'scientificName' },
            { label: 'Common Name', name: 'commonName' },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className={LABEL_CLASS}>{label}</label>
              <input
                type="text"
                name={name}
                value={(form as unknown as Record<string, string>)[name]}
                onChange={handleChange}
                className={INPUT_CLASS}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className={SECTION_CLASS}>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Description & Details</h2>
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: 'Description', name: 'description', rows: 4 },
            { label: 'Characteristics', name: 'characteristics', rows: 3 },
            { label: 'Habitat', name: 'habitat', rows: 2 },
            { label: 'Distribution', name: 'distribution', rows: 2 },
            { label: 'Bark', name: 'bark', rows: 2 },
            { label: 'Leaves', name: 'leaves', rows: 2 },
          ].map(({ label, name, rows }) => (
            <div key={name}>
              <label className={LABEL_CLASS}>{label}</label>
              <textarea
                name={name}
                rows={rows}
                value={(form as unknown as Record<string, string>)[name]}
                onChange={handleChange}
                className={TEXTAREA_CLASS}
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLASS}>Height</label>
              <input type="text" name="height" value={form.height} onChange={handleChange} className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Lifespan</label>
              <input type="text" name="lifespan" value={form.lifespan} onChange={handleChange} className={INPUT_CLASS} />
            </div>
          </div>
        </div>
      </div>

      {/* Uses & Importance */}
      <div className={SECTION_CLASS}>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Uses & Importance</h2>
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: 'Benefits', name: 'benefits', rows: 2 },
            { label: 'Uses', name: 'uses', rows: 2 },
            { label: 'Environmental Importance', name: 'environmentalImportance', rows: 2 },
            { label: 'Cultural Importance', name: 'culturalImportance', rows: 2 },
          ].map(({ label, name, rows }) => (
            <div key={name}>
              <label className={LABEL_CLASS}>{label}</label>
              <textarea
                name={name}
                rows={rows}
                value={(form as unknown as Record<string, string>)[name]}
                onChange={handleChange}
                className={TEXTAREA_CLASS}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Taxonomy */}
      <div className={SECTION_CLASS}>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Taxonomy</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['kingdom', 'phylum', 'taxClass', 'order', 'family', 'genus', 'species'].map((name) => (
            <div key={name}>
              <label className={LABEL_CLASS}>{name.charAt(0).toUpperCase() + name.slice(1)}</label>
              <input
                type="text"
                name={name}
                value={(form as unknown as Record<string, string>)[name]}
                onChange={handleChange}
                className={INPUT_CLASS}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className={SECTION_CLASS}>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategoryIds.includes(cat.id)
                  ? 'bg-forest-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Flags */}
      <div className={SECTION_CLASS}>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Properties & Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Published', name: 'published' },
            { label: 'Featured', name: 'featured' },
            { label: 'Has Fruit', name: 'hasFruit' },
            { label: 'Has Flower', name: 'hasFlower' },
            { label: 'Native Species', name: 'isNative' },
            { label: 'Medicinal Use', name: 'hasMedicinalUse' },
          ].map(({ label, name }) => (
            <label key={name} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                name={name}
                checked={(form as unknown as Record<string, boolean>)[name]}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-forest-600 cursor-pointer"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className={SECTION_CLASS}>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Sources</h2>
        <textarea
          name="sources"
          rows={2}
          value={form.sources}
          onChange={handleChange}
          placeholder="References, Wikipedia links, etc."
          className={TEXTAREA_CLASS}
        />
      </div>

      {/* Image Gallery */}
      <div className={SECTION_CLASS}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-forest-600 dark:text-forest-400" />
            Tree Photos & Gallery ({images.length})
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Supports JPG, PNG, WEBP (Max 5MB)
          </span>
        </div>

        {/* Image Status Message */}
        {imageMsg && (
          <div
            className={`flex items-center gap-2 mb-4 p-3 rounded-lg text-sm ${
              imageMsg.type === 'success'
                ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-900'
                : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900'
            }`}
          >
            {imageMsg.type === 'success' ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{imageMsg.text}</span>
          </div>
        )}

        {/* Upload Control Card */}
        <div className="p-4 mb-6 rounded-xl border border-dashed border-forest-300 dark:border-forest-800 bg-forest-50/50 dark:bg-forest-950/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 w-full sm:w-auto">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Upload New Photo
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                >
                  <option value="full_tree">Full Tree</option>
                  <option value="leaf">Leaf</option>
                  <option value="flower">Flower</option>
                  <option value="bark">Bark</option>
                  <option value="fruit">Fruit</option>
                  <option value="branch">Branch</option>
                </select>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={uploadPrimary}
                    onChange={(e) => setUploadPrimary(e.target.checked)}
                    className="w-3.5 h-3.5 rounded accent-forest-600 cursor-pointer"
                  />
                  Set as primary photo
                </label>
              </div>
            </div>

            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="btn-primary py-2 px-4 text-xs flex items-center gap-2 shadow-sm disabled:opacity-60"
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Select & Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Existing Images Grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className={`relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 group border transition-all ${
                  img.isPrimary
                    ? 'border-forest-500 ring-2 ring-forest-500/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.altText || 'Tree image'}
                  className="w-full h-full object-cover"
                />

                {/* Badges */}
                <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                  {img.isPrimary && (
                    <span className="bg-forest-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                      Primary
                    </span>
                  )}
                </div>

                <span className="absolute bottom-1.5 left-1.5 bg-black/70 backdrop-blur-sm text-white text-[9px] font-medium px-1.5 py-0.5 rounded capitalize">
                  {img.type.replace('_', ' ')}
                </span>

                {/* Actions overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!img.isPrimary && (
                    <button
                      type="button"
                      title="Set as Primary"
                      onClick={() => handleSetPrimary(img.id)}
                      className="p-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 text-amber-500 hover:bg-white dark:hover:bg-gray-800 transition shadow hover:scale-110"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    title="Delete Image"
                    onClick={() => handleDeleteImage(img.id)}
                    className="p-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 text-red-500 hover:bg-white dark:hover:bg-gray-800 transition shadow hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
            <Camera className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              No photos uploaded yet.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Upload leaf, bark, flower or full tree photos above.
            </p>
          </div>
        )}
      </div>

      {/* Audit Reason & Submit */}
      <div className={SECTION_CLASS}>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Audit Note (optional)</h2>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for this update (e.g. corrected scientific name)"
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex items-center gap-3 pb-8">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/trees')}
          className="px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
