# TR8 INTELLIGENCE - Multi-Region AWS Infrastructure
# Low-Data-Escape Architecture for 200M Users

terraform {
  required_version = ">= 1.0.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.0"
    }
  }
  
  backend "s3" {
    bucket         = "tr8-terraform-state"
    key            = "global/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "tr8-terraform-lock"
  }
}

# Primary Region (us-east-1)
provider "aws" {
  alias  = "primary"
  region = "us-east-1"
  
  default_tags {
    tags = {
      Environment = "production"
      Project     = "tr8-intelligence"
      Team        = "infrastructure"
      CostCenter  = "engineering"
    }
  }
}

# Secondary Regions
provider "aws" {
  alias  = "eu-west-1"
  region = "eu-west-1"
}

provider "aws" {
  alias  = "ap-southeast-1"
  region = "ap-southeast-1"
}

provider "aws" {
  alias  = "sa-east-1"
  region = "sa-east-1"
}

# Global Variables
variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

variable "project" {
  description = "Project name"
  type        = string
  default     = "tr8-intelligence"
}

# ============================================================================
# GLOBAL INFRASTRUCTURE
# ============================================================================

# Route 53 Hosted Zone
resource "aws_route53_zone" "primary" {
  name = "tr8.intelligence"
  
  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

# ACM Certificate (us-east-1 for CloudFront)
resource "aws_acm_certificate" "cloudfront" {
  provider    = aws.primary
  domain_name = "*.tr8.intelligence"
  
  validation_method = "DNS"
  
  lifecycle {
    create_before_destroy = true
  }
}

# ============================================================================
# MODULES
# ============================================================================

# Primary Region (us-east-1)
module "primary_region" {
  source = "./regions/us-east-1"
  
  environment = var.environment
  project     = var.project
  
  # Global references
  route53_zone_id = aws_route53_zone.primary.zone_id
  acm_certificate_arn = aws_acm_certificate.cloudfront.arn
  
  providers = {
    aws = aws.primary
  }
}

# EU Region (eu-west-1)
module "eu_region" {
  source = "./regions/eu-west-1"
  
  environment = var.environment
  project     = var.project
  
  # Global references
  route53_zone_id = aws_route53_zone.primary.zone_id
  
  providers = {
    aws = aws.eu-west-1
  }
}

# APAC Region (ap-southeast-1)
module "apac_region" {
  source = "./regions/ap-southeast-1"
  
  environment = var.environment
  project     = var.project
  
  # Global references
  route53_zone_id = aws_route53_zone.primary.zone_id
  
  providers = {
    aws = aws.ap-southeast-1
  }
}

# SA Region (sa-east-1)
module "sa_region" {
  source = "./regions/sa-east-1"
  
  environment = var.environment
  project     = var.project
  
  # Global references
  route53_zone_id = aws_route53_zone.primary.zone_id
  
  providers = {
    aws = aws.sa-east-1
  }
}

# ============================================================================
# GLOBAL OUTPUTS
# ============================================================================

output "route53_zone_id" {
  value = aws_route53_zone.primary.zone_id
}

output "cloudfront_certificate_arn" {
  value = aws_acm_certificate.cloudfront.arn
}

output "primary_region_outputs" {
  value = module.primary_region
}

output "eu_region_outputs" {
  value = module.eu_region
}

output "apac_region_outputs" {
  value = module.apac_region
}

output "sa_region_outputs" {
  value = module.sa_region
}
