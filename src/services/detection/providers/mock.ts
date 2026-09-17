/**
 * MOCK AI Detection Provider
 * 
 * ⚠️ DEVELOPMENT USE ONLY
 * This provider returns realistic but simulated predictions.
 * It is clearly labeled as a mock and should NEVER be used in production.
 * Replace with a real provider (PlantNet, Plant.id) for actual tree identification.
 */

import type { DetectionProvider, DetectionPrediction } from '../types';

// Mock database of trees the "AI" can identify
const MOCK_TREES: DetectionPrediction[] = [
  {
    scientificName: 'Mangifera indica',
    commonName: 'Mango Tree',
    confidence: 0.94,
    family: 'Anacardiaceae',
    genus: 'Mangifera',
    species: 'indica',
  },
  {
    scientificName: 'Artocarpus heterophyllus',
    commonName: 'Jackfruit Tree',
    confidence: 0.88,
    family: 'Moraceae',
    genus: 'Artocarpus',
    species: 'heterophyllus',
  },
  {
    scientificName: 'Azadirachta indica',
    commonName: 'Neem Tree',
    confidence: 0.91,
    family: 'Meliaceae',
    genus: 'Azadirachta',
    species: 'indica',
  },
  {
    scientificName: 'Ficus benghalensis',
    commonName: 'Banyan Tree',
    confidence: 0.85,
    family: 'Moraceae',
    genus: 'Ficus',
    species: 'benghalensis',
  },
  {
    scientificName: 'Cocos nucifera',
    commonName: 'Coconut Palm',
    confidence: 0.92,
    family: 'Arecaceae',
    genus: 'Cocos',
    species: 'nucifera',
  },
  {
    scientificName: 'Psidium guajava',
    commonName: 'Guava Tree',
    confidence: 0.87,
    family: 'Myrtaceae',
    genus: 'Psidium',
    species: 'guajava',
  },
  {
    scientificName: 'Litchi chinensis',
    commonName: 'Litchi Tree',
    confidence: 0.89,
    family: 'Sapindaceae',
    genus: 'Litchi',
    species: 'chinensis',
  },
  {
    scientificName: 'Samanea saman',
    commonName: 'Rain Tree',
    confidence: 0.83,
    family: 'Fabaceae',
    genus: 'Samanea',
    species: 'saman',
  },
];

export class MockDetectionProvider implements DetectionProvider {
  name = 'mock';

  async detect(_imageBuffer: Buffer, _mimeType: string): Promise<DetectionPrediction[]> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Pick a random primary tree
    const primaryIdx = Math.floor(Math.random() * MOCK_TREES.length);
    const primary = { ...MOCK_TREES[primaryIdx] };

    // Add some randomness to confidence
    primary.confidence = Math.min(0.99, primary.confidence + (Math.random() * 0.06 - 0.03));

    // Pick 2 more as alternatives with lower confidence
    const alternatives: DetectionPrediction[] = [];
    const usedIndices = new Set([primaryIdx]);

    for (let i = 0; i < 2; i++) {
      let idx: number;
      do {
        idx = Math.floor(Math.random() * MOCK_TREES.length);
      } while (usedIndices.has(idx));
      usedIndices.add(idx);

      alternatives.push({
        ...MOCK_TREES[idx],
        confidence: Math.max(0.01, 0.15 - i * 0.05 + (Math.random() * 0.1 - 0.05)),
      });
    }

    return [primary, ...alternatives].sort((a, b) => b.confidence - a.confidence);
  }
}
