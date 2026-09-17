import prisma from '@/lib/prisma';
import type { PublicStats, AdminStats } from '@/types';

/**
 * Get public statistics (all from database queries)
 */
export async function getPublicStats(): Promise<PublicStats> {
  const [totalTrees, totalVarieties, totalCategories, approvedContributions] =
    await Promise.all([
      prisma.tree.count({ where: { published: true } }),
      prisma.variety.count(),
      prisma.category.count(),
      prisma.submission.count({ where: { status: 'APPROVED' } }),
    ]);

  return {
    totalTrees,
    totalVarieties,
    totalCategories,
    approvedContributions,
  };
}

/**
 * Get admin dashboard statistics
 */
export async function getAdminStats(): Promise<AdminStats> {
  const [
    totalTrees,
    totalVarieties,
    totalCategories,
    totalImages,
    totalSubmissions,
    pendingSubmissions,
    approvedContributions,
    rejectedSubmissions,
    pendingFeedbacks,
  ] = await Promise.all([
    prisma.tree.count(),
    prisma.variety.count(),
    prisma.category.count(),
    prisma.treeImage.count(),
    prisma.submission.count(),
    prisma.submission.count({ where: { status: 'PENDING' } }),
    prisma.submission.count({ where: { status: 'APPROVED' } }),
    prisma.submission.count({ where: { status: 'REJECTED' } }),
    prisma.treeFeedback.count({ where: { status: 'PENDING' } }),
  ]);

  return {
    totalTrees,
    totalVarieties,
    totalCategories,
    totalImages,
    totalSubmissions,
    pendingSubmissions,
    approvedContributions,
    rejectedSubmissions,
    pendingFeedbacks,
  };
}
