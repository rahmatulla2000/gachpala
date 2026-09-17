import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { approveSubmission, rejectSubmission } from '@/services/submissions/submission.service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, editedData, categoryIds, reviewNote } = body;
    const adminId = (session.user as { id?: string }).id || session.user.email || 'admin';

    if (action === 'APPROVE') {
      const tree = await approveSubmission(params.id, adminId, editedData, categoryIds);
      return NextResponse.json({
        success: true,
        message: 'Submission approved and tree created successfully!',
        data: tree,
      });
    }

    if (action === 'REJECT') {
      await rejectSubmission(params.id, adminId, reviewNote);
      return NextResponse.json({
        success: true,
        message: 'Submission rejected successfully.',
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    console.error('Submission action error:', error);
    const message = error instanceof Error ? error.message : 'Operation failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
