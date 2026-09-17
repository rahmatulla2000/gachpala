'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import Link from 'next/link';
import {
  Upload, Camera, ScanLine, Loader2, AlertTriangle,
  TreePine, ArrowRight, X, Info, RefreshCw
} from 'lucide-react';
import { getConfidenceLevel } from '@/lib/utils';

type DetectionState = 'idle' | 'preview' | 'analyzing' | 'result' | 'error';

interface Prediction {
  scientificName: string;
  commonName: string;
  confidence: number;
  family?: string;
}

interface MatchedTree {
  id?: string;
  slug: string;
  banglaName: string;
  englishName: string;
  scientificName: string;
  description?: string;
  family?: string;
  habitat?: string;
  characteristics?: string;
  uses?: string;
  images?: { url: string }[];
}

export function DetectionClient() {
  const [state, setState] = useState<DetectionState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [matchedTree, setMatchedTree] = useState<MatchedTree | null>(null);
  const [provider, setProvider] = useState('');
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image (JPG, PNG, or WEBP).');
      setState('error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size is 10MB.');
      setState('error');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setState('preview');
    setError('');
    setPredictions([]);
    setMatchedTree(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    multiple: false,
  });

  const startDetection = async () => {
    if (!selectedFile) return;
    setState('analyzing');
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api/detection', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Detection failed');
      }

      setPredictions(data.data.predictions || []);
      setMatchedTree(data.data.matchedTree || null);
      setProvider(data.data.provider || '');
      setState('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tree identification is temporarily unavailable. Please try again later.');
      setState('error');
    }
  };

  const reset = () => {
    setState('idle');
    setSelectedFile(null);
    setPreviewUrl('');
    setPredictions([]);
    setMatchedTree(null);
    setError('');
  };

  return (
    <div className="section-container py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-forest-100 dark:bg-forest-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <ScanLine className="w-8 h-8 text-forest-600 dark:text-forest-400" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Identify a Tree with AI
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
            Upload a photo of a tree, leaf, flower, or bark for instant botanical identification.
          </p>
        </div>

        {/* Upload Zone (idle state) */}
        {state === 'idle' && (
          <div
            {...getRootProps()}
            className={`premium-card p-8 md:p-12 text-center cursor-pointer border-2 border-dashed transition-all ${
              isDragActive
                ? 'border-forest-500 bg-forest-50 dark:bg-forest-900/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-forest-400 dark:hover:border-forest-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="w-20 h-20 bg-forest-100 dark:bg-forest-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Upload className="w-10 h-10 text-forest-600 dark:text-forest-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {isDragActive ? 'Drop your image here' : 'Upload a Tree Image'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Drag & drop or click to select an image
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="badge-green text-xs">JPG</span>
              <span className="badge-green text-xs">PNG</span>
              <span className="badge-green text-xs">WEBP</span>
              <span className="text-xs text-gray-400">Max 10MB</span>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400 dark:text-gray-500">
              <Camera className="w-4 h-4" />
              <span>Or take a photo using your mobile camera</span>
            </div>
          </div>
        )}

        {/* Preview State */}
        {state === 'preview' && previewUrl && (
          <div className="premium-card overflow-hidden">
            <div className="relative aspect-[4/3]">
              <Image
                src={previewUrl}
                alt="Selected tree image"
                fill
                className="object-cover"
              />
              <button
                onClick={reset}
                className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 text-center">
              <button
                onClick={startDetection}
                className="btn-primary text-base px-8 py-4 group shadow-lg"
              >
                <ScanLine className="w-5 h-5" />
                Identify with AI
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Analyzing State */}
        {state === 'analyzing' && (
          <div className="premium-card p-12 text-center">
            <div className="w-20 h-20 bg-forest-100 dark:bg-forest-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Loader2 className="w-10 h-10 text-forest-600 dark:text-forest-400 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Analyzing your image...
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Our AI is scanning botanical traits and matching against our tree database.
            </p>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────── */}
        {/* CASE 1: MATCHED TREE FOUND IN DATABASE                     */}
        {/* ─────────────────────────────────────────────────────────── */}
        {state === 'result' && matchedTree && (
          <div className="space-y-6">
            {/* Matched Tree Hero Card */}
            <div className="premium-card overflow-hidden border-2 border-emerald-500/40 shadow-xl">
              <div className="relative aspect-[16/9] bg-forest-950">
                <Image
                  src={matchedTree.images?.[0]?.url || previewUrl}
                  alt={matchedTree.banglaName || matchedTree.englishName}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                
                {/* Confidence Badge */}
                {predictions[0] && (
                  <div className="absolute top-4 right-4 bg-emerald-600/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>{Math.round(predictions[0].confidence * 100)}% Match</span>
                  </div>
                )}

                {/* Tree Names on Image Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500 text-forest-950 text-xs font-bold mb-2">
                    ✅ Matched in Database
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold">
                    {matchedTree.banglaName}
                  </h2>
                  <p className="text-emerald-200 text-sm sm:text-base font-medium">
                    {matchedTree.englishName} ({matchedTree.scientificName})
                  </p>
                </div>
              </div>

              {/* Matched Tree Details */}
              <div className="p-6 sm:p-7 space-y-5">
                {/* Taxonomy Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4 border-b border-gray-200 dark:border-gray-800 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-400 block text-[11px] uppercase tracking-wider mb-0.5">Scientific Name</span>
                    <span className="font-semibold text-gray-900 dark:text-white italic">{matchedTree.scientificName}</span>
                  </div>
                  {matchedTree.family && (
                    <div>
                      <span className="text-gray-400 block text-[11px] uppercase tracking-wider mb-0.5">Family</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{matchedTree.family}</span>
                    </div>
                  )}
                  {matchedTree.habitat && (
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-gray-400 block text-[11px] uppercase tracking-wider mb-0.5">Habitat</span>
                      <span className="font-semibold text-gray-900 dark:text-white truncate block">{matchedTree.habitat}</span>
                    </div>
                  )}
                </div>

                {/* Description Snippet */}
                {matchedTree.description && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1.5">Description</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                      {matchedTree.description}
                    </p>
                  </div>
                )}

                {/* Primary CTA Button to Full Tree Profile */}
                <div className="pt-2">
                  <Link
                    href={`/trees/${matchedTree.slug}`}
                    className="btn-primary text-base w-full justify-center py-4 group shadow-lg"
                  >
                    <TreePine className="w-5 h-5" />
                    <span>View Complete Tree Profile (গাছের সম্পূর্ণ বিবরণ)</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Try Another Button */}
            <div className="text-center pt-2">
              <button onClick={reset} className="btn-outline">
                <RefreshCw className="w-4 h-4" />
                Identify Another Image
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────── */}
        {/* CASE 2: AI PREDICTION FOUND BUT NO DB PROFILE YET           */}
        {/* ─────────────────────────────────────────────────────────── */}
        {state === 'result' && !matchedTree && predictions.length > 0 && (
          <div className="space-y-6">
            <div className="premium-card overflow-hidden border-2 border-emerald-500/40 shadow-xl">
              <div className="relative aspect-[16/9] bg-forest-950">
                <Image
                  src={previewUrl}
                  alt={predictions[0].commonName || predictions[0].scientificName}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                <div className="absolute top-4 right-4 bg-emerald-600/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>{Math.round(predictions[0].confidence * 100)}% Match</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500 text-forest-950 text-xs font-bold mb-2">
                    🤖 AI Identified Tree
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold">
                    {predictions[0].commonName}
                  </h2>
                  <p className="text-emerald-200 text-sm sm:text-base font-medium italic">
                    {predictions[0].scientificName}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-7 space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4 border-b border-gray-200 dark:border-gray-800 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-400 block text-[11px] uppercase tracking-wider mb-0.5">Scientific Name</span>
                    <span className="font-semibold text-gray-900 dark:text-white italic">{predictions[0].scientificName}</span>
                  </div>
                  {predictions[0].family && (
                    <div>
                      <span className="text-gray-400 block text-[11px] uppercase tracking-wider mb-0.5">Family</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{predictions[0].family}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400 block text-[11px] uppercase tracking-wider mb-0.5">Confidence</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {Math.round(predictions[0].confidence * 100)}%
                    </span>
                  </div>
                </div>

                {/* Predictions ranking list if more than 1 */}
                {predictions.length > 1 && (
                  <div className="space-y-2">
                    <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                      Other Potential Matches
                    </h3>
                    <div className="space-y-2">
                      {predictions.slice(1).map((p, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 text-sm">
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">{p.commonName}</span>
                            <span className="text-xs text-gray-500 italic ml-2">({p.scientificName})</span>
                          </div>
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            {Math.round(p.confidence * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300">
                  <span>💡 গাছটি এআই মডেল দ্বারা সফলভাবে শনাক্ত হয়েছে। তবে ডাটাবেজে এখনো এর বিস্তারিত এনসাইক্লোপিডিয়া তথ্য যুক্ত করা হয়নি। আপনি চাইলে অবদান রাখতে পারেন।</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button onClick={reset} className="btn-primary w-full sm:w-auto px-6 py-3.5 text-sm">
                    <RefreshCw className="w-4 h-4" />
                    Identify Another Image
                  </button>
                  <Link href="/contribute" className="btn-outline w-full sm:w-auto px-6 py-3.5 text-sm hover:border-emerald-500">
                    Contribute Tree Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────── */}
        {/* CASE 3: NO RESULT / NO PREDICTIONS AT ALL                   */}
        {/* ─────────────────────────────────────────────────────────── */}
        {state === 'result' && !matchedTree && predictions.length === 0 && (
          <div className="premium-card p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                No Tree Identified (কোনো গাছ মেলেনি)
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                এআই মডেলের কনফিডেন্স ৪৫% এর কম হওয়ায় গাছটি নিশ্চিতভাবে শনাক্ত করা যায়নি। সঠিক ফলাফলের জন্য অনুগ্রহ করে ভালো আলোতে পাতা, ফুল বা ফলের একটি স্পষ্ট ছবি আপলোড করুন।
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 max-w-md mx-auto">
              <button
                onClick={reset}
                className="btn-primary w-full sm:w-auto px-6 py-3.5 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Try Another Image
              </button>
              <Link
                href="/contribute"
                className="btn-outline w-full sm:w-auto px-6 py-3.5 text-sm hover:border-emerald-500"
              >
                Contribute This Tree
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────── */}
        {/* CASE 3: ERROR STATE                                         */}
        {/* ─────────────────────────────────────────────────────────── */}
        {state === 'error' && (
          <div className="premium-card p-10 sm:p-12 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-700/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {error || 'Detection failed. Please try again.'}
            </h3>
            <button onClick={reset} className="btn-primary">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
