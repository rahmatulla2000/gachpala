import { NextRequest, NextResponse } from 'next/server';
import { submissionSchema } from '@/validations';
import { createSubmission } from '@/services/submissions/submission.service';
import { uploadImage, validateImage } from '@/services/uploads/upload.service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Parse text fields
    const rawData: Record<string, string> = {};
    const fields = [
      'banglaName', 'englishName', 'commonName', 'scientificName',
      'kingdom', 'phylum', 'taxClass', 'order', 'family', 'genus', 'species',
      'description', 'characteristics', 'habitat', 'distribution',
      'height', 'lifespan', 'benefits', 'uses',
      'contributorName', 'contributorEmail', 'source', 'additionalNote',
    ];

    for (const field of fields) {
      const value = formData.get(field);
      if (value && typeof value === 'string') {
        rawData[field] = value;
      }
    }

    // If contributor does not provide their name, default to 'Unknown'
    if (!rawData.contributorName || !rawData.contributorName.trim()) {
      rawData.contributorName = 'Unknown';
    }

    // Parse fruit/flower info
    const fruitInfoStr = formData.get('fruitInfo');
    const flowerInfoStr = formData.get('flowerInfo');
    const fruitInfo = fruitInfoStr ? JSON.parse(fruitInfoStr as string) : undefined;
    const flowerInfo = flowerInfoStr ? JSON.parse(flowerInfoStr as string) : undefined;

    // Validate
    const validation = submissionSchema.safeParse({
      ...rawData,
      fruitInfo,
      flowerInfo,
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Handle image uploads
    const imageUrls: { url: string; type: string; altText: string }[] = [];
    const imageFiles = formData.getAll('images') as File[];

    for (const file of imageFiles) {
      if (file.size === 0) continue;

      const imageValidation = validateImage(file);
      if (!imageValidation.valid) {
        return NextResponse.json(
          { success: false, error: imageValidation.error },
          { status: 400 }
        );
      }

      try {
        const result = await uploadImage(file, 'submissions');
        imageUrls.push({
          url: result.url,
          type: 'full_tree',
          altText: rawData.englishName || '',
        });
      } catch {
        return NextResponse.json(
          { success: false, error: 'Failed to upload image. Please try again.' },
          { status: 500 }
        );
      }
    }

    // Create submission
    const submission = await createSubmission(validation.data, imageUrls);

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for contributing to GachPala. Your submission has been received and is waiting for administrator review.',
        data: { id: submission.id },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contribution error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Your submission could not be processed. Please try again.',
      },
      { status: 500 }
    );
  }
}
