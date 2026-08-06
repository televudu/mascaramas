import { getCollection, getEntry } from 'astro:content';
import { getProjectMedia } from './projectMedia';

export async function getCatalogData() {
  const projectEntries = (await getCollection('proyectos'))
    .filter((project) => project.data.visible)
    .sort((a, b) => b.data.order - a.data.order);
  const informationEntry = await getEntry('sitio', 'informacion');

  if (!informationEntry) {
    throw new Error('No se encontro src/content/sitio/informacion.md');
  }

  const projects = projectEntries.flatMap((project) => {
    const media = getProjectMedia(project.data.slug, project.data.cover);
    if (!media.cover) return [];

    return [{
      title: project.data.title,
      slug: project.data.slug,
      year: project.data.year,
      cover: media.cover,
      images: media.images,
      videos: [...new Set([project.data.video, ...project.data.videos].filter((video): video is string => Boolean(video)))],
      videoAspect: project.data.videoAspect,
      synopsis: project.body ?? '',
    }];
  });

  return { projects, information: informationEntry.data };
}
