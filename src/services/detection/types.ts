/**
 * AI Tree Detection Types
 * Provider-independent interfaces for the detection system
 */

export interface DetectionPrediction {
  scientificName: string;
  commonName: string;
  confidence: number;
  family?: string;
  genus?: string;
  species?: string;
}

export interface DetectionProvider {
  name: string;
  detect(imageBuffer: Buffer, mimeType: string): Promise<DetectionPrediction[]>;
}

export interface DetectionConfig {
  provider: string;
  confidenceThreshold: number;
  maxPredictions: number;
}

export const DEFAULT_CONFIG: DetectionConfig = {
  provider: process.env.AI_PROVIDER || 'custom',
  confidenceThreshold: process.env.AI_CONFIDENCE_THRESHOLD
    ? parseFloat(process.env.AI_CONFIDENCE_THRESHOLD)
    : 0.45,
  maxPredictions: 5,
};

