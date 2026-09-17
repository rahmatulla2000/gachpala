import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getTreeBySlug, getRelatedTrees } from '@/services/trees/tree.service';
import { TreeDetailContent } from '@/components/trees/TreeDetailContent';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tree = await getTreeBySlug(params.slug);
  if (!tree) return { title: 'Tree Not Found' };

  const description = tree.description
    ? tree.description.slice(0, 160)
    : `Learn about ${tree.englishName} (${tree.scientificName}) - ${tree.banglaName}. Detailed botanical information, characteristics, and more.`;

  return {
    title: `${tree.englishName} - ${tree.banglaName}`,
    description,
    openGraph: {
      title: `${tree.englishName} - ${tree.banglaName} | GachPala`,
      description,
      type: 'article',
      images: tree.images?.[0]?.url ? [{ url: tree.images[0].url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tree.englishName} - ${tree.banglaName}`,
      description,
    },
  };
}

export default async function TreeDetailPage({ params }: { params: { slug: string } }) {
  const tree = await getTreeBySlug(params.slug);
  if (!tree) notFound();

  const categoryIds = tree.categories?.map((c: { category: { id: string; name: string; slug: string } }) => c.category.id) || [];
  const relatedTrees = await getRelatedTrees(tree.id, tree.family, tree.genus, categoryIds, 4);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    name: tree.englishName,
    alternateName: tree.banglaName,
    description: tree.description,
    image: tree.images?.[0]?.url,
    url: `/trees/${tree.slug}`,
    about: {
      '@type': 'Thing',
      name: tree.scientificName,
    },
  };

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen">
        <TreeDetailContent tree={tree} relatedTrees={relatedTrees} />
      </main>
      <Footer />
    </>
  );
}
