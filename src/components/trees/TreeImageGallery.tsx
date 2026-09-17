'use client';

import Image from 'next/image';
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Camera, Calendar, User } from 'lucide-react';
import type { TreeImage } from '@prisma/client';
import { formatDate } from '@/lib/utils';

const IMAGE_TYPE_LABELS: Record<string, string> = {
  full_tree: 'Full Tree',
  leaf: 'Leaf',
  flower: 'Flower',
  fruit: 'Fruit',
  bark: 'Bark',
  seed: 'Seed',
  branch: 'Branch',
  variety: 'Variety',
};

const IMAGE_TYPE_COLORS: Record<string, string> = {
  full_tree: 'bg-forest-100 text-forest-700 dark:bg-forest-900/30 dark:text-forest-400',
  leaf:      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  flower:    'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  fruit:     'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  bark:      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  seed:      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  branch:    'bg-earth-100 text-earth-700 dark:bg-earth-900/30 dark:text-earth-400',
  variety:   'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

interface TreeImageGalleryProps {
  images: TreeImage[];
  treeName: string;
}

export function TreeImageGallery({ images, treeName }: TreeImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeType, setActiveType] = useState<string>('all');

  if (!images || images.length === 0) {
    return (
      <section id="gallery" aria-label={`${treeName} Image Gallery`}>
        <div className="premium-card p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-forest-600 dark:text-forest-400" />
              Image Gallery
              <span className="text-sm font-normal text-gray-400 ml-1">(0 photos)</span>
            </h3>
          </div>
          <div className="py-8 text-center bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
            <Camera className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">No photos added to this gallery yet.</p>
            <a href="/contribute" className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5">
              Contribute Photos
            </a>
          </div>
        </div>
      </section>
    );
  }

  // Collect unique types for filter tabs
  const types = ['all', ...Array.from(new Set(images.map((i) => i.type)))];

  const filtered = activeType === 'all'
    ? images
    : images.filter((i) => i.type === activeType);

  const prev = () => setLightboxIndex((i) => (i !== null ? Math.max(0, i - 1) : null));
  const next = () => setLightboxIndex((i) => (i !== null ? Math.min(filtered.length - 1, i + 1) : null));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape') setLightboxIndex(null);
  };

  return (
    <section id="gallery" aria-label={`${treeName} Image Gallery`}>
      <div className="premium-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-forest-600 dark:text-forest-400" />
            Image Gallery
            <span className="text-sm font-normal text-gray-400 ml-1">({images.length} photos)</span>
          </h3>

          {/* Type filter tabs */}
          {types.length > 2 && (
            <div className="flex gap-1.5 flex-wrap justify-end">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all ${
                    activeType === type
                      ? 'bg-forest-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {type === 'all' ? 'All' : IMAGE_TYPE_LABELS[type] ?? type}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((img, idx) => (
            <button
              key={img.id}
              id={`gallery-img-${img.id}`}
              onClick={() => setLightboxIndex(idx)}
              className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-forest-500"
              aria-label={`Open ${img.altText || img.type} image`}
            >
              <Image
                src={img.url}
                alt={img.altText || `${treeName} — ${img.type}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-400"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              </div>
              {/* Type badge */}
              <span className={`absolute top-1.5 left-1.5 text-[10px] px-1.5 py-0.5 rounded-md font-medium ${IMAGE_TYPE_COLORS[img.type] ?? 'bg-gray-100 text-gray-600'}`}>
                {IMAGE_TYPE_LABELS[img.type] ?? img.type}
              </span>
              {img.isPrimary && (
                <span className="absolute top-1.5 right-1.5 text-[10px] px-1.5 py-0.5 rounded-md font-medium bg-forest-600 text-white">
                  Primary
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev */}
          {lightboxIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 text-white/70 hover:text-white p-2 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Next */}
          {lightboxIndex < filtered.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 text-white/70 hover:text-white p-2 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-4xl max-h-[80vh] w-full mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filtered[lightboxIndex].url}
              alt={filtered[lightboxIndex].altText || treeName}
              width={1200}
              height={900}
              className="object-contain w-full max-h-[70vh] rounded-lg"
            />

            {/* Caption bar */}
            <div className="mt-3 text-center space-y-1">
              {filtered[lightboxIndex].caption && (
                <p className="text-white/90 text-sm font-medium">
                  {filtered[lightboxIndex].caption}
                </p>
              )}
              <div className="flex items-center justify-center gap-4 text-white/50 text-xs">
                <span className={`px-2 py-0.5 rounded-md text-xs ${IMAGE_TYPE_COLORS[filtered[lightboxIndex].type] ?? ''}`}>
                  {IMAGE_TYPE_LABELS[filtered[lightboxIndex].type] ?? filtered[lightboxIndex].type}
                </span>
                {(filtered[lightboxIndex] as TreeImage & { uploadedByName?: string }).uploadedByName && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {(filtered[lightboxIndex] as TreeImage & { uploadedByName?: string }).uploadedByName}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(filtered[lightboxIndex].createdAt.toString())}
                </span>
                <span>{lightboxIndex + 1} / {filtered.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
