import { Leaf, Droplets, Wind, Heart } from 'lucide-react';

const reasons = [
  {
    icon: Wind,
    title: 'Clean Air',
    description: 'Trees absorb carbon dioxide and release oxygen, purifying the air we breathe.',
  },
  {
    icon: Droplets,
    title: 'Water Conservation',
    description: 'Tree roots prevent soil erosion and help maintain the water cycle.',
  },
  {
    icon: Leaf,
    title: 'Biodiversity',
    description: 'Trees provide habitats for thousands of species of plants and animals.',
  },
  {
    icon: Heart,
    title: 'Human Wellbeing',
    description: 'Trees improve mental health, reduce stress, and enhance quality of life.',
  },
];

export function WhyTreesMatter() {
  return (
    <section className="section-spacing bg-forest-50/50 dark:bg-forest-950/20">
      <div className="section-container">
        <div className="text-center mb-12">
          <span className="text-forest-600 dark:text-forest-400 text-sm font-semibold uppercase tracking-wider mb-2 block">
            Why It Matters
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Why Trees Matter
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Understanding trees is the first step to protecting them. Every tree plays a vital role in our ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="premium-card p-6 text-center group"
            >
              <div className="w-14 h-14 bg-forest-100 dark:bg-forest-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-forest-600 dark:text-forest-400 group-hover:scale-110 transition-transform">
                <reason.icon className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {reason.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
