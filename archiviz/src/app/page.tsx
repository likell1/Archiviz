'use client';

import { useState } from 'react';

interface AnalyzeResult {
  filesAnalyzed: string[];
  tokensUsed: number;
  diagram: unknown;
}

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, githubToken: githubToken || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Analysis failed');
        return;
      }

      setResult(data);
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-2 text-center">Archiviz</h1>
        <p className="text-gray-400 text-center mb-10">
          GitHub 레포지토리 URL을 입력하면 아키텍처 다이어그램을 자동 생성합니다
        </p>

        <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">GitHub Repository URL</label>
            <input
              type="url"
              value={repoUrl}
              onChange={e => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              GitHub Token <span className="text-gray-600">(optional — private repos only)</span>
            </label>
            <input
              type="password"
              value={githubToken}
              onChange={e => setGithubToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxx"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? '분석 중...' : '다이어그램 생성'}
          </button>
        </form>

        {error && (
          <div className="mt-6 bg-red-950 border border-red-800 text-red-300 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 bg-gray-900 border border-gray-700 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3 text-green-400">분석 완료</h2>
            <p className="text-sm text-gray-400 mb-1">
              분석 파일: {result.filesAnalyzed.length}개
            </p>
            <p className="text-sm text-gray-400 mb-3">
              사용 토큰: {result.tokensUsed.toLocaleString()}
            </p>
            <ul className="text-sm text-gray-500 mb-4 space-y-0.5">
              {result.filesAnalyzed.map(f => (
                <li key={f} className="font-mono">• {f}</li>
              ))}
            </ul>
            <pre className="bg-gray-950 rounded p-3 text-xs text-gray-300 overflow-auto max-h-64">
              {JSON.stringify(result.diagram, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
