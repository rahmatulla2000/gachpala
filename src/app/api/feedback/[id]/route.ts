import { NextRequest, NextResponse } from 'next/server';
import { getFeedbackById, updateFeedbackStatus } from '@/services/feedback/feedback.service';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/feedback/[id] — admin: get a single feedback detail
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const feedback = await getFeedbackById(params.id);
    if (!feedback) {
      return NextResponse.json({ success: false, error: 'Feedback not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error('Get feedback error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch feedback.' }, { status: 500 });
  }
}

/**
 * PATCH /api/feedback/[id] — admin: update status + add note
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const { status, adminNote, reviewedByName } = body;

    if (!status || !reviewedByName) {
      return NextResponse.json(
        { success: false, error: 'status and reviewedByName are required.' },
        { status: 400 }
      );
    }

    const feedback = await updateFeedbackStatus(params.id, { status, adminNote, reviewedByName });
    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error('Update feedback error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update feedback.' }, { status: 500 });
  }
}
