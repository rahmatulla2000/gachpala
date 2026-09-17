import prisma, { Prisma } from '@/lib/prisma';
import { generateSlug } from '@/lib/utils';
import type { SubmissionWithImages } from '@/types';
import type { $Enums } from '@prisma/client';

type SubmissionStatus = $Enums.SubmissionStatus;

/**
 * Create a new public submission
 */
export async function createSubmission(
  data: Record<string, unknown>,
  imageUrls?: { url: string; type: string; altText?: string }[]
) {
  const submission = await prisma.submission.create({
    data: {
      ...data,
      status: 'PENDING',
      images: imageUrls
        ? {
            create: imageUrls.map(img => ({
              url: img.url,
              type: img.type || 'full_tree',
              altText: img.altText || '',
            })),
          }
        : undefined,
    } as Parameters<typeof prisma.submission.create>[0]['data'],
    include: { images: true },
  });

  return submission;
}

/**
 * Get submissions filtered by status
 */
export async function getSubmissions(
  opts?: { status?: SubmissionStatus; page?: number; limit?: number } | SubmissionStatus,
  page = 1,
  limit = 20
) {
  let where: Record<string, unknown> = {};
  let statusVal: string | undefined;
  if (opts && typeof opts === 'object') {
    if (opts.status) statusVal = opts.status;
    page = opts.page ?? page;
    limit = opts.limit ?? limit;
  } else if (opts) {
    statusVal = opts;
  }
  if (statusVal) where = { status: statusVal };

  const [submissions, total] = await Promise.all([
    prisma.submission.findMany({
      where,
      include: { images: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.submission.count({ where }),
  ]);

  return {
    submissions: submissions as SubmissionWithImages[],
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get a single submission by ID
 */
export async function getSubmissionById(id: string): Promise<SubmissionWithImages | null> {
  return prisma.submission.findUnique({
    where: { id },
    include: { images: true },
  });
}

/**
 * Approve a submission and create a tree
 */
export async function approveSubmission(
  submissionId: string,
  adminId: string,
  editedData?: Record<string, unknown>,
  categoryIds?: string[]
) {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { images: true },
  });

  if (!submission) throw new Error('Submission not found');
  if (submission.status !== 'PENDING') throw new Error('Submission already reviewed');

  // Merge edited data with submission data
  const treeData = {
    banglaName: submission.banglaName,
    englishName: submission.englishName,
    commonName: submission.commonName || '',
    scientificName: submission.scientificName || '',
    kingdom: submission.kingdom || 'Plantae',
    phylum: submission.phylum || '',
    taxClass: submission.taxClass || '',
    order: submission.order || '',
    family: submission.family || '',
    genus: submission.genus || '',
    species: submission.species || '',
    description: submission.description || '',
    characteristics: submission.characteristics || '',
    habitat: submission.habitat || '',
    distribution: submission.distribution || '',
    height: submission.height || '',
    lifespan: submission.lifespan || '',
    benefits: submission.benefits || '',
    uses: submission.uses || '',
    fruitInfo: submission.fruitInfo ?? Prisma.JsonNull,
    flowerInfo: submission.flowerInfo ?? Prisma.JsonNull,
    sources: submission.source || '',
    ...editedData,
  };

  const slug = generateSlug(treeData.englishName);
  const existingSlug = await prisma.tree.findUnique({ where: { slug } });
  const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

  // Transaction: create tree + update submission
  const result = await prisma.$transaction(async (tx) => {
    const tree = await tx.tree.create({
      data: {
        ...treeData,
        slug: finalSlug,
        published: true,
        createdByName: submission.contributorName?.trim() || 'Unknown',
        categories: categoryIds?.length
          ? { create: categoryIds.map(categoryId => ({ categoryId })) }
          : undefined,
        images: submission.images.length
          ? {
              create: submission.images.map((img: { url: string; type: string; altText?: string | null }, idx: number) => ({
                url: img.url,
                type: img.type,
                altText: img.altText || '',
                isPrimary: idx === 0,
                sortOrder: idx,
              })),
            }
          : undefined,
      },
    });

    await tx.submission.update({
      where: { id: submissionId },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewedBy: adminId,
      },
    });

    return tree;
  });

  return result;
}

/**
 * Reject a submission
 */
export async function rejectSubmission(
  submissionId: string,
  adminId: string,
  reviewNote?: string
) {
  return prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: 'REJECTED',
      reviewedAt: new Date(),
      reviewedBy: adminId,
      reviewNote: reviewNote || '',
    },
  });
}

/**
 * Check for duplicate trees
 */
export async function checkDuplicates(
  scientificName?: string,
  englishName?: string,
  banglaName?: string
) {
  const orConditions: Record<string, unknown>[] = [];

  if (scientificName) {
    orConditions.push({
      scientificName: { equals: scientificName, mode: 'insensitive' },
    });
  }
  if (englishName) {
    orConditions.push({
      englishName: { equals: englishName, mode: 'insensitive' },
    });
  }
  if (banglaName) {
    orConditions.push({
      banglaName: { equals: banglaName, mode: 'insensitive' },
    });
  }

  if (orConditions.length === 0) return [];

  return prisma.tree.findMany({
    where: { OR: orConditions },
    select: {
      id: true,
      slug: true,
      banglaName: true,
      englishName: true,
      scientificName: true,
    },
  });
}
