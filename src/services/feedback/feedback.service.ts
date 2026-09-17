/**
 * Feedback / Correction Service
 * Manages public feedback submissions and admin review workflow.
 */

import prisma from '@/lib/prisma';
import type { FeedbackStatus } from '@prisma/client';

export interface CreateFeedbackInput {
  treeId: string;
  issueType: string;
  description: string;
  evidenceImageUrl?: string;
  submitterName?: string;
  submitterEmail?: string;
}

export interface UpdateFeedbackInput {
  status: FeedbackStatus;
  adminNote?: string;
  reviewedByName: string;
}

export interface GetFeedbacksParams {
  treeId?: string;
  status?: FeedbackStatus;
  page?: number;
  limit?: number;
}

/**
 * Submit a new feedback entry (public — no auth required)
 */
export async function createFeedback(input: CreateFeedbackInput) {
  return prisma.treeFeedback.create({ data: input });
}

/**
 * Get paginated feedback list (admin)
 */
export async function getFeedbacks({
  treeId,
  status,
  page = 1,
  limit = 20,
}: GetFeedbacksParams = {}) {
  const where: Record<string, unknown> = {};
  if (treeId) where.treeId = treeId;
  if (status) where.status = status;

  const [feedbacks, total] = await Promise.all([
    prisma.treeFeedback.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        tree: {
          select: { id: true, slug: true, englishName: true, banglaName: true },
        },
      },
    }),
    prisma.treeFeedback.count({ where }),
  ]);

  return { feedbacks, total, page, totalPages: Math.ceil(total / limit) };
}

/**
 * Get a single feedback entry by ID (admin)
 */
export async function getFeedbackById(id: string) {
  return prisma.treeFeedback.findUnique({
    where: { id },
    include: {
      tree: {
        select: {
          id: true,
          slug: true,
          englishName: true,
          banglaName: true,
          scientificName: true,
        },
      },
    },
  });
}

/**
 * Update feedback status and add admin note (admin action)
 */
export async function updateFeedbackStatus(
  id: string,
  input: UpdateFeedbackInput
) {
  return prisma.treeFeedback.update({
    where: { id },
    data: {
      status: input.status,
      adminNote: input.adminNote,
      reviewedByName: input.reviewedByName,
      reviewedAt: new Date(),
    },
  });
}

/**
 * Count pending feedbacks — for admin dashboard stats
 */
export async function getPendingFeedbackCount() {
  return prisma.treeFeedback.count({ where: { status: 'PENDING' } });
}

/**
 * Get recent pending feedbacks — for admin dashboard widget
 */
export async function getRecentPendingFeedbacks(limit = 5) {
  return prisma.treeFeedback.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      tree: {
        select: { id: true, slug: true, englishName: true, banglaName: true },
      },
    },
  });
}

/**
 * Get feedbacks for a specific tree — for public tree detail page
 */
export async function getPublicFeedbacksForTree(treeId: string) {
  // Public view — only show count; no personal data exposed
  return prisma.treeFeedback.count({ where: { treeId } });
}
