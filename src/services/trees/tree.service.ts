import prisma from '@/lib/prisma';
import { generateSlug, buildSearchFilter } from '@/lib/utils';
import type { TreeListParams, TreeListResponse, TreeCardData, TreeWithRelations } from '@/types';
import type { Prisma } from '@prisma/client';
import { createAuditLog, createAuditLogs } from '@/services/audit/audit.service';

// Fields that are tracked in the audit log when changed
const AUDITED_FIELDS: (keyof Prisma.TreeUpdateInput)[] = [
  'banglaName', 'englishName', 'commonName', 'scientificName',
  'kingdom', 'phylum', 'taxClass', 'order', 'family', 'genus', 'species',
  'description', 'characteristics', 'habitat', 'distribution',
  'height', 'lifespan', 'bark', 'leaves',
  'benefits', 'uses', 'environmentalImportance', 'culturalImportance',
  'sources',
];

const TREE_CARD_SELECT = {
  id: true,
  slug: true,
  banglaName: true,
  englishName: true,
  scientificName: true,
  commonName: true,
  createdByName: true,
  images: {
    where: { isPrimary: true },
    select: { url: true, altText: true, isPrimary: true },
    take: 1,
  },
  categories: {
    select: {
      category: {
        select: { name: true, slug: true },
      },
    },
  },
} as const;

const TREE_FULL_INCLUDE = {
  images: { orderBy: { sortOrder: 'asc' as const } },
  varieties: {
    include: { images: true },
    orderBy: { createdAt: 'asc' as const },
  },
  categories: {
    include: { category: true },
  },
} as const;

/**
 * Get published trees with pagination, search, and filtering
 */
export async function getPublishedTrees(params: TreeListParams): Promise<TreeListResponse> {
  const {
    page = 1,
    limit = 12,
    search,
    category,
    family,
    genus,
    kingdom,
    phylum,
    taxClass,
    order,
    species,
    hasFruit,
    hasFlower,
    isNative,
    hasMedicinalUse,
    sort = 'date_desc',
  } = params;

  const where: Record<string, unknown> = { published: true };

  // Search filter
  if (search) {
    const searchFilters = buildSearchFilter(search);
    where.AND = searchFilters;
  }

  // Category filter
  if (category) {
    where.categories = {
      some: { category: { slug: category } },
    };
  }

  // Taxonomy filters
  if (family) where.family = { equals: family, mode: 'insensitive' };
  if (genus) where.genus = { equals: genus, mode: 'insensitive' };
  if (kingdom) where.kingdom = { equals: kingdom, mode: 'insensitive' };
  if (phylum) where.phylum = { equals: phylum, mode: 'insensitive' };
  if (taxClass) where.taxClass = { equals: taxClass, mode: 'insensitive' };
  if (order) where.order = { equals: order, mode: 'insensitive' };
  if (species) where.species = { equals: species, mode: 'insensitive' };

  // Boolean filters
  if (hasFruit !== undefined) where.hasFruit = hasFruit;
  if (hasFlower !== undefined) where.hasFlower = hasFlower;
  if (isNative !== undefined) where.isNative = isNative;
  if (hasMedicinalUse !== undefined) where.hasMedicinalUse = hasMedicinalUse;

  // Sort
  const orderBy = (() => {
    switch (sort) {
      case 'name_asc': return { englishName: 'asc' as const };
      case 'name_desc': return { englishName: 'desc' as const };
      case 'date_asc': return { createdAt: 'asc' as const };
      case 'scientific': return { scientificName: 'asc' as const };
      case 'date_desc':
      default: return { createdAt: 'desc' as const };
    }
  })();

  try {
    const [trees, total] = await Promise.all([
      prisma.tree.findMany({
        where,
        select: TREE_CARD_SELECT,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.tree.count({ where }),
    ]);

    return {
      trees: trees as unknown as TreeCardData[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('getPublishedTrees error:', error);
    return {
      trees: [],
      total: 0,
      page: 1,
      totalPages: 0,
    };
  }
}

/**
 * Get a single tree by slug with all relations
 */
export async function getTreeBySlug(slug: string): Promise<TreeWithRelations | null> {
  return prisma.tree.findFirst({
    where: { slug, published: true },
    include: TREE_FULL_INCLUDE,
  }) as Promise<TreeWithRelations | null>;
}

/**
 * Get featured trees
 */
export async function getFeaturedTrees(limit = 6): Promise<TreeCardData[]> {
  const trees = await prisma.tree.findMany({
    where: { published: true, featured: true },
    select: {
      ...TREE_CARD_SELECT,
      description: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return trees as unknown as TreeCardData[];
}

/**
 * Get recently added trees
 */
export async function getRecentTrees(limit = 8): Promise<TreeCardData[]> {
  const trees = await prisma.tree.findMany({
    where: { published: true },
    select: TREE_CARD_SELECT,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return trees as unknown as TreeCardData[];
}

/**
 * Get related trees based on family, genus, or category
 */
export async function getRelatedTrees(
  treeId: string,
  family?: string | null,
  genus?: string | null,
  categoryIds?: string[],
  limit = 4
): Promise<TreeCardData[]> {
  const orConditions: Record<string, unknown>[] = [];

  if (genus) orConditions.push({ genus: { equals: genus, mode: 'insensitive' } });
  if (family) orConditions.push({ family: { equals: family, mode: 'insensitive' } });
  if (categoryIds?.length) {
    orConditions.push({
      categories: {
        some: { categoryId: { in: categoryIds } },
      },
    });
  }

  if (orConditions.length === 0) return [];

  const trees = await prisma.tree.findMany({
    where: {
      published: true,
      id: { not: treeId },
      OR: orConditions,
    },
    select: TREE_CARD_SELECT,
    take: limit,
  });

  return trees as unknown as TreeCardData[];
}

/**
 * Get tree by scientific name (for AI matching)
 */
export async function getTreeByScientificName(scientificName: string): Promise<TreeWithRelations | null> {
  return prisma.tree.findFirst({
    where: {
      scientificName: { equals: scientificName, mode: 'insensitive' },
      published: true,
    },
    include: TREE_FULL_INCLUDE,
  }) as Promise<TreeWithRelations | null>;
}

/**
 * Smart tree matching for AI predictions
 * Checks scientific name, English name, common name, and Bangla name
 */
export async function findTreeByPrediction(
  scientificName: string,
  commonName?: string
): Promise<TreeWithRelations | null> {
  const cleanScientific = scientificName.trim();
  const cleanCommon = commonName?.trim();

  const orConditions: Prisma.TreeWhereInput[] = [
    { scientificName: { equals: cleanScientific, mode: 'insensitive' } },
    { scientificName: { contains: cleanScientific, mode: 'insensitive' } },
  ];

  if (cleanCommon) {
    orConditions.push(
      { englishName: { equals: cleanCommon, mode: 'insensitive' } },
      { commonName: { equals: cleanCommon, mode: 'insensitive' } },
      { banglaName: { equals: cleanCommon, mode: 'insensitive' } },
      { englishName: { contains: cleanCommon, mode: 'insensitive' } },
      { commonName: { contains: cleanCommon, mode: 'insensitive' } },
      { banglaName: { contains: cleanCommon, mode: 'insensitive' } }
    );
  }

  return prisma.tree.findFirst({
    where: {
      published: true,
      OR: orConditions,
    },
    include: TREE_FULL_INCLUDE,
  }) as Promise<TreeWithRelations | null>;
}

/**
 * Get filter options from database
 */
export async function getFilterOptions() {
  try {
    const [families, genera, kingdoms] = await Promise.all([
      prisma.tree.groupBy({
        by: ['family'],
        where: { published: true, family: { not: '' } },
        _count: true,
        orderBy: { family: 'asc' },
      }),
      prisma.tree.groupBy({
        by: ['genus'],
        where: { published: true, genus: { not: '' } },
        _count: true,
        orderBy: { genus: 'asc' },
      }),
      prisma.tree.groupBy({
        by: ['kingdom'],
        where: { published: true, kingdom: { not: '' } },
        _count: true,
        orderBy: { kingdom: 'asc' },
      }),
    ]);

    return {
      families: families
        .filter((f: { family: string | null; _count: number }) => f.family)
        .map((f: { family: string | null; _count: number }) => ({ value: f.family!, label: f.family!, count: f._count })),
      genera: genera
        .filter((g: { genus: string | null; _count: number }) => g.genus)
        .map((g: { genus: string | null; _count: number }) => ({ value: g.genus!, label: g.genus!, count: g._count })),
      kingdoms: kingdoms
        .filter((k: { kingdom: string | null; _count: number }) => k.kingdom)
        .map((k: { kingdom: string | null; _count: number }) => ({ value: k.kingdom!, label: k.kingdom!, count: k._count })),
    };
  } catch (error) {
    console.error('getFilterOptions error:', error);
    return {
      families: [],
      genera: [],
      kingdoms: [],
    };
  }
}

// ──────────────────────────────────────────────
// Admin Tree Operations
// ──────────────────────────────────────────────

export async function getAllTrees() {
  return prisma.tree.findMany({
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      categories: { include: { category: true } },
      _count: { select: { varieties: true, images: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getTreeById(id: string) {
  return prisma.tree.findUnique({
    where: { id },
    include: TREE_FULL_INCLUDE,
  });
}

export async function createTree(
  data: Prisma.TreeCreateInput,
  categoryIds: string[] = [],
  performedByName = 'Admin'
) {
  const slug = generateSlug(data.englishName as string);

  // Check for existing slug
  const existing = await prisma.tree.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const tree = await prisma.tree.create({
    data: {
      ...data,
      slug: finalSlug,
      createdByName: performedByName,
      updatedByName: performedByName,
      categories: categoryIds.length > 0
        ? { create: categoryIds.map(categoryId => ({ categoryId })) }
        : undefined,
    },
    include: TREE_FULL_INCLUDE,
  });

  // Audit log
  await createAuditLog({
    treeId: tree.id,
    action: 'TREE_CREATED',
    newValue: `${tree.banglaName} / ${tree.englishName} (${tree.scientificName})`,
    performedByName,
  });

  return tree;
}

export async function updateTree(
  id: string,
  data: Record<string, unknown>,
  categoryIds?: string[],
  performedByName = 'Admin',
  reason?: string
) {
  // Fetch old values for diff
  const oldTree = await prisma.tree.findUnique({ where: { id } });

  // If english name changed, update slug
  if (data.englishName) {
    const newSlug = generateSlug(data.englishName as string);
    const existing = await prisma.tree.findFirst({
      where: { slug: newSlug, id: { not: id } },
    });
    data.slug = existing ? `${newSlug}-${Date.now()}` : newSlug;
  }

  // Update categories if provided
  if (categoryIds) {
    await prisma.treeCategory.deleteMany({ where: { treeId: id } });
    await prisma.treeCategory.createMany({
      data: categoryIds.map(categoryId => ({ treeId: id, categoryId })),
    });
  }

  const updatedTree = await prisma.tree.update({
    where: { id },
    data: { ...data, updatedByName: performedByName },
    include: TREE_FULL_INCLUDE,
  });

  // Build per-field audit entries
  if (oldTree) {
    const auditEntries = AUDITED_FIELDS
      .filter((field) => {
        const key = field as string;
        return key in data && String(data[key] ?? '') !== String((oldTree as Record<string, unknown>)[key] ?? '');
      })
      .map((field) => ({
        treeId: id,
        action: 'TREE_UPDATED' as const,
        fieldName: field as string,
        previousValue: String((oldTree as Record<string, unknown>)[field as string] ?? ''),
        newValue: String(data[field as string] ?? ''),
        reason,
        performedByName,
      }));

    if (auditEntries.length > 0) {
      await createAuditLogs(auditEntries);
    }
  }

  return updatedTree;
}

export async function togglePublish(id: string, performedByName = 'Admin') {
  const tree = await prisma.tree.findUnique({ where: { id }, select: { published: true } });
  if (!tree) throw new Error('Tree not found');
  const updated = await prisma.tree.update({
    where: { id },
    data: { published: !tree.published },
  });
  await createAuditLog({
    treeId: id,
    action: updated.published ? 'PUBLISHED' : 'UNPUBLISHED',
    performedByName,
  });
  return updated;
}

export async function toggleFeatured(id: string, performedByName = 'Admin') {
  const tree = await prisma.tree.findUnique({ where: { id }, select: { featured: true } });
  if (!tree) throw new Error('Tree not found');
  const updated = await prisma.tree.update({
    where: { id },
    data: { featured: !tree.featured },
  });
  await createAuditLog({
    treeId: id,
    action: updated.featured ? 'FEATURED' : 'UNFEATURED',
    performedByName,
  });
  return updated;
}

/**
 * Add an image to a tree — also logs to audit
 */
export async function addTreeImage(
  treeId: string,
  imageData: {
    url: string;
    type?: string;
    altText?: string;
    caption?: string;
    isPrimary?: boolean;
    sortOrder?: number;
  },
  performedByName = 'Admin'
) {
  const image = await prisma.treeImage.create({
    data: {
      treeId,
      url: imageData.url,
      type: imageData.type ?? 'full_tree',
      altText: imageData.altText,
      caption: imageData.caption,
      uploadedByName: performedByName,
      isPrimary: imageData.isPrimary ?? false,
      sortOrder: imageData.sortOrder ?? 0,
    },
  });
  await createAuditLog({
    treeId,
    action: 'IMAGE_ADDED',
    newValue: imageData.url,
    fieldName: imageData.type ?? 'full_tree',
    performedByName,
  });
  return image;
}

/**
 * Remove an image from a tree — also logs to audit
 */
export async function removeTreeImage(
  imageId: string,
  performedByName = 'Admin'
) {
  const image = await prisma.treeImage.findUnique({
    where: { id: imageId },
    select: { treeId: true, url: true, type: true },
  });
  if (!image) throw new Error('Image not found');
  await prisma.treeImage.delete({ where: { id: imageId } });
  await createAuditLog({
    treeId: image.treeId,
    action: 'IMAGE_REMOVED',
    previousValue: image.url,
    fieldName: image.type,
    performedByName,
  });
}

export async function deleteTree(identifier: string) {
  const tree = await prisma.tree.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
    select: { id: true },
  });
  if (!tree) throw new Error('Tree not found');
  return prisma.tree.delete({ where: { id: tree.id } });
}
