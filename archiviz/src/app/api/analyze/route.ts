import { NextRequest, NextResponse } from 'next/server';
import { parseRepoUrl, fetchFileTree, fetchFileContent } from '@/lib/github/fetcher';
import { selectPriorityFiles, truncateContent } from '@/lib/github/filePriority';
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/llm/prompt';
import { DiagramSchemaZod } from '@/lib/llm/schema';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_RETRIES = 3;

export async function POST(req: NextRequest) {
  try {
    const { repoUrl, githubToken } = await req.json();

    if (!repoUrl) {
      return NextResponse.json({ error: 'repoUrl is required' }, { status: 400 });
    }

    const { owner, repo } = parseRepoUrl(repoUrl);
    const token = githubToken || process.env.GITHUB_TOKEN;

    // Step 1: fetch file tree
    const allFiles = await fetchFileTree(owner, repo, token);
    const prioritized = selectPriorityFiles(allFiles);

    if (prioritized.length === 0) {
      return NextResponse.json(
        { error: 'No architecture-related files found in this repository' },
        { status: 422 }
      );
    }

    // Step 2: fetch file contents
    const files = await Promise.all(
      prioritized.map(async ({ path }) => {
        const content = await fetchFileContent(owner, repo, path, token);
        return { path, content: truncateContent(content) };
      })
    );

    // Step 3: LLM analysis with retries
    let lastError: unknown;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const message = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: buildUserPrompt(files) }],
        });

        const raw = message.content[0];
        if (raw.type !== 'text') throw new Error('Unexpected LLM response type');

        const json = JSON.parse(raw.text);
        const diagram = DiagramSchemaZod.parse(json);

        return NextResponse.json({
          diagram,
          filesAnalyzed: files.map(f => f.path),
          tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
        });
      } catch (err) {
        lastError = err;
        if (attempt < MAX_RETRIES) continue;
      }
    }

    const message = lastError instanceof Error ? lastError.message : 'Analysis failed';
    return NextResponse.json({ error: message }, { status: 500 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
