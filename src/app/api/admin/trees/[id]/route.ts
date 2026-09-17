import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getTreeById, updateTree } from '@/services/trees/tree.service';

/**
 * GET /api/admin/trees/[id]
 * Fetch a single tree by ID (admin — includes unpublished)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const tree = await getTreeById(params.id);
    if (!tree) {
      return NextResponse.json({ success: false, error: 'Tree not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: tree });
  } catch (error) {
    console.error('Admin tree GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load tree' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/trees/[id]
 * Update a tree by ID
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { categoryIds, reason, ...data } = body;

    const performedByName = (session.user as { name?: string })?.name ?? 'Admin';

    const tree = await updateTree(params.id, data, categoryIds, performedByName, reason);
    return NextResponse.json({ success: true, data: tree });
  } catch (error) {
    console.error('Admin tree PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update tree' }, { status: 500 });
  }
}
