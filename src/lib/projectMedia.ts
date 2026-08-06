import { readdirSync } from 'node:fs';
import { extname, join } from 'node:path';

const IMAGE_EXTENSIONS = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp']);
const PLACEHOLDER_PATTERN = /^(?:portada|galeria-\d+)\.svg$/i;
const COVER_PATTERN = /(?:^|-)0\.[^.]+$/i;

export function getProjectMedia(slug: string, fallbackCover?: string, sequencePrefix?: string) {
  const directory = join(process.cwd(), 'public', 'imagenes', 'proyectos', slug);
  let files: string[] = [];

  try {
    files = readdirSync(directory, { withFileTypes: true })
      .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase()))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));
  } catch {
    // A project can exist before its media folder is uploaded.
  }

  const displayFiles = files.some((file) => !PLACEHOLDER_PATTERN.test(file))
    ? files.filter((file) => !PLACEHOLDER_PATTERN.test(file))
    : files;
  const toPublicPath = (file: string) =>
    `/imagenes/proyectos/${encodeURIComponent(slug)}/${encodeURIComponent(file)}`;
  const sequenceFiles = sequencePrefix
    ? displayFiles.filter((file) => file.toLocaleLowerCase('es').startsWith(sequencePrefix.toLocaleLowerCase('es')))
    : [];
  const imageFiles = displayFiles.filter((file) => !sequenceFiles.includes(file));
  const coverFile =
    displayFiles.find((file) => COVER_PATTERN.test(file)) ??
    displayFiles.find((file) => /^portada\./i.test(file)) ??
    displayFiles[0];

  return {
    cover: coverFile ? toPublicPath(coverFile) : fallbackCover,
    images: imageFiles.map(toPublicPath),
    sequenceFrames: sequenceFiles.map(toPublicPath),
  };
}
