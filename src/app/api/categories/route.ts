import { NextResponse } from 'next/server';
import { getCategories } from '@/services/categories/category.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Categories error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load categories' },
      { status: 500 }
    );
  }
}
