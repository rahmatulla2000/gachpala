import { NextRequest, NextResponse } from 'next/server';
import { createFeedback } from '@/services/feedback/feedback.service';

/**
 * POST /api/feedback
 * Public endpoint — no auth required. Accepts multipart or JSON.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { treeId, issueType, description, submitterName, submitterEmail, evidenceImageUrl } = body;

    if (!treeId || !issueType || !description?.trim()) {
      return NextResponse.json(
        { success: false, error: 'treeId, issueType, and description are required.' },
        { status: 400 }
      );
    }

    const feedback = await createFeedback({
      treeId,
      issueType,
      description: description.trim(),
      submitterName: submitterName?.trim() || undefined,
      submitterEmail: submitterEmail?.trim() || undefined,
      evidenceImageUrl: evidenceImageUrl || undefined,
    });

    return NextResponse.json({ success: true, data: { id: feedback.id } }, { status: 201 });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/feedback
 * Admin — returns paginated feedback list with optional status/treeId filters.
 */
export async function GET(request: NextRequest) {
  try {
    const { getFeedbacks } = await import('@/services/feedback/feedback.service');
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'PENDING' | 'REVIEWED' | 'ACTION_TAKEN' | 'REJECTED' | null;
    const treeId = searchParams.get('treeId') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const result = await getFeedbacks({ status: status || undefined, treeId, page, limit });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Feedback list error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch feedbacks.' }, { status: 500 });
  }
}
