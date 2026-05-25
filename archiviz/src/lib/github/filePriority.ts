export interface PriorityPattern {
  pattern: RegExp;
  priority: number;
}

export const FILE_PRIORITY_PATTERNS: PriorityPattern[] = [
  // P1 — 항상 읽기
  { pattern: /^docker-compose.*\.ya?ml$/i,        priority: 1 },
  { pattern: /^.*\/docker-compose.*\.ya?ml$/i,    priority: 1 },
  { pattern: /\.tf$/i,                            priority: 1 },
  { pattern: /^k8s\/.*\.ya?ml$/i,                 priority: 1 },
  { pattern: /^kubernetes\/.*\.ya?ml$/i,           priority: 1 },
  { pattern: /^helm\/.*\/values\.ya?ml$/i,         priority: 1 },

  // P2 — 권장
  { pattern: /^Dockerfile$/,                      priority: 2 },
  { pattern: /\/Dockerfile$/,                     priority: 2 },
  { pattern: /^\.env\.example$/,                  priority: 2 },
  { pattern: /^package\.json$/,                   priority: 2 },
  { pattern: /^requirements\.txt$/,               priority: 2 },
  { pattern: /^go\.mod$/,                         priority: 2 },
  { pattern: /^build\.gradle(\.kts)?$/,           priority: 2 },
  { pattern: /nginx\.conf$/i,                     priority: 2 },

  // P3 — 선택
  { pattern: /^\.github\/workflows\/.*\.ya?ml$/i, priority: 3 },
  { pattern: /^\.gitlab-ci\.ya?ml$/i,             priority: 3 },
  { pattern: /^Jenkinsfile$/,                     priority: 3 },
  { pattern: /application\.ya?ml$/i,              priority: 3 },
  { pattern: /appsettings\.json$/i,               priority: 3 },
];

const MAX_FILES = 15;
const MAX_CONTENT_LENGTH = 8000;

export interface PrioritizedFile {
  path: string;
  priority: number;
}

export function selectPriorityFiles(filePaths: string[]): PrioritizedFile[] {
  const matched: PrioritizedFile[] = [];

  for (const filePath of filePaths) {
    for (const { pattern, priority } of FILE_PRIORITY_PATTERNS) {
      if (pattern.test(filePath)) {
        matched.push({ path: filePath, priority });
        break;
      }
    }
  }

  matched.sort((a, b) => a.priority - b.priority);
  return matched.slice(0, MAX_FILES);
}

export function truncateContent(content: string): string {
  if (content.length <= MAX_CONTENT_LENGTH) return content;
  return content.slice(0, MAX_CONTENT_LENGTH) + '\n... (truncated)';
}
