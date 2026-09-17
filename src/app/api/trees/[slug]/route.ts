import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getTreeBySlug, deleteTree } from '@/services/trees/tree.service';

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const tree = await getTreeBySlug(params.slug);

    if (!tree) {
      return NextResponse.json(
        { success: false, error: 'Tree not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: tree });
  } catch (error) {
    console.error('Tree detail error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load tree details' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await deleteTree(params.slug);

    return NextResponse.json({ success: true, message: 'Tree deleted successfully' });
  } catch (error) {
    console.error('Delete tree error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete tree' },
      { status: 500 }
    );
  }
}
