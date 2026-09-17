import prisma from '@/lib/prisma';
import { generateSlug } from '@/lib/utils';
import type { CategoryWithCount } from '@/types';

/**
 * Get all categories with tree counts
 */
export async function getCategories(): Promise<CategoryWithCount[]> {
  try {
    // Manually count published trees for each category
    const categoriesWithCounts = await Promise.all(
      (await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } })).map(async (cat: { id: string; name: string; slug: string; description: string | null; image: string | null; icon: string | null; sortOrder: number; createdAt: Date; updatedAt: Date }) => {
        const count = await prisma.treeCategory.count({
          where: {
            categoryId: cat.id,
            tree: { published: true },
          },
        });
        return {
          ...cat,
          _count: { trees: count },
        };
      })
    );

    return categoriesWithCounts;
  } catch (error) {
    console.error('getCategories error:', error);
    return [];
  }
}

/**
 * Get category by slug with its trees
 */
export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) return null;

  const trees = await prisma.tree.findMany({
    where: {
      published: true,
      categories: {
        some: { categoryId: category.id },
      },
    },
    select: {
      id: true,
      slug: true,
      banglaName: true,
      englishName: true,
      scientificName: true,
      commonName: true,
      images: {
        where: { isPrimary: true },
        select: { url: true, altText: true, isPrimary: true },
        take: 1,
      },
      categories: {
        select: { category: { select: { name: true, slug: true } } },
      },
    },
  });

  return { category, trees };
}

// Admin CRUD
export async function createCategory(data: { name: string; description?: string; image?: string; icon?: string }) {
  const slug = generateSlug(data.name);
  return prisma.category.create({
    data: { ...data, slug },
  });
}

export async function updateCategory(id: string, data: Record<string, unknown>) {
  if (data.name) {
    data.slug = generateSlug(data.name as string);
  }
  return prisma.category.update({
    where: { id },
    data,
  });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}
