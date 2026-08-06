import { getCollection, getEntry } from 'astro:content';
import { getProjectMedia } from './projectMedia';

export async function getCatalogData() {
  const projectEntries = (await getCollection('proyectos'))
    .filter((project) => project.data.visible)
    .sort((a, b) =>
      b.data.year - a.data.year ||
      a.data.title.localeCompare(b.data.title, 'es', { sensitivity: 'base', numeric: true }),
    );
  const informationEntry = await getEntry('sitio', 'informacion');

  if (!informationEntry) {
    throw new Error('No se encontro src/content/sitio/informacion.md');
  }

  const projects = projectEntries.map((project) => {
    const media = getProjectMedia(project.data.slug, project.data.cover);

    return {
      title: project.data.title,
      slug: project.data.slug,
      year: project.data.year,
      category: project.data.category,
      images: media.images,
      videos: [...new Set([project.data.video, ...project.data.videos].filter((video): video is string => Boolean(video)))],
      videoAspect: project.data.videoAspect,
      synopsisHtml: project.rendered?.html ?? '',
    };
  });

  return { projects, information: informationEntry.data };
}
