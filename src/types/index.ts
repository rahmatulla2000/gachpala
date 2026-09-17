import type { Tree, TreeImage, Variety, VarietyImage, Category, Submission, SubmissionImage } from '@prisma/client';

// ──────────────────────────────────────────────
// Tree Types
// ──────────────────────────────────────────────

export type TreeWithRelations = Tree & {
  images: TreeImage[];
  varieties: (Variety & { images: VarietyImage[] })[];
  categories: { category: Category }[];
  createdByName?: string | null;
  updatedByName?: string | null;
};

export type TreeCardData = Pick<
  Tree,
  'id' | 'slug' | 'banglaName' | 'englishName' | 'scientificName' | 'commonName'
> & {
  createdByName?: string | null;
  images: Pick<TreeImage, 'url' | 'altText' | 'isPrimary'>[];
  categories: { category: Pick<Category, 'name' | 'slug'> }[];
};

export type TreeListParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  family?: string;
  genus?: string;
  kingdom?: string;
  phylum?: string;
  taxClass?: string;
  order?: string;
  species?: string;
  hasFruit?: boolean;
  hasFlower?: boolean;
  isNative?: boolean;
  hasMedicinalUse?: boolean;
  sort?: 'name_asc' | 'name_desc' | 'date_asc' | 'date_desc' | 'scientific';
};

export type TreeListResponse = {
  trees: TreeCardData[];
  total: number;
  page: number;
  totalPages: number;
};

// ──────────────────────────────────────────────
// Category Types
// ──────────────────────────────────────────────

export type CategoryWithCount = Category & {
  _count: { trees: number };
};

// ──────────────────────────────────────────────
// Submission Types
// ──────────────────────────────────────────────

export type SubmissionWithImages = Submission & {
  images: SubmissionImage[];
};

export type SubmissionFormData = {
  banglaName: string;
  englishName: string;
  commonName?: string;
  scientificName?: string;
  kingdom?: string;
  phylum?: string;
  taxClass?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
  description?: string;
  characteristics?: string;
  habitat?: string;
  distribution?: string;
  height?: string;
  lifespan?: string;
  benefits?: string;
  uses?: string;
  fruitInfo?: FruitInfo;
  flowerInfo?: FlowerInfo;
  contributorName?: string;
  contributorEmail?: string;
  source?: string;
  additionalNote?: string;
};

// ──────────────────────────────────────────────
// Fruit & Flower Types
// ──────────────────────────────────────────────

export type FruitInfo = {
  name?: string;
  description?: string;
  taste?: string;
  season?: string;
  uses?: string;
  nutrition?: string;
};

export type FlowerInfo = {
  name?: string;
  color?: string;
  season?: string;
  description?: string;
};

// ──────────────────────────────────────────────
// AI Detection Types
// ──────────────────────────────────────────────

export type DetectionPrediction = {
  scientificName: string;
  commonName: string;
  confidence: number;
  family?: string;
  genus?: string;
  species?: string;
};

export type DetectionResult = {
  predictions: DetectionPrediction[];
  matchedTree?: TreeWithRelations | null;
  provider: string;
  processingTime?: number;
};

export type DetectionProvider = {
  name: string;
  detect: (imageBuffer: Buffer, mimeType: string) => Promise<DetectionPrediction[]>;
};

// ──────────────────────────────────────────────
// Statistics Types
// ──────────────────────────────────────────────

export type PublicStats = {
  totalTrees: number;
  totalVarieties: number;
  totalCategories: number;
  approvedContributions: number;
};

export type AdminStats = PublicStats & {
  pendingSubmissions: number;
  rejectedSubmissions: number;
  totalImages: number;
  totalSubmissions: number;
  pendingFeedbacks: number;
};

// ──────────────────────────────────────────────
// Filter Options Types
// ──────────────────────────────────────────────

export type FilterOption = {
  value: string;
  label: string;
  count?: number;
};

export type FilterOptions = {
  categories: FilterOption[];
  families: FilterOption[];
  genera: FilterOption[];
  kingdoms: FilterOption[];
  phyla: FilterOption[];
  classes: FilterOption[];
  orders: FilterOption[];
  species: FilterOption[];
};

// ──────────────────────────────────────────────
// API Response Types
// ──────────────────────────────────────────────

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// ──────────────────────────────────────────────
// Image Types
// ──────────────────────────────────────────────

export const IMAGE_TYPES = [
  'full_tree',
  'leaf',
  'flower',
  'fruit',
  'bark',
  'seed',
  'branch',
  'variety',
] as const;

export type ImageType = typeof IMAGE_TYPES[number];

export const ALLOWED_IMAGE_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
