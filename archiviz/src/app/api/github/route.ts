import { NextRequest, NextResponse } from 'next/server';
import { parseRepoUrl, fetchFileTree, fetchFileContent } from '@/lib/github/fetcher';
import { selectPriorityFiles, truncateContent } from '@/lib/github/filePriority';

export async function POST(req: NextRequest) {
  try {
    const { repoUrl, githubToken } = await req.json();

    if (!repoUrl) {
      return NextResponse.json({ error: 'repoUrl is required' }, { status: 400 });
    }

    const { owner, repo } = parseRepoUrl(repoUrl);
    const token = githubToken || process.env.GITHUB_TOKEN;

    const allFiles = await fetchFileTree(owner, repo, token);
    const prioritized = selectPriorityFiles(allFiles);

    const files = await Promise.all(
      prioritized.map(async ({ path, priority }) => {
        const content = await fetchFileContent(owner, repo, path, token);
        return { path, priority, content: truncateContent(content) };
      })
    );

    return NextResponse.json({ files, total: allFiles.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
