'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  ChevronRight, MapPin, Calendar, Ruler, TreePine, Flower2,
  Apple, Leaf, BookOpen, Globe, Heart, Shield, ArrowRight,
  ExternalLink, X, ChevronLeft, Camera, User, ShieldCheck
} from 'lucide-react';
import type { TreeWithRelations, TreeCardData, FruitInfo, FlowerInfo } from '@/types';
import { FeedbackForm } from './FeedbackForm';
import { AuditTimeline } from './AuditTimeline';
import { TreeImageGallery } from './TreeImageGallery';

interface TreeDetailProps {
  tree: TreeWithRelations;
  relatedTrees: TreeCardData[];
}

export function TreeDetailContent({ tree, relatedTrees }: TreeDetailProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const primaryImage = tree.images?.find(img => img.isPrimary) || tree.images?.[0];
  const categoryName = tree.categories?.[0]?.category?.name;
  const fruitInfo = tree.fruitInfo as FruitInfo | null;
  const flowerInfo = tree.flowerInfo as FlowerInfo | null;

  const varietyImages: (typeof tree.images)[number][] = tree.varieties?.flatMap(v => v.images.map(img => ({
    id: img.id,
    treeId: tree.id,
    url: img.url,
    type: 'variety',
    altText: `${v.name} variety`,
    caption: null,
    uploadedByName: null,
    isPrimary: false,
    sortOrder: 99,
    createdAt: v.createdAt,
  }))) || [];

  const allGalleryImages = [...(tree.images || []), ...varietyImages];
  const createdByName = typeof tree.createdByName === 'string' ? tree.createdByName : null;
  const isAdmin = !createdByName || createdByName.toLowerCase() === 'admin';
  const authorName = isAdmin ? 'Admin' : createdByName;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
        <div className="section-container py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/trees" className="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">Trees</Link>
            {categoryName && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link
                  href={`/trees?category=${tree.categories[0]?.category?.slug}`}
                  className="hover:text-forest-600 dark:hover:text-forest-400 transition-colors"
                >
                  {categoryName}
                </Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 dark:text-white font-medium">{tree.englishName}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="section-container py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="space-y-4">
            <div
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer group shadow-sm"
              onClick={() => allGalleryImages.length > 0 && openLightbox(0)}
            >
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.altText || tree.englishName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <TreePine className="w-24 h-24" />
                </div>
              )}

              {/* Prominent Gallery Button on Image */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (allGalleryImages.length > 0) openLightbox(0);
                  else {
                    const el = document.getElementById('gallery');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/70 hover:bg-black/85 text-white text-xs font-semibold backdrop-blur-md transition-all shadow-lg hover:scale-105"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                View Gallery ({allGalleryImages.length})
              </button>
            </div>

            {/* Thumbnail gallery */}
            {allGalleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {allGalleryImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => openLightbox(idx)}
                    className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 border-transparent hover:border-forest-500 transition-all"
                  >
                    <Image
                      src={img.url}
                      alt={img.altText || `${tree.englishName} ${img.type}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tree.categories?.map(({ category }) => (
                <Link
                  key={category.id}
                  href={`/trees?category=${category.slug}`}
                  className="badge-green text-xs"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {/* Names */}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
              {tree.banglaName}
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-1">
              {tree.englishName}
            </h2>
            <p className="text-lg italic text-forest-600 dark:text-forest-400 mb-4">
              {tree.scientificName}
            </p>

            {/* Creator Attribution: Added by */}
            <div className="flex items-center gap-2 mb-6 py-2 px-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 w-fit text-xs">
              <User className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">Added by:</span>
              {isAdmin ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-forest-50 dark:bg-forest-900/40 text-forest-700 dark:text-forest-300 font-semibold text-xs border border-forest-200 dark:border-forest-800/50">
                  <ShieldCheck className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
                  Admin
                </span>
              ) : (
                <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                  {authorName}
                </span>
              )}
            </div>

            {/* Quick Facts */}
            <div className="premium-card p-5 mb-6">
              <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Quick Facts
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {tree.family && (
                  <div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">Family</span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white italic">{tree.family}</p>
                  </div>
                )}
                {tree.kingdom && (
                  <div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">Kingdom</span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{tree.kingdom}</p>
                  </div>
                )}
                {tree.height && (
                  <div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">Average Height</span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{tree.height}</p>
                  </div>
                )}
                {tree.lifespan && (
                  <div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">Lifespan</span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{tree.lifespan}</p>
                  </div>
                )}
                <div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">Fruit</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{tree.hasFruit ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">Flower</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{tree.hasFlower ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Jump Bar */}
      <div className="section-container pb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium scrollbar-hide">
          <a
            href="#overview"
            className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-forest-50 hover:text-forest-700 dark:hover:bg-forest-950/40 dark:hover:text-forest-400 transition-colors whitespace-nowrap"
          >
            Overview
          </a>
          <a
            href="#taxonomy"
            className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-forest-50 hover:text-forest-700 dark:hover:bg-forest-950/40 dark:hover:text-forest-400 transition-colors whitespace-nowrap"
          >
            Taxonomy
          </a>
          <a
            href="#gallery"
            className="px-3.5 py-2 rounded-xl bg-forest-100 dark:bg-forest-900/40 text-forest-800 dark:text-forest-300 hover:bg-forest-200 dark:hover:bg-forest-800/60 transition-colors inline-flex items-center gap-1.5 font-semibold whitespace-nowrap"
          >
            <Camera className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
            Image Gallery ({allGalleryImages.length})
          </a>
          <a
            href="#feedback"
            className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-forest-50 hover:text-forest-700 dark:hover:bg-forest-950/40 dark:hover:text-forest-400 transition-colors whitespace-nowrap"
          >
            Feedback & Suggest Edits
          </a>
        </div>
      </div>

      {/* Taxonomy */}
      {(tree.kingdom || tree.phylum || tree.taxClass || tree.order || tree.family || tree.genus || tree.species) && (
        <section id="taxonomy" className="section-container pb-8 scroll-mt-20">
          <div className="premium-card p-6 md:p-8">
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-forest-600 dark:text-forest-400" />
              Taxonomy
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Kingdom', value: tree.kingdom },
                { label: 'Phylum', value: tree.phylum },
                { label: 'Class', value: tree.taxClass },
                { label: 'Order', value: tree.order },
                { label: 'Family', value: tree.family },
                { label: 'Genus', value: tree.genus },
                { label: 'Species', value: tree.species },
              ].filter(t => t.value).map((t, idx, arr) => (
                <div key={t.label} className="flex items-center gap-3">
                  <div className="text-center">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">
                      {t.label}
                    </span>
                    <span className="px-4 py-2 bg-forest-50 dark:bg-forest-900/20 text-forest-700 dark:text-forest-400 rounded-xl text-sm font-medium inline-block italic">
                      {t.value}
                    </span>
                  </div>
                  {idx < arr.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Description & Details */}
      <div id="overview" className="section-container pb-8 space-y-6 scroll-mt-20">
        {tree.description && (
          <div className="premium-card p-6 md:p-8">
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4">Overview</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{tree.description}</p>
          </div>
        )}

        {tree.characteristics && (
          <div className="premium-card p-6 md:p-8">
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4">Physical Characteristics</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{tree.characteristics}</p>
          </div>
        )}

        {(tree.habitat || tree.distribution) && (
          <div className="premium-card p-6 md:p-8">
            {tree.habitat && (
              <div className="mb-6">
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                  Habitat
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{tree.habitat}</p>
              </div>
            )}
            {tree.distribution && (
              <div>
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                  Geographic Distribution
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{tree.distribution}</p>
              </div>
            )}
          </div>
        )}

        {(tree.benefits || tree.uses) && (
          <div className="premium-card p-6 md:p-8">
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-forest-600 dark:text-forest-400" />
              Benefits & Uses
            </h3>
            {tree.benefits && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Benefits</h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{tree.benefits}</p>
              </div>
            )}
            {tree.uses && (
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Uses</h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{tree.uses}</p>
              </div>
            )}
            {tree.hasMedicinalUse && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800/30">
                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                  ⚠️ Information about medicinal or traditional uses is provided for educational purposes only and should not be considered medical advice. Consult a qualified healthcare professional.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Fruit Info */}
        {fruitInfo && Object.values(fruitInfo).some(v => v) && (
          <div className="premium-card p-6 md:p-8">
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Apple className="w-5 h-5 text-forest-600 dark:text-forest-400" />
              Fruit
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {fruitInfo.name && <div><span className="text-xs text-gray-400">Name</span><p className="text-sm text-gray-700 dark:text-gray-300">{fruitInfo.name}</p></div>}
              {fruitInfo.taste && <div><span className="text-xs text-gray-400">Taste</span><p className="text-sm text-gray-700 dark:text-gray-300">{fruitInfo.taste}</p></div>}
              {fruitInfo.season && <div><span className="text-xs text-gray-400">Season</span><p className="text-sm text-gray-700 dark:text-gray-300">{fruitInfo.season}</p></div>}
            </div>
            {fruitInfo.description && <p className="text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">{fruitInfo.description}</p>}
          </div>
        )}

        {/* Flower Info */}
        {flowerInfo && Object.values(flowerInfo).some(v => v) && (
          <div className="premium-card p-6 md:p-8">
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Flower2 className="w-5 h-5 text-forest-600 dark:text-forest-400" />
              Flower
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {flowerInfo.name && <div><span className="text-xs text-gray-400">Name</span><p className="text-sm text-gray-700 dark:text-gray-300">{flowerInfo.name}</p></div>}
              {flowerInfo.color && <div><span className="text-xs text-gray-400">Color</span><p className="text-sm text-gray-700 dark:text-gray-300">{flowerInfo.color}</p></div>}
              {flowerInfo.season && <div><span className="text-xs text-gray-400">Season</span><p className="text-sm text-gray-700 dark:text-gray-300">{flowerInfo.season}</p></div>}
            </div>
            {flowerInfo.description && <p className="text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">{flowerInfo.description}</p>}
          </div>
        )}

        {/* Varieties */}
        {tree.varieties && tree.varieties.length > 0 && (
          <div className="premium-card p-6 md:p-8">
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-forest-600 dark:text-forest-400" />
              Varieties ({tree.varieties.length})
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {tree.varieties.map((variety) => (
                <div key={variety.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{variety.name}</h4>
                  {variety.banglaName && <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{variety.banglaName}</p>}
                  {variety.description && <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{variety.description}</p>}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {variety.origin && <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">{variety.origin}</span>}
                    {variety.season && <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-md text-green-700 dark:text-green-400">{variety.season}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sources */}
        {tree.sources && (
          <div className="premium-card p-6 md:p-8">
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-forest-600 dark:text-forest-400" />
              Sources & References
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">{tree.sources}</p>
          </div>
        )}
      </div>

      {/* ── Image Gallery ── */}
      <div id="gallery" className="section-container pb-8 scroll-mt-20">
        <TreeImageGallery images={allGalleryImages} treeName={tree.englishName} />
      </div>

      {/* ── Feedback / Correction ── */}
      <div id="feedback" className="section-container pb-8 scroll-mt-20">
        <FeedbackForm treeId={tree.id} treeName={`${tree.banglaName} (${tree.englishName})`} />
      </div>

      {/* ── Audit / Activity History ── */}
      <div className="section-container pb-8">
        <AuditTimeline treeSlug={tree.slug} />
      </div>

      {/* Related Trees */}
      {relatedTrees.length > 0 && (
        <section className="section-container pb-16">
          <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">
            You May Also Like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedTrees.map((t) => (
              <Link
                key={t.id}
                href={`/trees/${t.slug}`}
                className="premium-card overflow-hidden group"
              >
                <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800">
                  {t.images?.[0] && (
                    <Image
                      src={t.images[0].url}
                      alt={t.images[0].altText || t.englishName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{tree.banglaName !== t.banglaName ? t.banglaName : t.englishName}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">{t.scientificName}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxOpen && allGalleryImages.length > 0 && allGalleryImages[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {allGalleryImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(Math.max(0, lightboxIndex - 1)); }}
                className="absolute left-4 text-white/80 hover:text-white p-2"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(Math.min(allGalleryImages.length - 1, lightboxIndex + 1)); }}
                className="absolute right-4 text-white/80 hover:text-white p-2"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div className="relative max-w-4xl max-h-[85vh] w-full mx-4" onClick={e => e.stopPropagation()}>
            <Image
              src={allGalleryImages[lightboxIndex].url}
              alt={allGalleryImages[lightboxIndex].altText || tree.englishName}
              width={1200}
              height={800}
              className="object-contain w-full h-full rounded-lg"
            />
            <div className="text-center mt-3 text-white/70 text-sm">
              {lightboxIndex + 1} / {allGalleryImages.length}
              {allGalleryImages[lightboxIndex].type !== 'full_tree' && (
                <span className="ml-2 capitalize">({allGalleryImages[lightboxIndex].type.replace('_', ' ')})</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
