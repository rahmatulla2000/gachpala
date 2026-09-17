/**
 * Custom Keras/FastAPI AI Detection Provider
 * 
 * Connects to a local or remote Python server running the trained
 * MobileNetV3Large_FruitTree_92.67.keras model.
 */

import type { DetectionProvider, DetectionPrediction } from '../types';

interface CustomModelPrediction {
  className: string;
  banglaName?: string;
  englishName?: string;
  scientificName?: string;
  family?: string;
  genus?: string;
  confidence: number;
}

interface CustomModelResponse {
  success: boolean;
  predictions: CustomModelPrediction[];
  error?: string;
}

export class CustomModelProvider implements DetectionProvider {
  name = 'custom_mobilenet_v3';

  async detect(imageBuffer: Buffer, mimeType: string): Promise<DetectionPrediction[]> {
    const serviceUrl = process.env.CUSTOM_AI_URL || 'http://127.0.0.1:5000/predict';

    const formData = new FormData();
    const extension = mimeType.split('/')[1] || 'jpg';
    const blob = new Blob([new Uint8Array(imageBuffer)], { type: mimeType });
    formData.append('file', blob, `tree_image.${extension}`);

    let response: Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      response = await fetch(serviceUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (errorMsg.includes('abort')) {
        throw new Error('AI Model Server timed out after 15 seconds. Please ensure the Python server is responding.');
      }
      throw new Error(`Cannot connect to AI Model Server at ${serviceUrl}. Please check if the Python server is running.`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI Model Server error (${response.status}): ${errorText}`);
    }

    const data: CustomModelResponse = await response.json();

    if (!data.success || !Array.isArray(data.predictions)) {
      throw new Error(data.error || 'Invalid response from AI Model Server');
    }

    return data.predictions.map((p) => ({
      scientificName: p.scientificName || p.englishName || p.className,
      commonName: p.englishName || p.banglaName || p.className,
      confidence: p.confidence,
      family: p.family,
      genus: p.genus,
    }));
  }
}
