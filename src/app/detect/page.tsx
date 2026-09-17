import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DetectionClient } from '@/components/detection/DetectionClient';

export const metadata: Metadata = {
  title: 'AI Tree Detection',
  description: 'Identify any tree using AI. Upload a photo of a tree, leaf, flower, or bark, and our AI will identify it instantly.',
};

export default function DetectPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <DetectionClient />
      </main>
      <Footer />
    </>
  );
}
