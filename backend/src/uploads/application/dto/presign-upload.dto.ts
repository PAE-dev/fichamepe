import { IsIn, IsString, MinLength } from 'class-validator';

export const UPLOAD_TYPES = ['avatar', 'portfolio', 'service_cover'] as const;
export const ALLOWED_IMAGE_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export class PresignUploadBodyDto {
  @IsString()
  @MinLength(1)
  filename!: string;

  @IsString()
  @MinLength(1)
  @IsIn(ALLOWED_IMAGE_CONTENT_TYPES)
  contentType!: string;

  @IsString()
  @IsIn(UPLOAD_TYPES)
  type!: (typeof UPLOAD_TYPES)[number];
}
