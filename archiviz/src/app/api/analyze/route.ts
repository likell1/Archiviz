import { NextRequest, NextResponse } from 'next/server';
import {
  detectUrlMode,
  parseRepoUrl,
  parseOrgUrl,
  fetchFileTree,
  fetchFileContent,
  fetchOrgRepos,
} from '@/lib/github/fetcher';
import { selectPriorityFiles, truncateContent } from '@/lib/github/filePriority';
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, ORG_SYSTEM_PROMPT, buildUserPrompt, buildOrgUserPrompt } from '@/lib/llm/prompt';
import { DiagramSchemaZod } from '@/lib/llm/schema';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_RETRIES = 3;
const MAX_ORG_REPOS = 15;

export async function POST(req: NextRequest) {
  try {
    const { repoUrl, githubToken } = await req.json();

    if (!repoUrl) {
      return NextResponse.json({ error: 'repoUrl is required' }, { status: 400 });
    }

    const token = githubToken || process.env.GITHUB_TOKEN;
    const mode = detectUrlMode(repoUrl);

    if (mode === 'org') {
      return handleOrgMode(repoUrl, token);
    } else {
      return handleRepoMode(repoUrl, token);
    }
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 });
  }
}

async function handleRepoMode(repoUrl: string, token?: string) {
  const { owner, repo } = parseRepoUrl(repoUrl);

  const allFiles = await fetchFileTree(owner, repo, token);
  const prioritized = selectPriorityFiles(allFiles, false);

  if (prioritized.length === 0) {
    return NextResponse.json(
      { error: 'No architecture-related files found in this repository' },
      { status: 422 }
    );
  }

  const files = await Promise.all(
    prioritized.map(async ({ path }) => {
      const content = await fetchFileContent(owner, repo, path, token);
      return { path, content: truncateContent(content, false) };
    })
  );

  return callLLM({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: buildUserPrompt(files),
    filesAnalyzed: files.map(f => f.path),
  });
}

async function handleOrgMode(repoUrl: string, token?: string) {
  const { owner } = parseOrgUrl(repoUrl);

  // Step 1: fetch repo list
  const repos = await fetchOrgRepos(owner, token, MAX_ORG_REPOS);

  if (repos.length === 0) {
    return NextResponse.json(
      { error: 'No public repositories found for this organization' },
      { status: 422 }
    );
  }

  // Step 2: fetch files for each repo in parallel
  const repoData = await Promise.all(
    repos.map(async (r) => {
      try {
        const allFiles = await fetchFileTree(owner, r.name, token);
        const prioritized = selectPriorityFiles(allFiles, true);
        const files = await Promise.all(
          prioritized.map(async ({ path }) => {
            const content = await fetchFileContent(owner, r.name, path, token);
            return { path, content: truncateContent(content, true) };
          })
        );
        return { repo: r.name, files };
      } catch {
        // Skip repos that fail (e.g., empty repos)
        return { repo: r.name, files: [] };
      }
    })
  );

  const nonEmpty = repoData.filter(r => r.files.length > 0);

  if (nonEmpty.length === 0) {
    return NextResponse.json(
      { error: 'No architecture-related files found in any repository of this organization' },
      { status: 422 }
    );
  }

  const filesAnalyzed = nonEmpty.flatMap(r =>
    r.files.map(f => `${r.repo}/${f.path}`)
  );

  return callLLM({
    systemPrompt: ORG_SYSTEM_PROMPT,
    userPrompt: buildOrgUserPrompt(nonEmpty),
    filesAnalyzed,
    reposAnalyzed: nonEmpty.map(r => r.repo),
  });
}

async function callLLM({
  systemPrompt,
  userPrompt,
  filesAnalyzed,
  reposAnalyzed,
}: {
  systemPrompt: string;
  userPrompt: string;
  filesAnalyzed: string[];
  reposAnalyzed?: string[];
}) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const raw = message.content[0];
      if (raw.type !== 'text') throw new Error('Unexpected LLM response type');

      if (message.stop_reason === 'max_tokens') {
        throw new Error('LLM response was truncated — too many services detected. Try a single repository instead.');
      }

      const stripped = raw.text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
      const json = JSON.parse(stripped);
      const diagram = DiagramSchemaZod.parse(json);

      return NextResponse.json({
        diagram,
        filesAnalyzed,
        reposAnalyzed: reposAnalyzed ?? null,
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
      });
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES) continue;
    }
  }

  return NextResponse.json({ error: friendlyError(lastError) }, { status: 500 });
}

function friendlyError(err: unknown): string {
  if (!(err instanceof Error)) return 'Unknown error';
  const match = err.message.match(/^\d{3}\s+(\{[\s\S]+\})$/);
  if (match) {
    try {
      const body = JSON.parse(match[1]);
      const inner = body?.error?.message;
      if (inner) return inner;
    } catch { /* fall through */ }
  }
  return err.message;
}
