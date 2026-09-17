/**
 * Audit Log Service
 * Creates and queries immutable TreeAuditLog entries.
 * Audit logs are NEVER updated or deleted — they are read-only history.
 */

import prisma from '@/lib/prisma';
import type { AuditAction } from '@prisma/client';

export interface CreateAuditLogInput {
  treeId: string;
  action: AuditAction;
  fieldName?: string;
  previousValue?: string | null;
  newValue?: string | null;
  reason?: string;
  performedByName: string;
}

/**
 * Write a single audit entry. Fire-and-forget safe — errors are caught and logged.
 */
export async function createAuditLog(input: CreateAuditLogInput) {
  try {
    return await prisma.treeAuditLog.create({
      data: {
        treeId: input.treeId,
        action: input.action,
        fieldName: input.fieldName,
        previousValue: input.previousValue ?? null,
        newValue: input.newValue ?? null,
        reason: input.reason ?? null,
        performedByName: input.performedByName,
      },
    });
  } catch (err) {
    console.error('[AuditLog] Failed to write audit entry:', err);
  }
}

/**
 * Write multiple audit entries in a single transaction (e.g., for a multi-field update).
 */
export async function createAuditLogs(entries: CreateAuditLogInput[]) {
  if (entries.length === 0) return;
  try {
    await prisma.treeAuditLog.createMany({
      data: entries.map((e) => ({
        treeId: e.treeId,
        action: e.action,
        fieldName: e.fieldName ?? null,
        previousValue: e.previousValue ?? null,
        newValue: e.newValue ?? null,
        reason: e.reason ?? null,
        performedByName: e.performedByName,
      })),
    });
  } catch (err) {
    console.error('[AuditLog] Failed to write bulk audit entries:', err);
  }
}

/**
 * Get paginated audit logs for a specific tree.
 */
export async function getTreeAuditLogs(
  treeId: string,
  page = 1,
  limit = 20
) {
  const [logs, total] = await Promise.all([
    prisma.treeAuditLog.findMany({
      where: { treeId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.treeAuditLog.count({ where: { treeId } }),
  ]);

  return {
    logs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get recent audit activity across all trees — for admin dashboard.
 */
export async function getRecentAuditActivity(limit = 10) {
  return prisma.treeAuditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      tree: {
        select: { id: true, slug: true, englishName: true, banglaName: true },
      },
    },
  });
}
