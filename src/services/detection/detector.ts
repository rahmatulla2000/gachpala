/**
 * Main Detection Service
 * Orchestrates the flow: Image → AI Provider → Database Matching → Result
 */

import { getDetectionProvider } from './provider';
import { DEFAULT_CONFIG } from './types';
import type { DetectionPrediction } from './types';
import { findTreeByPrediction } from '@/services/trees/tree.service';
import type { DetectionResult } from '@/types';

/**
 * Detect a tree from an image buffer
 * Flow: Image → AI Prediction → Database Matching → Enriched Result
 */
export async function detectTree(
  imageBuffer: Buffer,
  mimeType: string
): Promise<DetectionResult> {
  const startTime = Date.now();
  const provider = getDetectionProvider();

  let predictions: DetectionPrediction[];

  try {
    predictions = await provider.detect(imageBuffer, mimeType);
  } catch (error) {
    console.error('AI detection error:', error);
    throw new Error('Tree identification is temporarily unavailable. Please try again later.');
  }

  // Filter predictions by confidence threshold
  const filteredPredictions = predictions
    .filter(p => p.confidence >= DEFAULT_CONFIG.confidenceThreshold)
    .slice(0, DEFAULT_CONFIG.maxPredictions);

  // Try to match the top prediction against our database
  let matchedTree = null;
  if (filteredPredictions.length > 0) {
    const topPrediction = filteredPredictions[0];
    try {
      matchedTree = await findTreeByPrediction(
        topPrediction.scientificName,
        topPrediction.commonName
      );
    } catch (error) {
      console.error('Database matching error:', error);
      // Don't fail the entire detection if DB matching fails
    }
  }

  return {
    predictions: filteredPredictions,
    matchedTree,
    provider: provider.name,
    processingTime: Date.now() - startTime,
  };
}

/**
 * Detect tree for admin verification
 * Used when admin wants to verify a submission's images
 */
export async function detectTreeForVerification(
  imageBuffer: Buffer,
  mimeType: string
): Promise<{
  predictions: DetectionPrediction[];
  provider: string;
}> {
  const provider = getDetectionProvider();

  try {
    const predictions = await provider.detect(imageBuffer, mimeType);
    return {
      predictions: predictions.slice(0, 5),
      provider: provider.name,
    };
  } catch (error) {
    console.error('AI verification error:', error);
    throw new Error('AI verification is temporarily unavailable.');
  }
}
