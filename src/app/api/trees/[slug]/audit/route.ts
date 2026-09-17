import { NextRequest, NextResponse } from 'next/server';
import { getTreeAuditLogs } from '@/services/audit/audit.service';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: { slug: string };
}

/**
 * GET /api/trees/[slug]/audit
 * Returns the audit log for a tree — read-only, public-safe (no sensitive data).
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Resolve slug → id
    const tree = await prisma.tree.findFirst({
      where: { slug: params.slug },
      select: { id: true },
    });
    if (!tree) {
      return NextResponse.json({ success: false, error: 'Tree not found.' }, { status: 404 });
    }

    const result = await getTreeAuditLogs(tree.id, page, limit);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Audit log error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch audit log.' }, { status: 500 });
  }
}
