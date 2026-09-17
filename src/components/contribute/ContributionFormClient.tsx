'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload, Send, CheckCircle, Loader2, ChevronDown, ChevronUp,
  X, ImagePlus
} from 'lucide-react';
import Image from 'next/image';

type FormSection = 'basic' | 'taxonomy' | 'details' | 'benefits' | 'fruit' | 'flower' | 'images' | 'contributor';

export function ContributionFormClient() {
  const [openSections, setOpenSections] = useState<Set<FormSection>>(new Set<FormSection>(['basic', 'details', 'images']));
  const [formData, setFormData] = useState<Record<string, string>>({
    banglaName: '', englishName: '', commonName: '', scientificName: '',
    kingdom: 'Plantae', phylum: '', taxClass: '', order: '', family: '', genus: '', species: '',
    description: '', characteristics: '', habitat: '', distribution: '', height: '', lifespan: '',
    benefits: '', uses: '',
    contributorName: '', contributorEmail: '', source: '', additionalNote: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const toggleSection = (section: FormSection) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      next.has(section) ? next.delete(section) : next.add(section);
      return next;
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 10,
    onDrop: (files) => {
      setImages(prev => [...prev, ...files].slice(0, 10));
      const previews = files.map(f => URL.createObjectURL(f));
      setImagePreviews(prev => [...prev, ...previews].slice(0, 10));
    },
  });

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.banglaName.trim() || !formData.englishName.trim()) {
      setError('Bangla name and English name are required.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Tree details (Description / Overview) is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val) fd.append(key, val);
      });
      images.forEach(img => fd.append('images', img));

      const res = await fetch('/api/contributions', { method: 'POST', body: fd });
      const data = await res.json();

      if (!data.success) throw new Error(data.error || 'Submission failed');
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Your submission could not be processed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="premium-card p-12 text-center">
        <CheckCircle className="w-16 h-16 text-forest-500 mx-auto mb-6" />
        <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Thank you for contributing to GachPala
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Your submission has been received and is waiting for administrator review.
        </p>
        <a href="/trees" className="btn-primary">Explore Trees</a>
      </div>
    );
  }

  const SectionHeader = ({ id, title, required }: { id: FormSection; title: string; required?: boolean }) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-4 text-left"
    >
      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        {title}
        {required && <span className="text-red-400 text-xs">Required</span>}
      </h3>
      {openSections.has(id) ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
    </button>
  );

  const Input = ({ label, field, required, placeholder, type = 'text' }: { label: string; field: string; required?: boolean; placeholder?: string; type?: string }) => (
    <div>
      <label className="form-label">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={formData[field] || ''}
        onChange={e => updateField(field, e.target.value)}
        className="input-field"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );

  const TextArea = ({ label, field, placeholder, rows = 3, required }: { label: string; field: string; placeholder?: string; rows?: number; required?: boolean }) => (
    <div>
      <label className="form-label">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <textarea
        value={formData[field] || ''}
        onChange={e => updateField(field, e.target.value)}
        className="input-field resize-y"
        placeholder={placeholder}
        rows={rows}
        required={required}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="premium-card overflow-hidden">
        <SectionHeader id="basic" title="Basic Information" required />
        {openSections.has('basic') && (
          <div className="px-4 pb-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Bangla Name" field="banglaName" required placeholder="বাংলা নাম" />
              <Input label="English Name" field="englishName" required placeholder="English Name" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Common Name" field="commonName" placeholder="Common name(s)" />
              <Input label="Scientific Name" field="scientificName" placeholder="e.g. Mangifera indica" />
            </div>
          </div>
        )}
      </div>

      {/* Taxonomy */}
      <div className="premium-card overflow-hidden">
        <SectionHeader id="taxonomy" title="Taxonomy" />
        {openSections.has('taxonomy') && (
          <div className="px-4 pb-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            <Input label="Kingdom" field="kingdom" placeholder="Plantae" />
            <Input label="Phylum" field="phylum" placeholder="Phylum" />
            <Input label="Class" field="taxClass" placeholder="Class" />
            <Input label="Order" field="order" placeholder="Order" />
            <Input label="Family" field="family" placeholder="Family" />
            <Input label="Genus" field="genus" placeholder="Genus" />
            <Input label="Species" field="species" placeholder="Species" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="premium-card overflow-hidden">
        <SectionHeader id="details" title="Tree Details" required />
        {openSections.has('details') && (
          <div className="px-4 pb-4 space-y-4">
            <TextArea label="Description / Overview" field="description" required placeholder="General description and details of the tree (Required)" rows={4} />
            <TextArea label="Characteristics" field="characteristics" placeholder="Physical characteristics" />
            <TextArea label="Habitat" field="habitat" placeholder="Where this tree is found" />
            <TextArea label="Distribution" field="distribution" placeholder="Geographic distribution" />
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Average Height" field="height" placeholder="e.g. 10-25 meters" />
              <Input label="Lifespan" field="lifespan" placeholder="e.g. 100+ years" />
            </div>
          </div>
        )}
      </div>

      {/* Benefits & Uses */}
      <div className="premium-card overflow-hidden">
        <SectionHeader id="benefits" title="Benefits & Uses" />
        {openSections.has('benefits') && (
          <div className="px-4 pb-4 space-y-4">
            <TextArea label="Benefits" field="benefits" placeholder="Environmental, nutritional, medicinal benefits" />
            <TextArea label="Uses" field="uses" placeholder="Commercial, cultural, traditional uses" />
          </div>
        )}
      </div>

      {/* Images */}
      <div className="premium-card overflow-hidden">
        <SectionHeader id="images" title="Images" />
        {openSections.has('images') && (
          <div className="px-4 pb-4">
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-forest-400 dark:hover:border-forest-600 transition-all"
            >
              <input {...getInputProps()} />
              <ImagePlus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Drop images here or click to upload (max 10)
              </p>
            </div>
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {imagePreviews.map((url, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden group">
                    <Image src={url} alt={`Upload ${idx + 1}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contributor Info */}
      <div className="premium-card overflow-hidden">
        <SectionHeader id="contributor" title="Your Information (Optional)" />
        {openSections.has('contributor') && (
          <div className="px-4 pb-4 space-y-4">
            <div>
              <Input label="Your Name" field="contributorName" placeholder="Leave blank to submit as 'Unknown'" />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Not mandatory. If you do not provide your name, the post author will be shown as &quot;Unknown&quot;.
              </p>
            </div>
            <Input label="Your Email" field="contributorEmail" placeholder="Optional" type="email" />
            <TextArea label="Sources / References" field="source" placeholder="Where did you get this information?" />
            <TextArea label="Additional Notes" field="additionalNote" placeholder="Anything else you'd like us to know" rows={2} />
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submit Contribution
          </>
        )}
      </button>
    </form>
  );
}
