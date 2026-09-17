import { z } from 'zod';

// ──────────────────────────────────────────────
// Common Validators
// ──────────────────────────────────────────────

const sanitizeString = z.string().transform(val => val.replace(/[<>]/g, '').trim());

// ──────────────────────────────────────────────
// Submission Validation
// ──────────────────────────────────────────────

export const submissionSchema = z.object({
  banglaName: z.string().min(1, 'Bangla name is required').max(200),
  englishName: z.string().min(1, 'English name is required').max(200),
  commonName: z.string().max(200).optional().default(''),
  scientificName: z.string().max(200).optional().default(''),

  // Taxonomy
  kingdom: z.string().max(100).optional().default(''),
  phylum: z.string().max(100).optional().default(''),
  taxClass: z.string().max(100).optional().default(''),
  order: z.string().max(100).optional().default(''),
  family: z.string().max(100).optional().default(''),
  genus: z.string().max(100).optional().default(''),
  species: z.string().max(100).optional().default(''),

  // Details
  description: z.string().min(1, 'Tree details / description is required').max(10000),
  characteristics: z.string().max(5000).optional().default(''),
  habitat: z.string().max(5000).optional().default(''),
  distribution: z.string().max(5000).optional().default(''),
  height: z.string().max(200).optional().default(''),
  lifespan: z.string().max(200).optional().default(''),

  // Benefits
  benefits: z.string().max(5000).optional().default(''),
  uses: z.string().max(5000).optional().default(''),

  // Fruit (JSON)
  fruitInfo: z.object({
    name: z.string().max(200).optional(),
    description: z.string().max(5000).optional(),
    taste: z.string().max(500).optional(),
    season: z.string().max(200).optional(),
    uses: z.string().max(5000).optional(),
    nutrition: z.string().max(5000).optional(),
  }).optional(),

  // Flower (JSON)
  flowerInfo: z.object({
    name: z.string().max(200).optional(),
    color: z.string().max(200).optional(),
    season: z.string().max(200).optional(),
    description: z.string().max(5000).optional(),
  }).optional(),

  // Contributor
  contributorName: z.string().max(200).optional().transform(val => (val && val.trim()) ? val.trim() : 'Unknown'),
  contributorEmail: z.string().email('Invalid email').max(200).optional().or(z.literal('')),

  // Sources
  source: z.string().max(5000).optional().default(''),
  additionalNote: z.string().max(5000).optional().default(''),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

// ──────────────────────────────────────────────
// Tree Validation (Admin)
// ──────────────────────────────────────────────

export const treeSchema = z.object({
  banglaName: z.string().min(1, 'Bangla name is required').max(200),
  englishName: z.string().min(1, 'English name is required').max(200),
  commonName: z.string().max(200).optional().default(''),
  scientificName: z.string().min(1, 'Scientific name is required').max(200),

  kingdom: z.string().max(100).optional().default('Plantae'),
  phylum: z.string().max(100).optional().default(''),
  taxClass: z.string().max(100).optional().default(''),
  order: z.string().max(100).optional().default(''),
  family: z.string().max(100).optional().default(''),
  genus: z.string().max(100).optional().default(''),
  species: z.string().max(100).optional().default(''),

  description: z.string().max(10000).optional().default(''),
  characteristics: z.string().max(5000).optional().default(''),
  habitat: z.string().max(5000).optional().default(''),
  distribution: z.string().max(5000).optional().default(''),
  height: z.string().max(200).optional().default(''),
  lifespan: z.string().max(200).optional().default(''),
  bark: z.string().max(5000).optional().default(''),
  leaves: z.string().max(5000).optional().default(''),

  benefits: z.string().max(5000).optional().default(''),
  uses: z.string().max(5000).optional().default(''),
  environmentalImportance: z.string().max(5000).optional().default(''),
  culturalImportance: z.string().max(5000).optional().default(''),

  fruitInfo: z.any().optional(),
  flowerInfo: z.any().optional(),

  sources: z.string().max(5000).optional().default(''),

  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
  hasFruit: z.boolean().optional().default(false),
  hasFlower: z.boolean().optional().default(false),
  isNative: z.boolean().optional().default(false),
  hasMedicinalUse: z.boolean().optional().default(false),

  categoryIds: z.array(z.string()).optional().default([]),
});

export type TreeInput = z.infer<typeof treeSchema>;

// ──────────────────────────────────────────────
// Category Validation
// ──────────────────────────────────────────────

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(2000).optional().default(''),
  image: z.string().max(500).optional().default(''),
  icon: z.string().max(100).optional().default(''),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// ──────────────────────────────────────────────
// Variety Validation
// ──────────────────────────────────────────────

export const varietySchema = z.object({
  treeId: z.string().min(1, 'Tree is required'),
  name: z.string().min(1, 'Name is required').max(200),
  banglaName: z.string().max(200).optional().default(''),
  description: z.string().max(5000).optional().default(''),
  characteristics: z.string().max(5000).optional().default(''),
  origin: z.string().max(200).optional().default(''),
  region: z.string().max(200).optional().default(''),
  season: z.string().max(200).optional().default(''),
});

export type VarietyInput = z.infer<typeof varietySchema>;

// ──────────────────────────────────────────────
// Login Validation
// ──────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ──────────────────────────────────────────────
// Image Validation
// ──────────────────────────────────────────────

export const imageUploadSchema = z.object({
  type: z.enum(['full_tree', 'leaf', 'flower', 'fruit', 'bark', 'seed', 'branch', 'variety']),
  altText: z.string().max(500).optional().default(''),
  isPrimary: z.boolean().optional().default(false),
});

export type ImageUploadInput = z.infer<typeof imageUploadSchema>;
