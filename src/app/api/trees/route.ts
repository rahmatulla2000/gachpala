import { NextRequest, NextResponse } from 'next/server';
import { getPublishedTrees } from '@/services/trees/tree.service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '12'),
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      family: searchParams.get('family') || undefined,
      genus: searchParams.get('genus') || undefined,
      kingdom: searchParams.get('kingdom') || undefined,
      phylum: searchParams.get('phylum') || undefined,
      taxClass: searchParams.get('taxClass') || undefined,
      order: searchParams.get('order') || undefined,
      species: searchParams.get('species') || undefined,
      hasFruit: searchParams.get('hasFruit') ? searchParams.get('hasFruit') === 'true' : undefined,
      hasFlower: searchParams.get('hasFlower') ? searchParams.get('hasFlower') === 'true' : undefined,
      isNative: searchParams.get('isNative') ? searchParams.get('isNative') === 'true' : undefined,
      hasMedicinalUse: searchParams.get('hasMedicinalUse') ? searchParams.get('hasMedicinalUse') === 'true' : undefined,
      sort: (searchParams.get('sort') as 'name_asc' | 'name_desc' | 'date_asc' | 'date_desc' | 'scientific') || 'date_desc',
    };

    const result = await getPublishedTrees(params);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Trees error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load trees' },
      { status: 500 }
    );
  }
}
