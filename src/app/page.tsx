import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { Statistics } from '@/components/home/Statistics';
import { FeaturedTrees } from '@/components/home/FeaturedTrees';
import { CategorySection } from '@/components/home/CategorySection';
import { AIDetectionSection } from '@/components/home/AIDetectionSection';
import { RecentTrees } from '@/components/home/RecentTrees';
import { WhyTreesMatter } from '@/components/home/WhyTreesMatter';
import { ContributeSection } from '@/components/home/ContributeSection';
import { getPublicStats } from '@/services/stats/stats.service';
import { getFeaturedTrees, getRecentTrees } from '@/services/trees/tree.service';
import { getCategories } from '@/services/categories/category.service';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const [stats, featuredTrees, categories, recentTrees] = await Promise.all([
    getPublicStats(),
    getFeaturedTrees(6),
    getCategories(),
    getRecentTrees(8),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Statistics stats={stats} />
        <FeaturedTrees trees={featuredTrees as (typeof featuredTrees[0] & { description?: string | null })[]} />
        <CategorySection categories={categories} />
        <AIDetectionSection />
        <RecentTrees trees={recentTrees} />
        <WhyTreesMatter />
        <ContributeSection />
      </main>
      <Footer />
    </>
  );
}
