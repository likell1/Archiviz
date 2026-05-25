'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { DiagramSchema } from '@/types/diagram';
import { useDiagramStore } from '@/store/diagramStore';
import { buildShareUrl, readDiagramFromHash } from '@/lib/share';

const DiagramCanvas = dynamic(() => import('@/components/diagram/DiagramCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-gray-950">
      <span className="text-gray-500 text-sm">캔버스 로딩 중...</span>
    </div>
  ),
});

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ filesAnalyzed: string[]; tokensUsed: number } | null>(null);

  const diagram = useDiagramStore((s) => s.diagram);
  const setDiagram = useDiagramStore((s) => s.setDiagram);
  const undo = useDiagramStore((s) => s.undo);
  const redo = useDiagramStore((s) => s.redo);
  const canUndo = useDiagramStore((s) => s.history.length > 0);
  const canRedo = useDiagramStore((s) => s.future.length > 0);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // URL 해시에서 다이어그램 복원
  useEffect(() => {
    const shared = readDiagramFromHash();
    if (shared) setDiagram(shared);
  }, [setDiagram]);

  // 다이어그램 변경 시 URL 해시 업데이트
  useEffect(() => {
    if (!diagram) {
      history.replaceState(null, '', window.location.pathname);
      return;
    }
    const url = buildShareUrl(diagram);
    history.replaceState(null, '', url);
  }, [diagram]);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

      setDiagram(data.diagram as DiagramSchema);
      setMeta({ filesAnalyzed: data.filesAnalyzed, tokensUsed: data.tokensUsed });
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    const reactFlowViewport = canvasRef.current?.querySelector('.react-flow__viewport') as HTMLElement | null;
    const target = reactFlowViewport ?? canvasRef.current;
    if (!target) return;
    const { toPng } = await import('html-to-image');
    const dataUrl = await toPng(target, { backgroundColor: '#030712', pixelRatio: 2 });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'architecture.png';
    a.click();
  }

  async function handleCopyShareLink() {
    if (!diagram) return;
    const url = buildShareUrl(diagram);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (diagram) {
    return (
      <div className="h-screen flex flex-col bg-gray-50 text-gray-900">
        {/* 상단 툴바 */}
        <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg text-orange-500">Archiviz</span>
            <span className="text-gray-400 text-sm truncate max-w-xs">{repoUrl}</span>
          </div>
          <div className="flex items-center gap-2">
            {meta && (
              <span className="text-xs text-gray-400 mr-2">
                {meta.filesAnalyzed.length}개 파일 · {meta.tokensUsed.toLocaleString()} tokens
              </span>
            )}
            <button
              onClick={undo}
              disabled={!canUndo}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed rounded text-gray-700"
            >
              Undo
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed rounded text-gray-700"
            >
              Redo
            </button>
            <button
              onClick={handleCopyShareLink}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
            >
              {copied ? '복사됨!' : '링크 공유'}
            </button>
            <button
              onClick={handleExport}
              className="px-3 py-1.5 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded"
            >
              PNG 내보내기
            </button>
            <button
              onClick={() => { setDiagram(null as unknown as DiagramSchema); setMeta(null); }}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
            >
              새 분석
            </button>
          </div>
        </header>

        {/* 캔버스 */}
        <div ref={canvasRef} className="flex-1 overflow-hidden">
          <DiagramCanvas diagram={diagram} />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-2 text-center text-orange-500">Archiviz</h1>
        <p className="text-gray-500 text-center mb-10">
          GitHub 레포지토리 URL을 입력하면 아키텍처 다이어그램을 자동 생성합니다
        </p>

        <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">GitHub Repository URL</label>
            <input
              type="url"
              value={repoUrl}
              onChange={e => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">
              GitHub Token <span className="text-gray-400">(optional — private repos only)</span>
            </label>
            <input
              type="password"
              value={githubToken}
              onChange={e => setGithubToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxx"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? '분석 중...' : '다이어그램 생성'}
          </button>
        </form>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
