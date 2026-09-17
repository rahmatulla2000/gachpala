/**
 * AI Detection Provider Factory
 * Returns the configured detection provider based on environment settings.
 * The provider can be swapped without changing any other code.
 */

import type { DetectionProvider } from './types';
import { DEFAULT_CONFIG } from './types';
import { MockDetectionProvider } from './providers/mock';
import { PlantNetProvider } from './providers/plantnet';
import { CustomModelProvider } from './providers/custom';

export function getDetectionProvider(): DetectionProvider {
  const providerName = DEFAULT_CONFIG.provider?.toLowerCase();

  switch (providerName) {
    case 'custom':
    case 'keras':
    case 'mobilenet':
      return new CustomModelProvider();
    case 'plantnet':
      return new PlantNetProvider();
    case 'mock':
    default:
      return new MockDetectionProvider();
  }
}

