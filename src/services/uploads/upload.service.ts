/**
 * Upload Service
 * Handles image uploads with Cloudinary support and local fallback
 */

import { ALLOWED_IMAGE_FORMATS, MAX_FILE_SIZE } from '@/types';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

interface UploadResult {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
}

/**
 * Validate an image file
 */
export function validateImage(file: File | { type: string; size: number }): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  if (!ALLOWED_IMAGE_FORMATS.includes(file.type as (typeof ALLOWED_IMAGE_FORMATS)[number])) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload JPG, JPEG, PNG, or WEBP images.',
    };
  }

  // Check file size
  const maxSize = parseInt(process.env.MAX_FILE_SIZE_MB || '10') * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${process.env.MAX_FILE_SIZE_MB || '10'}MB.`,
    };
  }

  return { valid: true };
}

/**
 * Upload image to Cloudinary
 */
async function uploadToCloudinary(
  buffer: Buffer,
  folder: string
): Promise<UploadResult> {
  const cloudinary = (await import('cloudinary')).v2;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `knows-about-tree/${folder}`,
          transformation: [
            { width: 1200, height: 1200, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
            });
          }
        }
      )
      .end(buffer);
  });
}

/**
 * Upload image to local filesystem (development fallback)
 */
async function uploadToLocal(
  buffer: Buffer,
  filename: string,
  folder: string
): Promise<UploadResult> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
  await mkdir(uploadDir, { recursive: true });

  const uniqueName = `${Date.now()}-${filename}`;
  const filePath = path.join(uploadDir, uniqueName);
  await writeFile(filePath, buffer);

  return {
    url: `/uploads/${folder}/${uniqueName}`,
  };
}

/**
 * Upload an image file
 */
export async function uploadImage(
  file: File,
  folder = 'trees'
): Promise<UploadResult> {
  const validation = validateImage(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Use Cloudinary if configured, otherwise fall back to local
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    return uploadToCloudinary(buffer, folder);
  }

  return uploadToLocal(buffer, file.name, folder);
}

/**
 * Upload multiple images
 */
export async function uploadImages(
  files: File[],
  folder = 'trees'
): Promise<UploadResult[]> {
  const maxFiles = parseInt(process.env.MAX_FILES_PER_UPLOAD || '10');
  if (files.length > maxFiles) {
    throw new Error(`Maximum ${maxFiles} files per upload.`);
  }

  return Promise.all(files.map(file => uploadImage(file, folder)));
}
