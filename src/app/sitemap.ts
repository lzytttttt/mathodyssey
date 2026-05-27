import type { MetadataRoute } from 'next';
import { getAllNodes } from '@/lib/data/nodes';

const BASE_URL = 'https://mathodyssey.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const nodes = await getAllNodes();

  const nodeEntries: MetadataRoute.Sitemap = nodes.map((node) => ({
    url: `${BASE_URL}/timeline/${node.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const experimentEntries: MetadataRoute.Sitemap = nodes
    .flatMap((node) => node.experiments)
    .map((exp) => ({
      url: `${BASE_URL}/experiments/${exp.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/guide/teacher`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/docs/data`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/docs/api`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contribute`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...nodeEntries,
    ...experimentEntries,
  ];
}
