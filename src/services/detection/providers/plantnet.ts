/**
 * PlantNet AI Detection Provider
 * 
 * Uses the PlantNet API (https://my-api.plantnet.org/) for real tree identification.
 * Free tier available. Requires PLANTNET_API_KEY environment variable.
 */

import type { DetectionProvider, DetectionPrediction } from '../types';

const PLANTNET_API_URL = 'https://my-api.plantnet.org/v2/identify/all';

interface PlantNetResult {
  score: number;
  species: {
    scientificNameWithoutAuthor: string;
    scientificNameAuthorship: string;
    genus: { scientificNameWithoutAuthor: string };
    family: { scientificNameWithoutAuthor: string };
    commonNames: string[];
  };
}

interface PlantNetResponse {
  results: PlantNetResult[];
  bestMatch: string;
}

export class PlantNetProvider implements DetectionProvider {
  name = 'plantnet';

  async detect(imageBuffer: Buffer, mimeType: string): Promise<DetectionPrediction[]> {
    const apiKey = process.env.PLANTNET_API_KEY;
    if (!apiKey) {
      throw new Error('PlantNet API key is not configured. Set PLANTNET_API_KEY in your .env file.');
    }

    const formData = new FormData();
    const blob = new Blob([new Uint8Array(imageBuffer)], { type: mimeType });
    formData.append('images', blob, `image.${mimeType.split('/')[1]}`);
    formData.append('organs', 'auto');

    const response = await fetch(
      `${PLANTNET_API_URL}?include-related-images=false&no-reject=false&nb-results=5&lang=en&api-key=${apiKey}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 404) {
        // PlantNet returns 404 when it can't identify the plant
        return [];
      }
      throw new Error(`PlantNet API error: ${response.status} - ${errorText}`);
    }

    const data: PlantNetResponse = await response.json();

    return data.results.map((result) => ({
      scientificName: result.species.scientificNameWithoutAuthor,
      commonName: result.species.commonNames?.[0] || result.species.scientificNameWithoutAuthor,
      confidence: result.score,
      family: result.species.family?.scientificNameWithoutAuthor,
      genus: result.species.genus?.scientificNameWithoutAuthor,
      species: result.species.scientificNameWithoutAuthor.split(' ').slice(1).join(' '),
    }));
  }
}
