import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { uploadImage, validateImage } from '@/services/uploads/upload.service';
import { addTreeImage, removeTreeImage } from '@/services/trees/tree.service';

function revalidateTreePaths(slug?: string) {
  try {
    revalidatePath('/');
    revalidatePath('/trees');
    if (slug) revalidatePath(`/trees/${slug}`);
    revalidatePath('/categories');
  } catch (err) {
    console.warn('Revalidation warning:', err);
  }
}

/**
 * POST /api/admin/trees/[id]/images
 * Upload and attach a new image to a tree
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const tree = await prisma.tree.findUnique({ where: { id: params.id } });
    if (!tree) {
      return NextResponse.json({ success: false, error: 'Tree not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'full_tree';
    const altText = (formData.get('altText') as string) || tree.englishName || '';
    const isPrimary = formData.get('isPrimary') === 'true';

    if (!file || file.size === 0) {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    const validation = validateImage(file);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const performedByName = (session.user as { name?: string })?.name ?? 'Admin';

    // Upload image (Cloudinary or local fallback)
    const uploadResult = await uploadImage(file, 'trees');

    // Save image to database (addTreeImage will auto-handle isPrimary)
    const newImage = await addTreeImage(
      params.id,
      {
        url: uploadResult.url,
        type,
        altText,
        isPrimary,
      },
      performedByName
    );

    revalidateTreePaths(tree.slug);

    return NextResponse.json({ success: true, data: newImage }, { status: 201 });
  } catch (error) {
    console.error('Admin tree image upload error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to upload image' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/trees/[id]/images?imageId=...
 * Delete an image from a tree
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');

    if (!imageId) {
      return NextResponse.json({ success: false, error: 'Image ID is required' }, { status: 400 });
    }

    const image = await prisma.treeImage.findUnique({
      where: { id: imageId },
    });

    if (!image || image.treeId !== params.id) {
      return NextResponse.json({ success: false, error: 'Image not found for this tree' }, { status: 404 });
    }

    const performedByName = (session.user as { name?: string })?.name ?? 'Admin';
    await removeTreeImage(imageId, performedByName);

    // If the deleted image was primary, set another image as primary if available
    if (image.isPrimary) {
      const nextImage = await prisma.treeImage.findFirst({
        where: { treeId: params.id },
        orderBy: { createdAt: 'desc' },
      });
      if (nextImage) {
        await prisma.treeImage.update({
          where: { id: nextImage.id },
          data: { isPrimary: true },
        });
      }
    }

    const tree = await prisma.tree.findUnique({
      where: { id: params.id },
      select: { slug: true },
    });
    revalidateTreePaths(tree?.slug);

    return NextResponse.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Admin delete image error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete image' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/trees/[id]/images
 * Set an image as primary or update sortOrder
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
    const { imageId, isPrimary } = body;

    if (!imageId) {
      return NextResponse.json({ success: false, error: 'Image ID is required' }, { status: 400 });
    }

    if (isPrimary) {
      await prisma.treeImage.updateMany({
        where: { treeId: params.id },
        data: { isPrimary: false },
      });

      const updated = await prisma.treeImage.update({
        where: { id: imageId },
        data: { isPrimary: true },
      });

      const tree = await prisma.tree.findUnique({
        where: { id: params.id },
        select: { slug: true },
      });
      revalidateTreePaths(tree?.slug);

      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin update image error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update image' },
      { status: 500 }
    );
  }
}
