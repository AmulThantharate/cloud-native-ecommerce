variable "project_name" {
  description = "The name of the project"
  type        = string
}

variable "environment" {
  description = "The deployment environment (dev, staging, prod)"
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

variable "db_password" {
  description = "The password for the RDS database"
  type        = string
  sensitive   = true
}

variable "allowed_cidr_blocks" {
  description = "List of CIDR blocks allowed to access the RDS instance"
  type        = list(string)
}
