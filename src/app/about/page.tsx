import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TreePine, Target, Users, Lightbulb, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about GachPala — our mission, vision, and the team behind Bangladesh\'s premier AI-powered tree knowledge platform.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950 py-20">
          <div className="section-container text-center">
            <div className="w-16 h-16 bg-forest-600/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TreePine className="w-8 h-8 text-forest-300" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              About GachPala (গাছপালা)
            </h1>
            <p className="text-forest-200/80 text-xl max-w-2xl mx-auto">
              An AI-powered platform dedicated to promoting tree knowledge, conservation awareness, and community learning.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section id="mission" className="section-spacing">
          <div className="section-container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-forest-600 dark:text-forest-400 text-sm font-semibold uppercase tracking-wider mb-3 block">Our Mission</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Making Tree Knowledge Accessible to Everyone
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-4">
                  GachPala was created with a simple but powerful goal: to make botanical knowledge about trees accessible to everyone — from students and farmers to researchers and nature enthusiasts.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  We believe that understanding trees is fundamental to protecting them. By combining artificial intelligence with community knowledge, we are building the most comprehensive and accessible tree encyclopedia for Bangladesh and beyond.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Target, title: 'Mission', desc: 'Make tree knowledge accessible to all' },
                  { icon: Lightbulb, title: 'Innovation', desc: 'AI-powered identification and learning' },
                  { icon: Users, title: 'Community', desc: 'Community-driven knowledge platform' },
                  { icon: Heart, title: 'Conservation', desc: 'Promoting tree conservation awareness' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="premium-card p-5 text-center">
                    <div className="w-12 h-12 bg-forest-100 dark:bg-forest-900/30 rounded-xl flex items-center justify-center mx-auto mb-3 text-forest-600 dark:text-forest-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section-spacing bg-gray-50 dark:bg-gray-900/50">
          <div className="section-container">
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              What We Offer
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  emoji: '🔬',
                  title: 'AI Tree Identification',
                  desc: 'Upload a photo of any tree, leaf, flower, or bark and our AI will identify it instantly, matching it to our verified database.',
                },
                {
                  emoji: '📚',
                  title: 'Botanical Information',
                  desc: 'Detailed information about taxonomy, habitat, distribution, characteristics, and uses of hundreds of tree species.',
                },
                {
                  emoji: '🌏',
                  title: 'Bilingual Support',
                  desc: 'Access tree information in both Bangla and English, making knowledge accessible to all communities in Bangladesh.',
                },
                {
                  emoji: '🤝',
                  title: 'Community Contributions',
                  desc: 'Anyone can contribute tree information without creating an account. All submissions are reviewed by our team.',
                },
                {
                  emoji: '📱',
                  title: 'Mobile Friendly',
                  desc: 'Use your phone camera to identify trees on the go. Our responsive design works perfectly on all devices.',
                },
                {
                  emoji: '🆓',
                  title: 'Free & Open',
                  desc: 'GachPala is completely free to use. No account required for browsing, searching, or AI identification.',
                },
              ].map((feature) => (
                <div key={feature.title} className="premium-card p-6">
                  <div className="text-4xl mb-4">{feature.emoji}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Disclaimer */}
        <section className="section-spacing">
          <div className="section-container">
            <div className="premium-card p-8 border-yellow-200 dark:border-yellow-800/30 bg-yellow-50 dark:bg-yellow-900/10">
              <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-3">
                ⚠️ Important Notice About AI Identification
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                AI tree identification is a powerful tool but is not infallible. Our AI provides an estimate based on visual analysis and may not always be 100% accurate, especially with:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 text-sm mb-3">
                <li>Similar-looking species</li>
                <li>Juvenile or atypical specimens</li>
                <li>Low-quality or partial images</li>
                <li>Rare or uncommon species not well-represented in training data</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Always verify important identifications with a qualified botanist or reliable field guide. Information about medicinal or traditional uses is for educational purposes only and should not be considered medical advice.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
