#!/usr/bin/env node
// Run: node scripts/generate-icons.mjs
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public', 'icons');

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function svgFromSI(icon) {
  return `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#${icon.hex}" d="${icon.path}"/></svg>`;
}

const si = (await import('simple-icons')).default ?? await import('simple-icons');

const FROM_SI = [
  // Apache / OSS
  { key: 'siApachespark',    file: 'oss/spark.svg' },
  { key: 'siApacheairflow',  file: 'oss/airflow.svg' },
  { key: 'siApachecassandra',file: 'oss/cassandra.svg' },
  { key: 'siApacheflink',    file: 'oss/flink.svg' },
  { key: 'siApachekafka',    file: 'oss/kafka2.svg' },
  // Infra / DevOps
  { key: 'siTerraform',      file: 'oss/terraform.svg' },
  { key: 'siVault',          file: 'oss/vault.svg' },
  { key: 'siConsul',         file: 'oss/consul.svg' },
  { key: 'siHelm',           file: 'oss/helm.svg' },
  { key: 'siArgo',           file: 'oss/argo.svg' },
  { key: 'siGitlab',         file: 'oss/gitlab.svg' },
  { key: 'siFlux',           file: 'oss/flux.svg' },
  { key: 'siIstio',          file: 'oss/istio.svg' },
  // Monitoring
  { key: 'siDatadog',        file: 'oss/datadog.svg' },
  { key: 'siSentry',         file: 'oss/sentry.svg' },
  { key: 'siNewrelic',       file: 'oss/newrelic.svg' },
  { key: 'siOpentelemetry',  file: 'oss/opentelemetry.svg' },
  { key: 'siJaeger',         file: 'oss/jaeger.svg' },
  // Databases
  { key: 'siMariadb',        file: 'oss/mariadb.svg' },
  { key: 'siSqlite',         file: 'oss/sqlite.svg' },
  { key: 'siSupabase',       file: 'oss/supabase.svg' },
  { key: 'siClickhouse',     file: 'oss/clickhouse.svg' },
  { key: 'siCockroachlabs',  file: 'oss/cockroachdb.svg' },
  { key: 'siEtcd',           file: 'oss/etcd.svg' },
  { key: 'siMinio',          file: 'oss/minio.svg' },
  // App / Frameworks
  { key: 'siFastapi',        file: 'oss/fastapi.svg' },
  { key: 'siSpring',         file: 'oss/spring.svg' },
  { key: 'siDjango',         file: 'oss/django.svg' },
  { key: 'siExpress',        file: 'oss/express.svg' },
  { key: 'siNodedotjs',      file: 'oss/nodejs.svg' },
  { key: 'siCelery',         file: 'oss/celery.svg' },
  { key: 'siVercel',         file: 'oss/vercel.svg' },
  { key: 'siGithub',         file: 'oss/github.svg' },
  // GCP
  { key: 'siGooglecloud',          file: 'gcp/gcp.svg' },
  { key: 'siGooglebigquery',        file: 'gcp/bigquery.svg' },
  { key: 'siGooglebigtable',        file: 'gcp/bigtable.svg' },
  { key: 'siGooglecloudstorage',    file: 'gcp/cloud-storage.svg' },
  { key: 'siGooglepubsub',          file: 'gcp/pubsub.svg' },
  { key: 'siGoogledataflow',        file: 'gcp/dataflow.svg' },
  { key: 'siGoogledataproc',        file: 'gcp/dataproc.svg' },
  { key: 'siGooglecloudcomposer',   file: 'gcp/cloud-composer.svg' },
  { key: 'siGooglecloudspanner',    file: 'gcp/cloud-spanner.svg' },
];

ensureDir(join(publicDir, 'oss'));
ensureDir(join(publicDir, 'gcp'));
ensureDir(join(publicDir, 'azure'));

let ok = 0, fail = 0;
for (const { key, file } of FROM_SI) {
  const icon = si[key];
  if (icon) {
    writeFileSync(join(publicDir, file), svgFromSI(icon));
    console.log(`✓ ${file}`);
    ok++;
  } else {
    console.warn(`✗ NOT FOUND: ${key}`);
    fail++;
  }
}
console.log(`\nGenerated ${ok} icons, ${fail} missing.`);
