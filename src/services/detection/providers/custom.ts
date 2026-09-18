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
    const rawUrl = process.env.CUSTOM_AI_URL || 'http://127.0.0.1:7860/predict';
    const baseUrl = rawUrl.replace(/\/predict\/?$/, '').replace(/\/$/, '');
    const extension = mimeType.split('/')[1] || 'jpg';
    const filename = `tree_image.${extension}`;
    const blob = new Blob([new Uint8Array(imageBuffer)], { type: mimeType });

    // 1. Try standard FastAPI /predict endpoint first
    try {
      const formData = new FormData();
      formData.append('file', blob, filename);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(`${baseUrl}/predict`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data: CustomModelResponse = await res.json();
        if (data.success && Array.isArray(data.predictions)) {
          return data.predictions.map((p) => ({
            scientificName: p.scientificName || p.englishName || p.className,
            commonName: p.englishName || p.banglaName || p.className,
            confidence: p.confidence,
            family: p.family,
            genus: p.genus,
          }));
        }
      }
    } catch {
      // Fallback to Gradio API if direct /predict fails or is not available
    }

    // 2. Fallback: Hugging Face Gradio Native API (/gradio_api/upload + /gradio_api/call)
    try {
      // Step A: Upload image to Gradio
      const uploadFormData = new FormData();
      uploadFormData.append('files', blob, filename);

      const uploadRes = await fetch(`${baseUrl}/gradio_api/upload`, {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadRes.ok) {
        throw new Error(`Gradio upload failed (${uploadRes.status})`);
      }

      const uploadResult = await uploadRes.json();
      const uploadedPath = Array.isArray(uploadResult) ? uploadResult[0] : null;

      if (!uploadedPath) {
        throw new Error('Gradio did not return an uploaded file path.');
      }

      // Step B: Call Gradio prediction endpoint
      const callRes = await fetch(`${baseUrl}/gradio_api/call/gradio_predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [{ path: uploadedPath, meta: { _type: 'gradio.FileData' } }],
        }),
      });

      if (!callRes.ok) {
        throw new Error(`Gradio call failed (${callRes.status})`);
      }

      const callData = await callRes.json();
      const eventId = callData.event_id;

      if (!eventId) {
        throw new Error('No event_id returned from Gradio call.');
      }

      // Step C: Fetch result SSE
      const sseRes = await fetch(`${baseUrl}/gradio_api/call/gradio_predict/${eventId}`);
      const sseText = await sseRes.text();

      // Look for event: complete \n data: [...]
      const lines = sseText.split('\n');
      let resultData: any = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('data:')) {
          try {
            const parsed = JSON.parse(line.substring(5).trim());
            if (Array.isArray(parsed) && parsed.length > 0) {
              resultData = parsed[0];
            }
          } catch {
            // Ignore non-JSON lines
          }
        }
      }

      if (resultData && Array.isArray(resultData.confidences)) {
        return resultData.confidences.map((c: { label: string; confidence: number }) => {
          // Label format is "BanglaName (EnglishName)" or just class name
          const match = c.label.match(/^([^(]+)\s*\(([^)]+)\)$/);
          const bangla = match ? match[1].trim() : c.label;
          const english = match ? match[2].trim() : c.label;

          return {
            scientificName: english,
            commonName: english || bangla,
            confidence: c.confidence,
          };
        });
      }

      throw new Error('Invalid Gradio output format');
    } catch (gradioErr: unknown) {
      const msg = gradioErr instanceof Error ? gradioErr.message : String(gradioErr);
      throw new Error(`AI Model Server error: ${msg}`);
    }
  }
}
