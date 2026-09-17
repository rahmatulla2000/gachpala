'use client';

import { useEffect, useRef, useState } from 'react';
import { TreePine, Tag, BookOpen } from 'lucide-react';
import type { PublicStats } from '@/types';

const statConfig = [
  { key: 'totalTrees', label: 'Total Trees', icon: TreePine, color: 'text-forest-600 dark:text-forest-400', bg: 'bg-forest-100 dark:bg-forest-900/30' },
  { key: 'totalCategories', label: 'Categories', icon: Tag, color: 'text-earth-600 dark:text-earth-400', bg: 'bg-earth-100 dark:bg-earth-900/30' },
  { key: 'approvedContributions', label: 'Contributions', icon: BookOpen, color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-100 dark:bg-primary-900/30' },
] as const;

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(target || 0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [started, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export function Statistics({ stats }: { stats: PublicStats }) {
  return (
    <section className="section-spacing bg-white dark:bg-gray-900/50">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Our Growing Database
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Explore our comprehensive collection of trees, powered by community contributions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {statConfig.map(({ key, label, icon: Icon, color, bg }) => (
            <div
              key={key}
              className="premium-card p-6 md:p-8 text-center group hover:scale-[1.02] transition-transform"
            >
              <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-7 h-7 ${color}`} />
              </div>
              <div className={`text-3xl md:text-4xl font-bold ${color} mb-1`}>
                <AnimatedCounter target={stats[key]} />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
