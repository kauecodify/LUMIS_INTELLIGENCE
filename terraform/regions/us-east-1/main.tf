# TR8 INTELLIGENCE - us-east-1 Region
# Primary region with full infrastructure

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "project" {
  description = "Project name"
  type        = string
}

variable "route53_zone_id" {
  description = "Route 53 Hosted Zone ID"
  type        = string
}

variable "acm_certificate_arn" {
  description = "ACM Certificate ARN for CloudFront"
  type        = string
  default     = ""
}

# ============================================================================
# NETWORKING
# ============================================================================

# VPC with 3 AZs
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  
  tags = {
    Name        = "${var.project}-${var.environment}-us-east-1"
    Environment = var.environment
    Project     = var.project
  }
}

# Public Subnets
resource "aws_subnet" "public" {
  count             = 3
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index}.0/24"
  availability_zone = "us-east-1${element(["a", "b", "c"], count.index)}"
  
  tags = {
    Name        = "${var.project}-public-${element(["a", "b", "c"], count.index)}"
    Environment = var.environment
    Project     = var.project
    Type        = "public"
  }
}

# Private Subnets
resource "aws_subnet" "private" {
  count             = 3
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = "us-east-1${element(["a", "b", "c"], count.index)}"
  
  tags = {
    Name        = "${var.project}-private-${element(["a", "b", "c"], count.index)}"
    Environment = var.environment
    Project     = var.project
    Type        = "private"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  
  tags = {
    Name        = "${var.project}-igw"
    Environment = var.environment
    Project     = var.project
  }
}

# NAT Gateways (one per AZ)
resource "aws_eip" "nat" {
  count = 3
  domain = "vpc"
  
  tags = {
    Name        = "${var.project}-eip-${element(["a", "b", "c"], count.index)}"
    Environment = var.environment
    Project     = var.project
  }
}

resource "aws_nat_gateway" "main" {
  count         = 3
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id
  
  tags = {
    Name        = "${var.project}-nat-${element(["a", "b", "c"], count.index)}"
    Environment = var.environment
    Project     = var.project
  }
}

# Route Tables
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
  
  tags = {
    Name        = "${var.project}-public-rt"
    Environment = var.environment
    Project     = var.project
  }
}

resource "aws_route_table" "private" {
  count  = 3
  vpc_id = aws_vpc.main.id
  
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[count.index].id
  }
  
  tags = {
    Name        = "${var.project}-private-rt-${element(["a", "b", "c"], count.index)}"
    Environment = var.environment
    Project     = var.project
  }
}

# Route Table Associations
resource "aws_route_table_association" "public" {
  count          = 3
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private" {
  count          = 3
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

# ============================================================================
# SECURITY
# ============================================================================

# Security Groups
resource "aws_security_group" "lambda" {
  name        = "${var.project}-lambda-sg"
  description = "Security group for Lambda functions"
  vpc_id      = aws_vpc.main.id
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name        = "${var.project}-lambda-sg"
    Environment = var.environment
    Project     = var.project
  }
}

resource "aws_security_group" "dynamodb" {
  name        = "${var.project}-dynamodb-sg"
  description = "Security group for DynamoDB"
  vpc_id      = aws_vpc.main.id
  
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [aws_vpc.main.cidr_block]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name        = "${var.project}-dynamodb-sg"
    Environment = var.environment
    Project     = var.project
  }
}

# ============================================================================
# API GATEWAY
# ============================================================================

resource "aws_apigatewayv2_api" "main" {
  name          = "${var.project}-api"
  description   = "TR8 Intelligence Main API"
  protocol_type = "HTTP"
  
  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

# API Gateway Custom Domain
resource "aws_apigatewayv2_domain_name" "main" {
  domain_name = "api.tr8.intelligence"
  
  domain_name_configuration {
    certificate_arn = var.acm_certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
  
  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

resource "aws_apigatewayv2_api_mapping" "main" {
  api_id      = aws_apigatewayv2_api.main.id
  domain_name = aws_apigatewayv2_domain_name.main.id
  stage       = aws_apigatewayv2_stage.main.id
}

# API Gateway Stage
resource "aws_apigatewayv2_stage" "main" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = "$default"
  auto_deploy = true
  
  default_route_settings {
    throttling_burst_limit = 10000
    throttling_rate_limit  = 5000
  }
  
  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format          = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      caller         = "$context.identity.caller"
      user           = "$context.identity.user"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      resourcePath   = "$context.resourcePath"
      status         = "$context.status"
      protocol       = "$context.protocol"
      responseLength = "$context.responseLength"
    })
  }
  
  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

# CloudWatch Log Group for API Gateway
resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/apigateway/${var.project}"
  retention_in_days = 30
  
  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

# ============================================================================
# LAMBDA FUNCTIONS
# ============================================================================

# IAM Role for Lambda
resource "aws_iam_role" "lambda_exec" {
  name = "${var.project}-lambda-exec-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
  
  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

# IAM Policy for Lambda
resource "aws_iam_policy" "lambda_basic" {
  name        = "${var.project}-lambda-basic-policy"
  description = "Basic execution policy for Lambda"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "xray:PutTraceSegments",
          "xray:PutTelemetryRecords"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = "arn:aws:dynamodb:*:*:table/${var.project}-*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${var.project}-*",
          "arn:aws:s3:::${var.project}-*/*"
        ]
      }
    ]
  })
  
  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

# Attach Policy to Role
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_basic.arn
}

# Lambda Layer for Shared Dependencies
resource "aws_lambda_layer_version" "shared" {
  layer_name          = "${var.project}-shared"
  description         = "Shared dependencies for TR8 Lambda functions"
  filename            = "../../../src/lambda/layers/shared.zip"
  compatible_runtimes = ["python3.9", "python3.10", "python3.11"]
  
  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

# Example Lambda Function (API Handler)
resource "aws_lambda_function" "api_handler" {
  function_name = "${var.project}-api-handler"
  description   = "Main API request handler"
  role          = aws_iam_role.lambda_exec.arn
  
  runtime     = "python3.11"
  handler     = "api_handler.lambda_handler"
  memory_size = 512
  timeout     = 30
  
  filename      = "../../../src/lambda/api/handlers/api_handler.zip"
  
  layers = [aws_lambda_layer_version.shared.arn]
  
  environment {
    variables = {
      ENVIRONMENT = var.environment
      PROJECT     = var.project
      REGION      = "us-east-1"
    }
  }
  
  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

# Lambda Provisioned Concurrency
resource "aws_lambda_provisioned_concurrency_config" "api_handler" {
  function_name                     = aws_lambda_function.api_handler.function_name
  provisioned_concurrent_executions = 100
  qualifier                         = aws_lambda_function.api_handler.version
}

# ============================================================================
# DYNAMODB
# ============================================================================

# Users Table (Global Table)
resource "aws_dynamodb_table" "users" {
  name           = "${var.project}-users"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "user_id"
  
  attribute {
    name = "user_id"
    type = "S"
  }
  
  attribute {
    name = "email"
    type = "S"
  }
  
  global_secondary_index {
    name            = "email-index"
    hash_key        = "email"
    projection_type = "ALL"
  }
  
  # Enable Global Table for multi-region
  replication {
    region = "eu-west-1"
  }
  
  replication {
    region = "ap-southeast-1"
  }
  
  point_in_time_recovery {
    enabled = true
  }
  
  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.main.arn
  }
  
  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

# Sessions Table
resource "aws_dynamodb_table" "sessions" {
  name           = "${var.project}-sessions"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "session_id"
  
  attribute {
    name = "session_id"
    type = "S"
  }
  
  attribute {
    name = "user_id"
    type = "S"
  }
  
  global_secondary_index {
    name            = "user-index"
    hash_key        = "user_id"
    projection_type = "ALL"
  }
  
  ttl {
    attribute_name = "expires_at"
    enabled        = true
  }
  
  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.main.arn
  }
  
  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

# ============================================================================
# S3
# ============================================================================

# Data Lake Bucket
resource "aws_s3_bucket" "data_lake" {
  bucket = "${var.project}-data-lake-us-east-1"
  
  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

# Bucket Versioning
resource "aws_s3_bucket_versioning" "data_lake" {
  bucket = aws_s3_bucket.data_lake.id
  
  versioning_configuration {
    status = "Enabled"
  }
}

# Bucket Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "data_lake" {
  bucket = aws_s3_bucket.data_lake.id
  
  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.main.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

# Lifecycle Policy
resource "aws_s3_bucket_lifecycle_configuration" "data_lake" {
  bucket = aws_s3_bucket.data_lake.id
  
  rule {
    id     = "move-to-ia"
    status = "Enabled"
    
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
    
    transition {
      days          = 90
      storage_class = "GLACIER"
    }
    
    expiration {
      days = 365
    }
  }
}

# ============================================================================
# CLOUDFRONT
# ============================================================================

resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = ["cdn.tr8.intelligence"]
  
  origin {
    domain_name = aws_apigatewayv2_api.main.api_endpoint
    origin_id   = "api-gateway"
    
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }
  
  origin {
    domain_name = aws_s3_bucket.data_lake.bucket_regional_domain_name
    origin_id   = "s3-data-lake"
    
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
    }
  }
  
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "api-gateway"
    
    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
      headers = ["*"]
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 300
    max_ttl                = 86400
    compress               = true
  }
  
  ordered_cache_behavior {
    path_pattern     = "/static/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-data-lake"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 3600
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
  }
  
  price_class = "PriceClass_100"
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
  
  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

resource "aws_cloudfront_origin_access_identity" "main" {
  comment = "TR8 Intelligence OAI"
}

# ============================================================================
# KMS
# ============================================================================

resource "aws_kms_key" "main" {
  description             = "TR8 Intelligence KMS Key"
  deletion_window_in_days = 30
  enable_key_rotation     = true
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      }
    ]
  })
  
  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

# ============================================================================
# CLOUDWATCH
# ============================================================================

# Log Group for Lambda
resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${var.project}"
  retention_in_days = 30
  
  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

# Metric Alarms
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "${var.project}-lambda-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = "300"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "Lambda function errors"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  
  dimensions = {
    FunctionName = aws_lambda_function.api_handler.function_name
  }
  
  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

# ============================================================================
# SNS
# ============================================================================

resource "aws_sns_topic" "alerts" {
  name = "${var.project}-alerts"
  
  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

# ============================================================================
# DATA SOURCES
# ============================================================================

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

# ============================================================================
# OUTPUTS
# ============================================================================

output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnets" {
  value = aws_subnet.public[*].id
}

output "private_subnets" {
  value = aws_subnet.private[*].id
}

output "api_gateway_endpoint" {
  value = aws_apigatewayv2_api.main.api_endpoint
}

output "api_domain" {
  value = aws_apigatewayv2_domain_name.main.domain_name
}

output "dynamodb_users_table" {
  value = aws_dynamodb_table.users.name
}

output "s3_data_lake_bucket" {
  value = aws_s3_bucket.data_lake.bucket
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.main.domain_name
}

output "lambda_api_handler" {
  value = aws_lambda_function.api_handler.function_name
}

output "kms_key_arn" {
  value = aws_kms_key.main.arn
}

output "sns_alerts_topic_arn" {
  value = aws_sns_topic.alerts.arn
}
