export interface IconEntry {
  path: string;
  aliases: string[];
}

export const ICON_MAP: Record<string, IconEntry> = {
  // AWS
  'Amazon EC2':          { path: '/icons/aws/ec2.svg',           aliases: ['EC2', 'AWS EC2', 'ec2'] },
  'Amazon RDS':          { path: '/icons/aws/rds.svg',           aliases: ['RDS', 'AWS RDS', 'PostgreSQL on RDS', 'MySQL on RDS'] },
  'Amazon S3':           { path: '/icons/aws/s3.svg',            aliases: ['S3', 'AWS S3', 's3'] },
  'AWS Lambda':          { path: '/icons/aws/lambda.svg',        aliases: ['Lambda', 'lambda'] },
  'Amazon ECS':          { path: '/icons/aws/ecs.svg',           aliases: ['ECS', 'AWS ECS'] },
  'Amazon EKS':          { path: '/icons/aws/eks.svg',           aliases: ['EKS', 'AWS EKS'] },
  'Amazon SQS':          { path: '/icons/aws/sqs.svg',           aliases: ['SQS', 'AWS SQS'] },
  'Amazon SNS':          { path: '/icons/aws/sns.svg',           aliases: ['SNS', 'AWS SNS'] },
  'Amazon ElastiCache':  { path: '/icons/aws/elasticache.svg',   aliases: ['ElastiCache', 'AWS ElastiCache'] },
  'Amazon CloudFront':   { path: '/icons/aws/cloudfront.svg',    aliases: ['CloudFront', 'AWS CloudFront', 'CDN'] },
  'Amazon Route 53':     { path: '/icons/aws/route53.svg',       aliases: ['Route53', 'Route 53', 'AWS Route53'] },
  'Elastic Load Balancing': { path: '/icons/aws/elb.svg',        aliases: ['ELB', 'ALB', 'NLB', 'Load Balancer'] },
  'Amazon VPC':          { path: '/icons/aws/vpc.svg',           aliases: ['VPC', 'AWS VPC'] },
  'Amazon API Gateway':  { path: '/icons/aws/apigateway.svg',    aliases: ['API Gateway', 'AWS API Gateway'] },
  'AWS CloudWatch':      { path: '/icons/aws/cloudwatch.svg',    aliases: ['CloudWatch', 'cloudwatch'] },
  'Amazon DynamoDB':     { path: '/icons/aws/dynamodb.svg',      aliases: ['DynamoDB', 'dynamo'] },
  'Amazon Redshift':     { path: '/icons/aws/redshift.svg',      aliases: ['Redshift'] },
  'Amazon Kinesis':      { path: '/icons/aws/kinesis.svg',       aliases: ['Kinesis'] },
  'AWS Fargate':         { path: '/icons/aws/fargate.svg',       aliases: ['Fargate'] },
  'Amazon ECR':          { path: '/icons/aws/ecr.svg',           aliases: ['ECR', 'AWS ECR'] },

  // OSS
  'NGINX':          { path: '/icons/oss/nginx.svg',         aliases: ['nginx', 'Nginx', 'NGINX Proxy'] },
  'Redis':          { path: '/icons/oss/redis.svg',         aliases: ['redis', 'Redis Cache'] },
  'PostgreSQL':     { path: '/icons/oss/postgresql.svg',    aliases: ['postgres', 'Postgres', 'postgresql'] },
  'MySQL':          { path: '/icons/oss/mysql.svg',         aliases: ['mysql'] },
  'MongoDB':        { path: '/icons/oss/mongodb.svg',       aliases: ['mongo', 'mongodb'] },
  'Kafka':          { path: '/icons/oss/kafka.svg',         aliases: ['kafka', 'Apache Kafka'] },
  'RabbitMQ':       { path: '/icons/oss/rabbitmq.svg',      aliases: ['rabbitmq'] },
  'Prometheus':     { path: '/icons/oss/prometheus.svg',    aliases: ['prometheus'] },
  'Grafana':        { path: '/icons/oss/grafana.svg',       aliases: ['grafana'] },
  'Elasticsearch':  { path: '/icons/oss/elasticsearch.svg', aliases: ['elastic', 'elasticsearch'] },
  'Kibana':         { path: '/icons/oss/kibana.svg',        aliases: ['kibana'] },
  'Docker':         { path: '/icons/oss/docker.svg',        aliases: ['docker'] },
  'Kubernetes':     { path: '/icons/oss/kubernetes.svg',    aliases: ['k8s', 'kubernetes'] },
  'GitHub Actions': { path: '/icons/oss/github-actions.svg', aliases: ['github-actions', 'GH Actions'] },
  'Jenkins':        { path: '/icons/oss/jenkins.svg',       aliases: ['jenkins'] },
  'Slack':          { path: '/icons/oss/slack.svg',         aliases: ['slack'] },
};

// alias → canonical name 역방향 인덱스
const ALIAS_INDEX: Record<string, string> = {};
for (const [canonical, entry] of Object.entries(ICON_MAP)) {
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
