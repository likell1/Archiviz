import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/llm/prompt';
import { DiagramSchemaZod } from '@/lib/llm/schema';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_RETRIES = 3;

export async function POST(req: NextRequest) {
  const { files } = await req.json();

  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 });
  }

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
      if (raw.type !== 'text') throw new Error('Unexpected response type from LLM');

      const json = JSON.parse(raw.text);
      const diagram = DiagramSchemaZod.parse(json);

      return NextResponse.json({
        diagram,
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
      });
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES) continue;
    }
  }

  const message = lastError instanceof Error ? lastError.message : 'LLM analysis failed';
  return NextResponse.json({ error: message }, { status: 500 });
}
