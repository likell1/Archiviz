export interface IconEntry {
  path: string;
  aliases: string[];
}

export const ICON_MAP: Record<string, IconEntry> = {
  // ── AWS ──────────────────────────────────────────────────────────────────
  'Amazon EC2':           { path: '/icons/aws/ec2.svg',           aliases: ['EC2', 'AWS EC2', 'ec2'] },
  'Amazon RDS':           { path: '/icons/aws/rds.svg',           aliases: ['RDS', 'AWS RDS', 'PostgreSQL on RDS', 'MySQL on RDS'] },
  'Amazon S3':            { path: '/icons/aws/s3.svg',            aliases: ['S3', 'AWS S3', 's3'] },
  'AWS Lambda':           { path: '/icons/aws/lambda.svg',        aliases: ['Lambda', 'lambda'] },
  'Amazon ECS':           { path: '/icons/aws/ecs.svg',           aliases: ['ECS', 'AWS ECS'] },
  'Amazon EKS':           { path: '/icons/aws/eks.svg',           aliases: ['EKS', 'AWS EKS'] },
  'Amazon SQS':           { path: '/icons/aws/sqs.svg',           aliases: ['SQS', 'AWS SQS'] },
  'Amazon SNS':           { path: '/icons/aws/sns.svg',           aliases: ['SNS', 'AWS SNS'] },
  'Amazon ElastiCache':   { path: '/icons/aws/elasticache.svg',   aliases: ['ElastiCache', 'AWS ElastiCache'] },
  'Amazon CloudFront':    { path: '/icons/aws/cloudfront.svg',    aliases: ['CloudFront', 'AWS CloudFront', 'CDN'] },
  'Amazon Route 53':      { path: '/icons/aws/route53.svg',       aliases: ['Route53', 'Route 53', 'AWS Route53'] },
  'Elastic Load Balancing': { path: '/icons/aws/elb.svg',         aliases: ['ELB', 'ALB', 'NLB', 'Load Balancer'] },
  'Amazon VPC':           { path: '/icons/aws/vpc.svg',           aliases: ['VPC', 'AWS VPC'] },
  'Amazon API Gateway':   { path: '/icons/aws/apigateway.svg',    aliases: ['API Gateway', 'AWS API Gateway'] },
  'AWS CloudWatch':       { path: '/icons/aws/cloudwatch.svg',    aliases: ['CloudWatch', 'cloudwatch'] },
  'Amazon DynamoDB':      { path: '/icons/aws/dynamodb.svg',      aliases: ['DynamoDB', 'dynamo'] },
  'Amazon Redshift':      { path: '/icons/aws/redshift.svg',      aliases: ['Redshift'] },
  'Amazon Kinesis':       { path: '/icons/aws/kinesis.svg',       aliases: ['Kinesis'] },
  'AWS Fargate':          { path: '/icons/aws/fargate.svg',       aliases: ['Fargate'] },
  'Amazon ECR':           { path: '/icons/aws/ecr.svg',           aliases: ['ECR', 'AWS ECR'] },

  // ── GCP ──────────────────────────────────────────────────────────────────
  'Google Cloud':              { path: '/icons/gcp/gcp.svg',              aliases: ['GCP', 'Google Cloud Platform'] },
  'Google Compute Engine':     { path: '/icons/gcp/compute-engine.svg',   aliases: ['GCE', 'Compute Engine'] },
  'Google Cloud Storage':      { path: '/icons/gcp/cloud-storage.svg',    aliases: ['GCS', 'Cloud Storage'] },
  'Google Cloud Functions':    { path: '/icons/gcp/cloud-functions.svg',  aliases: ['Cloud Functions', 'GCF'] },
  'Google Cloud Run':          { path: '/icons/gcp/cloud-run.svg',        aliases: ['Cloud Run'] },
  'Google Cloud SQL':          { path: '/icons/gcp/cloud-sql.svg',        aliases: ['Cloud SQL', 'GCP SQL'] },
  'Google BigQuery':           { path: '/icons/gcp/bigquery.svg',         aliases: ['BigQuery', 'BQ'] },
  'Google Bigtable':           { path: '/icons/gcp/bigtable.svg',         aliases: ['Bigtable', 'Cloud Bigtable'] },
  'Google Pub/Sub':            { path: '/icons/gcp/pubsub.svg',           aliases: ['Pub/Sub', 'PubSub', 'Cloud Pub/Sub'] },
  'Google Kubernetes Engine':  { path: '/icons/gcp/gke.svg',              aliases: ['GKE', 'Google Kubernetes'] },
  'Google Dataflow':           { path: '/icons/gcp/dataflow.svg',         aliases: ['Dataflow', 'Cloud Dataflow'] },
  'Google Dataproc':           { path: '/icons/gcp/dataproc.svg',         aliases: ['Dataproc', 'Cloud Dataproc'] },
  'Google Cloud Spanner':      { path: '/icons/gcp/cloud-spanner.svg',    aliases: ['Cloud Spanner', 'Spanner'] },
  'Google Cloud Composer':     { path: '/icons/gcp/cloud-composer.svg',   aliases: ['Cloud Composer'] },

  // ── Azure ─────────────────────────────────────────────────────────────────
  'Microsoft Azure':                { path: '/icons/azure/azure.svg',              aliases: ['Azure'] },
  'Azure Virtual Machines':         { path: '/icons/azure/vm.svg',                 aliases: ['Azure VM', 'Azure VMs', 'Azure Compute'] },
  'Azure Blob Storage':             { path: '/icons/azure/blob-storage.svg',       aliases: ['Azure Storage', 'Blob Storage', 'Azure Blob'] },
  'Azure Functions':                { path: '/icons/azure/functions.svg',          aliases: ['Azure Function', 'Azure Serverless'] },
  'Azure SQL Database':             { path: '/icons/azure/sql.svg',                aliases: ['Azure SQL', 'Azure SQL DB'] },
  'Azure Cosmos DB':                { path: '/icons/azure/cosmos-db.svg',          aliases: ['Cosmos DB', 'CosmosDB', 'Azure CosmosDB'] },
  'Azure Service Bus':              { path: '/icons/azure/service-bus.svg',        aliases: ['Service Bus', 'Azure ServiceBus'] },
  'Azure Kubernetes Service':       { path: '/icons/azure/aks.svg',                aliases: ['AKS', 'Azure AKS'] },
  'Azure Container Registry':       { path: '/icons/azure/container-registry.svg', aliases: ['ACR', 'Azure ACR'] },
  'Azure App Service':              { path: '/icons/azure/app-service.svg',        aliases: ['App Service', 'Azure Web App'] },
  'Azure Event Hubs':               { path: '/icons/azure/event-hubs.svg',         aliases: ['Event Hubs', 'Azure EventHub'] },
  'Azure Active Directory':         { path: '/icons/azure/active-directory.svg',   aliases: ['Azure AD', 'AAD', 'Entra ID'] },

  // ── Databases ─────────────────────────────────────────────────────────────
  'NGINX':          { path: '/icons/oss/nginx.svg',         aliases: ['nginx', 'Nginx', 'NGINX Proxy'] },
  'Redis':          { path: '/icons/oss/redis.svg',         aliases: ['redis', 'Redis Cache'] },
  'PostgreSQL':     { path: '/icons/oss/postgresql.svg',    aliases: ['postgres', 'Postgres', 'postgresql'] },
  'MySQL':          { path: '/icons/oss/mysql.svg',         aliases: ['mysql'] },
  'MongoDB':        { path: '/icons/oss/mongodb.svg',       aliases: ['mongo', 'mongodb'] },
  'MariaDB':        { path: '/icons/oss/mariadb.svg',       aliases: ['mariadb'] },
  'SQLite':         { path: '/icons/oss/sqlite.svg',        aliases: ['sqlite'] },
  'Microsoft SQL Server': { path: '/icons/oss/sqlserver.svg', aliases: ['SQL Server', 'MSSQL', 'MS SQL', 'SQL Server 2019', 'SQL Server 2022'] },
  'Oracle Database':      { path: '/icons/oss/oracle.svg',    aliases: ['Oracle', 'oracle', 'Oracle DB'] },
  'Cassandra':      { path: '/icons/oss/cassandra.svg',     aliases: ['cassandra', 'Apache Cassandra'] },
  'ClickHouse':     { path: '/icons/oss/clickhouse.svg',    aliases: ['clickhouse'] },
  'CockroachDB':    { path: '/icons/oss/cockroachdb.svg',   aliases: ['cockroachdb', 'Cockroach', 'CockroachLabs'] },
  'Supabase':       { path: '/icons/oss/supabase.svg',      aliases: ['supabase'] },
  'etcd':           { path: '/icons/oss/etcd.svg',          aliases: ['ETCD'] },
  'MinIO':          { path: '/icons/oss/minio.svg',         aliases: ['minio', 'Minio'] },

  // ── Messaging / Streaming ─────────────────────────────────────────────────
  'Kafka':          { path: '/icons/oss/kafka2.svg',        aliases: ['kafka', 'Apache Kafka'] },
  'RabbitMQ':       { path: '/icons/oss/rabbitmq.svg',      aliases: ['rabbitmq'] },

  // ── Monitoring / Observability ────────────────────────────────────────────
  'Prometheus':     { path: '/icons/oss/prometheus.svg',    aliases: ['prometheus'] },
  'Grafana':        { path: '/icons/oss/grafana.svg',       aliases: ['grafana'] },
  'Elasticsearch':  { path: '/icons/oss/elasticsearch.svg', aliases: ['elastic', 'elasticsearch', 'Elastic'] },
  'Kibana':         { path: '/icons/oss/kibana.svg',        aliases: ['kibana'] },
  'Datadog':        { path: '/icons/oss/datadog.svg',       aliases: ['datadog'] },
  'Sentry':         { path: '/icons/oss/sentry.svg',        aliases: ['sentry'] },
  'New Relic':      { path: '/icons/oss/newrelic.svg',      aliases: ['newrelic', 'NewRelic'] },
  'OpenTelemetry':  { path: '/icons/oss/opentelemetry.svg', aliases: ['otel', 'opentelemetry', 'OTel'] },
  'Jaeger':         { path: '/icons/oss/jaeger.svg',        aliases: ['jaeger'] },

  // ── Containers / Kubernetes / Service Mesh ────────────────────────────────
  'Docker':         { path: '/icons/oss/docker.svg',        aliases: ['docker'] },
  'Kubernetes':     { path: '/icons/oss/kubernetes.svg',    aliases: ['k8s', 'kubernetes'] },
  'Helm':           { path: '/icons/oss/helm.svg',          aliases: ['helm'] },
  'Istio':          { path: '/icons/oss/istio.svg',         aliases: ['istio'] },
  'Argo':           { path: '/icons/oss/argo.svg',          aliases: ['ArgoCD', 'Argo CD', 'argo', 'argocd'] },
  'Flux':           { path: '/icons/oss/flux.svg',          aliases: ['flux', 'Flux CD', 'FluxCD'] },

  // ── Infrastructure / DevOps ───────────────────────────────────────────────
  'Terraform':      { path: '/icons/oss/terraform.svg',     aliases: ['terraform', 'HashiCorp Terraform'] },
  'Vault':          { path: '/icons/oss/vault.svg',         aliases: ['vault', 'HashiCorp Vault'] },
  'Consul':         { path: '/icons/oss/consul.svg',        aliases: ['consul', 'HashiCorp Consul'] },
  'GitHub Actions': { path: '/icons/oss/github-actions.svg', aliases: ['github-actions', 'GH Actions'] },
  'GitHub':         { path: '/icons/oss/github.svg',        aliases: ['github', 'Github'] },
  'GitLab':         { path: '/icons/oss/gitlab.svg',        aliases: ['gitlab'] },
  'Jenkins':        { path: '/icons/oss/jenkins.svg',       aliases: ['jenkins'] },
  'HAPROXY':        { path: '/icons/oss/haproxy.svg',       aliases: ['HAProxy', 'haproxy'] },
  'Traefik':        { path: '/icons/oss/traefik.svg',       aliases: ['traefik'] },

  // ── Big Data / Streaming ──────────────────────────────────────────────────
  'Apache Spark':   { path: '/icons/oss/spark.svg',         aliases: ['Spark', 'spark'] },
  'Apache Airflow': { path: '/icons/oss/airflow.svg',       aliases: ['Airflow', 'airflow'] },
  'Apache Flink':   { path: '/icons/oss/flink.svg',         aliases: ['Flink', 'flink'] },

  // ── App Frameworks / Runtimes ─────────────────────────────────────────────
  'FastAPI':        { path: '/icons/oss/fastapi.svg',       aliases: ['fastapi'] },
  'Spring Boot':    { path: '/icons/oss/spring.svg',        aliases: ['Spring', 'spring', 'spring-boot'] },
  'Django':         { path: '/icons/oss/django.svg',        aliases: ['django'] },
  'Express':        { path: '/icons/oss/express.svg',       aliases: ['express', 'Express.js', 'expressjs'] },
  'Node.js':        { path: '/icons/oss/nodejs.svg',        aliases: ['nodejs', 'node', 'Node'] },
  'Celery':         { path: '/icons/oss/celery.svg',        aliases: ['celery'] },

  // ── Platforms ─────────────────────────────────────────────────────────────
  'Vercel':         { path: '/icons/oss/vercel.svg',        aliases: ['vercel'] },
  'Slack':          { path: '/icons/oss/slack.svg',         aliases: ['slack'] },
};

// alias → canonical name reverse index
const ALIAS_INDEX: Record<string, string> = {};
for (const [canonical, entry] of Object.entries(ICON_MAP)) {
  ALIAS_INDEX[canonical.toLowerCase()] = canonical;
  for (const alias of entry.aliases) {
    ALIAS_INDEX[alias.toLowerCase()] = canonical;
  }
}

export const FALLBACK_ICON = '/icons/generic/service.svg';

export function resolveIcon(service: string): string {
  if (ICON_MAP[service]) return ICON_MAP[service].path;
  const canonical = ALIAS_INDEX[service.toLowerCase()];
  if (canonical) return ICON_MAP[canonical].path;
  return FALLBACK_ICON;
}
