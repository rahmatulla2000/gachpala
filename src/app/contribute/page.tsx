import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ContributionFormClient } from '@/components/contribute/ContributionFormClient';

export const metadata: Metadata = {
  title: 'Contribute a Tree',
  description: 'Share your knowledge about trees. Submit information about a tree to our database. No account required.',
};

export default function ContributePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="section-container py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Contribute a Tree
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Share your knowledge about trees. No account required.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Your submission will be reviewed by our team before publishing.
              </p>
            </div>

            <ContributionFormClient />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
