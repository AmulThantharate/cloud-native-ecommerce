variable "project_name" {
  description = "The name of the project"
  type        = string
}

variable "environment" {
  description = "The deployment environment (dev, staging, prod)"
  type        = string
}

variable "cluster_version" {
  description = "The EKS cluster version"
  type        = string
}

variable "vpc_id" {
  description = "The ID of the VPC"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs"
  type        = list(string)
}

variable "cluster_role_arn" {
  description = "The ARN of the EKS cluster role"
  type        = string
}

variable "node_role_arn" {
  description = "The ARN of the EKS node role"
  type        = string
}
