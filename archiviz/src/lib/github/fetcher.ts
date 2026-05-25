import { Octokit } from '@octokit/rest';

export type UrlMode = 'repo' | 'org';

export function detectUrlMode(url: string): UrlMode | null {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    if (!u.hostname.includes('github.com')) return null;
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length === 1) return 'org';
    if (parts.length >= 2) return 'repo';
    return null;
  } catch {
    return null;
  }
}

export function parseRepoUrl(url: string): { owner: string; repo: string } {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/.*)?$/);
  if (!match) throw new Error(`Invalid GitHub URL: ${url}`);
  return { owner: match[1], repo: match[2] };
}

export function parseOrgUrl(url: string): { owner: string } {
  const match = url.match(/github\.com\/([^/]+)\/?$/);
  if (!match) throw new Error(`Invalid GitHub org URL: ${url}`);
  return { owner: match[1] };
}

export interface RepoInfo {
  name: string;
  full_name: string;
  pushed_at: string | null;
  size: number;
  archived: boolean;
  fork: boolean;
}

export async function fetchOrgRepos(
  owner: string,
  token?: string,
  limit = 15
): Promise<RepoInfo[]> {
  const octokit = new Octokit({ auth: token });

  let repos: RepoInfo[] = [];

  // Try org endpoint first, fall back to user endpoint
  try {
    const { data } = await octokit.repos.listForOrg({
      org: owner,
      sort: 'pushed',
      direction: 'desc',
      per_page: Math.min(limit * 2, 50), // fetch extra to filter forks/archived
      type: 'public',
    });
    repos = data.map(r => ({
      name: r.name,
      full_name: r.full_name,
      pushed_at: r.pushed_at ?? null,
      size: r.size ?? 0,
      archived: r.archived ?? false,
      fork: r.fork ?? false,
    }));
  } catch {
    const { data } = await octokit.repos.listForUser({
      username: owner,
      sort: 'pushed',
      direction: 'desc',
      per_page: Math.min(limit * 2, 50),
      type: 'owner',
    });
    repos = data.map(r => ({
      name: r.name,
      full_name: r.full_name,
      pushed_at: r.pushed_at ?? null,
      size: r.size ?? 0,
      archived: r.archived ?? false,
      fork: r.fork ?? false,
    }));
  }

  return repos
    .filter(r => !r.archived && !r.fork && r.size > 0)
    .slice(0, limit);
}

export async function fetchFileTree(
  owner: string,
  repo: string,
  token?: string
): Promise<string[]> {
  const octokit = new Octokit({ auth: token });

  const { data } = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: 'HEAD',
    recursive: '1',
  });

  return data.tree
    .filter(item => item.type === 'blob' && item.path)
    .map(item => item.path!);
}

export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string,
  token?: string
): Promise<string> {
  const octokit = new Octokit({ auth: token });

  const { data } = await octokit.repos.getContent({ owner, repo, path });

  if ('content' in data && data.encoding === 'base64') {
    return Buffer.from(data.content, 'base64').toString('utf-8');
  }

  throw new Error(`Cannot read file content for: ${path}`);
}
