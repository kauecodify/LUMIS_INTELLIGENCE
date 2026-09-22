# Variables for us-east-1 region

variable "environment" {
  description = "Deployment environment (dev, staging, production)"
  type        = string
}

variable "project" {
  description = "Project name"
  type        = string
}

variable "route53_zone_id" {
  description = "Route 53 Hosted Zone ID for domain"
  type        = string
}

variable "acm_certificate_arn" {
  description = "ACM Certificate ARN for CloudFront"
  type        = string
  default     = ""
}
