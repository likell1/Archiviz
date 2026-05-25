import { z } from 'zod';

export const DiagramSchemaZod = z.object({
  meta: z.object({
    title: z.string(),
    provider: z.enum(['aws', 'gcp', 'azure', 'mixed', 'unknown']),
    direction: z.enum(['LR', 'TB']),
  }),
  groups: z.array(z.object({
    id: z.string(),
    label: z.string(),
    type: z.enum(['vpc', 'subnet', 'az', 'cluster', 'custom']),
    parent: z.string().nullable(),
  })),
  nodes: z.array(z.object({
    id: z.string(),
    service: z.string(),
    label: z.string(),
    group: z.string().nullable(),
    external: z.boolean(),
  })),
  edges: z.array(z.object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    label: z.string().optional(),
    style: z.enum(['solid', 'dashed']),
    animated: z.boolean(),
  })),
});

export type DiagramSchemaType = z.infer<typeof DiagramSchemaZod>;
