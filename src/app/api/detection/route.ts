import { NextRequest, NextResponse } from 'next/server';
import { detectTree } from '@/services/detection/detector';
import { ALLOWED_IMAGE_FORMATS, MAX_FILE_SIZE } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { success: false, error: 'Please upload a valid image.' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_IMAGE_FORMATS.includes(file.type as (typeof ALLOWED_IMAGE_FORMATS)[number])) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload JPG, JPEG, PNG, or WEBP.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await detectTree(buffer, file.type);

    return NextResponse.json({
      success: true,
      data: {
        predictions: result.predictions,
        matchedTree: result.matchedTree
          ? {
              id: result.matchedTree.id,
              slug: result.matchedTree.slug,
              banglaName: result.matchedTree.banglaName,
              englishName: result.matchedTree.englishName,
              scientificName: result.matchedTree.scientificName,
              description: result.matchedTree.description,
              family: result.matchedTree.family,
              habitat: result.matchedTree.habitat,
              characteristics: result.matchedTree.characteristics,
              uses: result.matchedTree.uses,
              images: result.matchedTree.images?.slice(0, 1),
            }
          : null,
        provider: result.provider,
        processingTime: result.processingTime,
      },
    });
  } catch (error) {
    console.error('Detection error:', error);
    const message = error instanceof Error
      ? error.message
      : 'Tree identification is temporarily unavailable. Please try again later.';

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
