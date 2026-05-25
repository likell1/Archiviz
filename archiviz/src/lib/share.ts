import { DiagramSchema } from '@/types/diagram';

export function encodeDiagram(diagram: DiagramSchema): string {
  return btoa(encodeURIComponent(JSON.stringify(diagram)));
}

export function decodeDiagram(encoded: string): DiagramSchema | null {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return null;
  }
}

export function buildShareUrl(diagram: DiagramSchema): string {
  const encoded = encodeDiagram(diagram);
  const url = new URL(window.location.href);
  url.hash = `diagram=${encoded}`;
  return url.toString();
}

export function readDiagramFromHash(): DiagramSchema | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.slice(1);
  const params = new URLSearchParams(hash);
  const encoded = params.get('diagram');
  if (!encoded) return null;
  return decodeDiagram(encoded);
}
